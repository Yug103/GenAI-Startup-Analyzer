import re
from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token
from database import get_connection
from psycopg2.extras import RealDictCursor
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

auth_bp = Blueprint("auth", __name__)

# Validates if an email address is formed correctly according to standard regex patterns
def is_valid_email(email):
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(email_regex, email) is not None

import random
from datetime import datetime, timedelta, timezone
import requests

# Handles user registration by validating inputs, hashing password, checking for duplicates, and saving to database
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Input validation
    if not full_name:
        return jsonify({"error": "Full name is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    # Hash password with bcrypt
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check email duplicate
            cur.execute("SELECT id FROM users WHERE email = %s;", (email,))
            if cur.fetchone():
                return jsonify({"error": "Email is already registered"}), 409

            # Save user to database
            cur.execute(
                "INSERT INTO users (full_name, email, password_hash) VALUES (%s, %s, %s) RETURNING id;",
                (full_name, email, password_hash)
            )
            user_id = cur.fetchone()["id"]
            conn.commit()
            
            return jsonify({
                "message": "User registered successfully",
                "user_id": user_id
            }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"An error occurred while creating the account: {str(e)}"}), 500
    finally:
        conn.close()

# Logs in a user by verifying their credentials and returning a JWT token
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, password_hash, full_name, email FROM users WHERE email = %s;", (email,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({"error": "Invalid email or password"}), 401

            # Validate password
            password_hash = user["password_hash"].encode("utf-8")
            if not bcrypt.checkpw(password.encode("utf-8"), password_hash):
                return jsonify({"error": "Invalid email or password"}), 401

            # Create token with user ID as identity
            token = create_access_token(identity=str(user["id"]))
            return jsonify({
                "token": token,
                "user": {
                    "id": user["id"],
                    "full_name": user["full_name"],
                    "email": user["email"]
                }
            }), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred during login: {str(e)}"}), 500
    finally:
        conn.close()

@auth_bp.route("/google-login", methods=["POST"])
def google_login():
    data = request.get_json() or {}
    token = data.get("credential")
    
    if not token:
        return jsonify({"error": "Missing Google credential"}), 400

    try:
        # Verify the Google token
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
        
        email = idinfo.get("email")
        full_name = idinfo.get("name", "Google User")
        
        if not email:
            return jsonify({"error": "Google token did not contain an email address"}), 400
            
        conn = get_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, full_name, email FROM users WHERE email = %s;", (email,))
                user = cur.fetchone()
                
                if not user:
                    # Create new user without password_hash
                    cur.execute(
                        "INSERT INTO users (full_name, email) VALUES (%s, %s) RETURNING id;",
                        (full_name, email)
                    )
                    user_id = cur.fetchone()["id"]
                    user = {
                        "id": user_id,
                        "full_name": full_name,
                        "email": email
                    }
                    conn.commit()

                # Create JWT token
                access_token = create_access_token(identity=str(user["id"]))
                return jsonify({
                    "token": access_token,
                    "user": {
                        "id": user["id"],
                        "full_name": user["full_name"],
                        "email": user["email"]
                    }
                }), 200
        except Exception as db_err:
            conn.rollback()
            return jsonify({"error": f"Database error during Google login: {str(db_err)}"}), 500
        finally:
            conn.close()

    except ValueError as ve:
        return jsonify({"error": "Invalid Google token"}), 401
    except Exception as e:
        return jsonify({"error": f"An error occurred during Google login: {str(e)}"}), 500

import random
from datetime import datetime, timedelta, timezone
import requests

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE email = %s;", (email,))
            if not cur.fetchone():
                return jsonify({"error": "No account found with that email address"}), 404

            # Generate 6 digit OTP
            otp = str(random.randint(100000, 999999))
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

            # Invalidate previous OTPs for this email
            cur.execute("DELETE FROM password_resets WHERE email = %s;", (email,))

            # Store OTP
            cur.execute(
                "INSERT INTO password_resets (email, otp, expires_at) VALUES (%s, %s, %s);",
                (email, otp, expires_at)
            )
            conn.commit()

            # Send Email via Resend API
            resend_api_key = os.getenv("RESEND_API_KEY")
            if not resend_api_key:
                print(f"DEV MODE OTP for {email}: {otp}")
                return jsonify({"message": "If an account with that email exists, an OTP has been sent. (Check console, RESEND_API_KEY missing)"}), 200

            html_email = f"""
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8f9fa; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #534ab7; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">IdeaValidator</h2>
                </div>
                <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); border: 1px solid #edf2f7;">
                    <h3 style="color: #1a202c; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Reset your password</h3>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        We received a request to reset the password for your IdeaValidator account. Please use the verification code below to set a new password:
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: inline-block;">
                            <span style="font-family: monospace; font-size: 36px; font-weight: bold; color: #534ab7; letter-spacing: 8px;">{otp}</span>
                        </div>
                    </div>
                    <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
                        This code will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email.
                    </p>
                </div>
                <div style="text-align: center; margin-top: 24px;">
                    <p style="color: #a0aec0; font-size: 12px;">© {datetime.now().year} IdeaValidator. All rights reserved.</p>
                </div>
            </div>
            """

            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "from": "IdeaValidator <onboarding@resend.dev>",
                "to": [email],
                "subject": "Your Password Reset Code",
                "html": html_email
            }
            
            response = requests.post("https://api.resend.com/emails", json=payload, headers=headers)
            if response.status_code >= 400:
                print(f"Resend error: {response.text}")
                return jsonify({"error": "Failed to send email"}), 500

            return jsonify({"message": "If an account with that email exists, an OTP has been sent."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        conn.close()

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT * FROM password_resets WHERE email = %s AND otp = %s AND expires_at > NOW();",
                (email, otp)
            )
            if not cur.fetchone():
                return jsonify({"error": "Invalid or expired OTP"}), 400
            
            return jsonify({"message": "OTP verified successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        conn.close()

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()
    new_password = data.get("new_password", "")

    if not email or not otp or not new_password:
        return jsonify({"error": "Email, OTP, and new password are required"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Verify OTP again to ensure it wasn't bypassed
            cur.execute(
                "SELECT * FROM password_resets WHERE email = %s AND otp = %s AND expires_at > NOW();",
                (email, otp)
            )
            if not cur.fetchone():
                return jsonify({"error": "Invalid or expired OTP"}), 400

            # Hash new password
            password_bytes = new_password.encode("utf-8")
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

            # Update password
            cur.execute(
                "UPDATE users SET password_hash = %s WHERE email = %s;",
                (password_hash, email)
            )

            # Delete OTP
            cur.execute("DELETE FROM password_resets WHERE email = %s;", (email,))
            conn.commit()

            return jsonify({"message": "Password reset successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        conn.close()
