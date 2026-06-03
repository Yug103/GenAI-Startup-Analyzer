import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    database_url = os.getenv("DATABASE_URL")
    return psycopg2.connect(database_url)

def init_db():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    full_name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS ideas (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(150) NOT NULL,
                    problem TEXT NOT NULL,
                    target_customer TEXT NOT NULL,
                    industry VARCHAR(100) NOT NULL,
                    business_model VARCHAR(100) NOT NULL,
                    geography VARCHAR(100) NOT NULL,
                    pricing VARCHAR(255),
                    assumptions TEXT,
                    founder_bg TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            # Add columns if table already exists without them
            cur.execute("ALTER TABLE ideas ADD COLUMN IF NOT EXISTS pricing VARCHAR(255);")
            cur.execute("ALTER TABLE ideas ADD COLUMN IF NOT EXISTS assumptions TEXT;")
            cur.execute("ALTER TABLE ideas ADD COLUMN IF NOT EXISTS founder_bg TEXT;")
            cur.execute("ALTER TABLE ideas ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';")
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS reports (
                    id SERIAL PRIMARY KEY,
                    idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
                    overall_score INTEGER,
                    recommendation VARCHAR(50),
                    category_scores JSONB,
                    strengths JSONB,
                    weaknesses JSONB,
                    risks JSONB,
                    competitors JSONB,
                    market_insights TEXT,
                    next_steps JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS validation_plans (
                    id SERIAL PRIMARY KEY,
                    idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
                    interview_questions JSONB,
                    cold_email JSONB,
                    landing_page_copy JSONB,
                    seven_day_plan JSONB,
                    mvp_test_plan JSONB,
                    success_metrics JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()
