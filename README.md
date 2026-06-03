# IdeaValidator

A full-stack web application that helps founders validate their startup ideas using AI. It generates comprehensive market analysis, competitor breakdowns, MVP roadmaps, and actionable 7-day validation plans.

## Project Structure

This repository contains both the frontend and backend code:

- `/frontend` - React application built with Vite and TailwindCSS.
- `/backend` - Python Flask API integrating with Google's Gemini API.
- `requirements.txt` - Python dependencies for the backend.

## Local Development

You'll need Node.js and Python 3 installed. You also need a Gemini API Key from Google AI Studio.

### 1. Backend Setup
1. From the root directory, install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create a `.env` file inside the `backend` folder with your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=your_secure_random_string
   ```
3. Start the Flask server:
   ```bash
   cd backend
   python app.py
   ```
   The API will run on `http://127.0.0.1:5000`.

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
- **Backend**: Can be deployed to Render as a Web Service. Set the Build Command to `pip install -r requirements.txt` and the Start Command to `cd backend && gunicorn app:app`.

## Tech Stack
- Frontend: React, React Router, TailwindCSS, Vite
- Backend: Python, Flask, SQLite, PyJWT
- AI: Google Gemini Pro
