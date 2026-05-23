from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_connection
from psycopg2.extras import RealDictCursor

ideas_bp = Blueprint("ideas", __name__)

# Creates a new startup idea for the currently authenticated user, validating all input fields
@ideas_bp.route("/ideas", methods=["POST"])
@jwt_required()
def create_idea():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    problem = data.get("problem", "").strip()
    target_customer = data.get("target_customer", "").strip()
    industry = data.get("industry", "").strip()
    business_model = data.get("business_model", "").strip()
    geography = data.get("geography", "").strip()
    pricing = data.get("pricing", "").strip()
    assumptions = data.get("assumptions", "").strip()
    founder_bg = data.get("founder_bg", "").strip()

    # Input validation
    if not name:
        return jsonify({"error": "Idea name is required"}), 400
    if not problem:
        return jsonify({"error": "Problem definition is required"}), 400
    if not target_customer:
        return jsonify({"error": "Target customer is required"}), 400
    if not industry:
        return jsonify({"error": "Industry is required"}), 400
    if not business_model:
        return jsonify({"error": "Business model is required"}), 400
    if not geography:
        return jsonify({"error": "Geography is required"}), 400

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Save to ideas table
            cur.execute(
                """
                INSERT INTO ideas (user_id, name, problem, target_customer, industry, business_model, geography, pricing, assumptions, founder_bg)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, user_id, name, problem, target_customer, industry, business_model, geography, pricing, assumptions, founder_bg, created_at;
                """,
                (user_id, name, problem, target_customer, industry, business_model, geography, pricing, assumptions, founder_bg)
            )
            saved_idea = cur.fetchone()
            conn.commit()

            # Format created_at to ISO string
            if saved_idea and "created_at" in saved_idea:
                saved_idea["created_at"] = saved_idea["created_at"].isoformat()

            return jsonify(saved_idea), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"An error occurred while saving the idea: {str(e)}"}), 500
    finally:
        conn.close()

# Retrieves all ideas created by the logged-in user in chronological order (newest first)
@ideas_bp.route("/ideas", methods=["GET"])
@jwt_required()
def get_ideas():
    user_id = get_jwt_identity()

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT id, name, problem, target_customer, industry, business_model, geography, pricing, assumptions, founder_bg, created_at
                FROM ideas
                WHERE user_id = %s
                ORDER BY created_at DESC;
                """,
                (user_id,)
            )
            ideas = cur.fetchall()
            
            # Format datetime objects for JSON serialization
            for idea in ideas:
                if "created_at" in idea and idea["created_at"]:
                    idea["created_at"] = idea["created_at"].isoformat()

            return jsonify(ideas), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while retrieving ideas: {str(e)}"}), 500
    finally:
        conn.close()

# Deletes a specific startup idea if it belongs to the authenticated user
@ideas_bp.route("/ideas/<int:idea_id>", methods=["DELETE"])
@jwt_required()
def delete_idea(idea_id):
    user_id = get_jwt_identity()

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Verify ownership before deleting
            cur.execute("SELECT id FROM ideas WHERE id = %s AND user_id = %s;", (idea_id, user_id))
            if not cur.fetchone():
                return jsonify({"error": "Idea not found or unauthorized"}), 404

            cur.execute("DELETE FROM ideas WHERE id = %s AND user_id = %s;", (idea_id, user_id))
            conn.commit()
            return jsonify({"message": "Idea deleted successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"An error occurred while deleting the idea: {str(e)}"}), 500
    finally:
        conn.close()
