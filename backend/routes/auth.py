import re
from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token
from database import get_connection
from psycopg2.extras import RealDictCursor

auth_bp = Blueprint("auth", __name__)

# Validates if an email address is formed correctly according to standard regex patterns
def is_valid_email(email):
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(email_regex, email) is not None

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
