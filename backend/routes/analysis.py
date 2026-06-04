import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_connection
from psycopg2.extras import RealDictCursor
from gemini import analyze_idea, generate_validation

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/ideas/<int:idea_id>/analyze", methods=["POST"])
@jwt_required()
def analyze(idea_id):
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check ownership
            cur.execute("SELECT * FROM ideas WHERE id = %s", (idea_id,))
            idea = cur.fetchone()
            if not idea:
                return jsonify({"error": "Idea not found"}), 404
            if str(idea["user_id"]) != str(user_id):
                return jsonify({"error": "Unauthorized"}), 403

            # Check if report already exists
            cur.execute("SELECT * FROM reports WHERE idea_id = %s", (idea_id,))
            existing = cur.fetchone()
            force = request.args.get("force") == "true"
            if existing and not force:
                return jsonify({"success": True, "data": existing}), 200
            if existing and force:
                cur.execute("DELETE FROM reports WHERE idea_id = %s", (idea_id,))

            # Analyze
            result = analyze_idea(idea)
            if "error" in result:
                return jsonify({"error": result["error"]}), 500

            # Save to reports
            cur.execute("""
                INSERT INTO reports (
                    idea_id, overall_score, recommendation, category_scores,
                    strengths, weaknesses, risks, competitors, market_insights, next_steps
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (
                idea_id,
                result.get("overall_score"),
                result.get("recommendation"),
                json.dumps(result.get("category_scores", {})),
                json.dumps(result.get("strengths", [])),
                json.dumps(result.get("weaknesses", [])),
                json.dumps(result.get("risks", [])),
                json.dumps(result.get("competitors", [])),
                result.get("market_insights"),
                json.dumps(result.get("next_steps", []))
            ))
            report = cur.fetchone()

            # Update status
            cur.execute("UPDATE ideas SET status = 'analyzed' WHERE id = %s", (idea_id,))
            conn.commit()

            return jsonify({"success": True, "data": report}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@analysis_bp.route("/ideas/<int:idea_id>/report", methods=["GET"])
@jwt_required()
def get_report(idea_id):
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check ownership
            cur.execute("SELECT user_id FROM ideas WHERE id = %s", (idea_id,))
            idea = cur.fetchone()
            if not idea or str(idea["user_id"]) != str(user_id):
                return jsonify({"error": "Unauthorized or not found"}), 403

            cur.execute("SELECT * FROM reports WHERE idea_id = %s", (idea_id,))
            report = cur.fetchone()
            if not report:
                return jsonify({"error": "Not analyzed yet"}), 404

            return jsonify({"success": True, "data": report}), 200
    finally:
        conn.close()

@analysis_bp.route("/ideas/<int:idea_id>/validate", methods=["POST"])
@jwt_required()
def validate(idea_id):
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check ownership
            cur.execute("SELECT * FROM ideas WHERE id = %s", (idea_id,))
            idea = cur.fetchone()
            if not idea:
                return jsonify({"error": "Idea not found"}), 404
            if str(idea["user_id"]) != str(user_id):
                return jsonify({"error": "Unauthorized"}), 403

            # Check if validation exists
            cur.execute("SELECT * FROM validation_plans WHERE idea_id = %s", (idea_id,))
            existing = cur.fetchone()
            force = request.args.get("force") == "true"
            if existing and not force:
                return jsonify({"success": True, "data": existing}), 200
            if existing and force:
                cur.execute("DELETE FROM validation_plans WHERE idea_id = %s", (idea_id,))

            # Generate plan
            result = generate_validation(idea)
            if "error" in result:
                return jsonify({"error": result["error"]}), 500

            # Save
            cur.execute("""
                INSERT INTO validation_plans (
                    idea_id, interview_questions, cold_email, landing_page_copy,
                    seven_day_plan, mvp_test_plan, success_metrics
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (
                idea_id,
                json.dumps(result.get("interview_questions", [])),
                json.dumps(result.get("cold_email", {})),
                json.dumps(result.get("landing_page_copy", {})),
                json.dumps(result.get("seven_day_plan", [])),
                json.dumps(result.get("mvp_test_plan", {})),
                json.dumps(result.get("success_metrics", []))
            ))
            plan = cur.fetchone()
            conn.commit()

            return jsonify({"success": True, "data": plan}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@analysis_bp.route("/ideas/<int:idea_id>/validation", methods=["GET"])
@jwt_required()
def get_validation(idea_id):
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT user_id FROM ideas WHERE id = %s", (idea_id,))
            idea = cur.fetchone()
            if not idea or str(idea["user_id"]) != str(user_id):
                return jsonify({"error": "Unauthorized or not found"}), 403

            cur.execute("SELECT * FROM validation_plans WHERE idea_id = %s", (idea_id,))
            plan = cur.fetchone()
            if not plan:
                return jsonify({"error": "Validation plan not generated yet"}), 404

            return jsonify({"success": True, "data": plan}), 200
    finally:
        conn.close()
