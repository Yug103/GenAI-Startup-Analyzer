import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from database import init_db
from routes.auth import auth_bp
from routes.ideas import ideas_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for http://localhost:5173
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-secret-key-change-me")
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(ideas_bp, url_prefix="/api")

# Returns a JSON error response when an unauthorized request is made without a token
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"error": "Missing or invalid authorization header"}), 401

# Returns a JSON error response when a request includes an invalid JWT token
@jwt.invalid_token_loader
def invalid_token_response(callback):
    return jsonify({"error": "Invalid token"}), 401

# Returns a JSON error response when a request includes an expired JWT token
@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
