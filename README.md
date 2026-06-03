# IdeaValidator

A full-stack web application that helps founders validate their startup ideas using AI. It generates comprehensive market analysis, competitor breakdowns, MVP roadmaps, and actionable 7-day validation plans.

## Project Structure

This repository contains both the frontend and backend code:

- `/frontend` - React application built with Vite and TailwindCSS.
- `/backend` - Python Flask API integrating with Google's Gemini API and PostgreSQL.
- `requirements.txt` - Python dependencies for the backend.

## Local Development

You'll need Node.js, Python 3, and a running instance of **PostgreSQL**. You also need a Gemini API Key from Google AI Studio.

### 1. Backend Setup
1. From the root directory, install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create a PostgreSQL database locally (or use a free cloud provider like Supabase/Neon).
3. Create a `.env` file inside the `backend` folder with your connection string and keys:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ideavalidator
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=your_secure_random_string
   ```
4. Start the Flask server:
   ```bash
   cd backend
   python app.py
   ```
   *The database tables will be automatically initialized on startup.* The API will run on `http://127.0.0.1:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`.

## Deployment

- **Frontend**: Can be easily deployed to Vercel. Set the Root Directory to `frontend` and the build command to `npm run build`.
- **Backend**: Can be deployed to Render as a Web Service. Provision a Render PostgreSQL database first, then set the `DATABASE_URL` environment variable on the web service. Set the Build Command to `pip install -r ../requirements.txt` and the Start Command to `gunicorn app:app`.

## Tech Stack
- Frontend: React, React Router, TailwindCSS, Vite
- Backend: Python, Flask, PostgreSQL (psycopg2), PyJWT
- AI: Google Gemini 
