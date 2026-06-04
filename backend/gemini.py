import os
import json
import re
from google import genai
from dotenv import load_dotenv
from research_engine import run_rag_research

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if API_KEY:
    client = genai.Client(api_key=API_KEY)

def analyze_idea(idea_data):
    if not client:
        return {"error": "GEMINI_API_KEY is missing. Please add it to your .env file."}
        
    try:
        rag_context = run_rag_research(idea_data)
    except Exception as e:
        print(f"RAG Engine Error: {e}")
        rag_context = "RAG Engine unavailable."

    prompt = f"""You are an expert startup analyst.
Analyze this startup idea and return 
ONLY a valid JSON object.
No markdown, no backticks, no extra text.
Just the raw JSON.

{rag_context}

Startup Idea Details:
Name: {idea_data.get('name', '')}
Problem: {idea_data.get('problem', '')}
Target Customer: {idea_data.get('target_customer', '')}
Industry: {idea_data.get('industry', '')}
Business Model: {idea_data.get('business_model', '')}
Geography: {idea_data.get('geography', '')}
Pricing: {idea_data.get('pricing_assumption', '') or idea_data.get('pricing', '')}
Key Assumptions: {idea_data.get('key_assumptions', '') or idea_data.get('assumptions', '')}
Founder Background: {idea_data.get('founder_background', '') or idea_data.get('founder_bg', '')}

Return exactly this JSON structure:
{{
  "overall_score": number between 0 and 100,
  "recommendation": exactly one of these words: proceed or pivot or stop,
  "category_scores": {{
    "market_opportunity": number 0-100,
    "problem_severity": number 0-100,
    "competitor_gap": number 0-100,
    "mvp_feasibility": number 0-100,
    "willingness_to_pay": number 0-100,
    "founder_market_fit": number 0-100
  }},
  "strengths": array of exactly 4 strings,
  "weaknesses": array of exactly 4 strings,
  "risks": array of exactly 3 strings,
  "competitors": array of 4 objects each with:
    "name": string,
    "type": direct or indirect or substitute,
    "pricing": string,
    "threat_level": high or medium or low
  "market_insights": one paragraph string,
  "next_steps": array of exactly 3 strings
}}"""
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = re.sub(r',\s*([\]}])', r'\1', text)
        return json.loads(text.strip())
    except Exception as e:
        if 'response' in locals() and hasattr(response, 'text'):
            try:
                text = response.text.strip()
                start = text.find('{')
                end = text.rfind('}')
                if start != -1 and end != -1:
                    clean_text = text[start:end+1]
                    clean_text = re.sub(r',\s*([\]}])', r'\1', clean_text)
                    return json.loads(clean_text)
            except Exception:
                pass
        return {"error": f"AI service error: {str(e)}"}

def generate_validation(idea_data):
    if not client:
        return {"error": "GEMINI_API_KEY is missing. Please add it to your .env file."}
        
    prompt = f"""You are a startup validation expert.
Create a practical validation plan for 
this startup idea and return ONLY a 
valid JSON object.
No markdown, no backticks, no extra text.
Just the raw JSON.

Startup Details:
Name: {idea_data.get('name', '')}
Problem: {idea_data.get('problem', '')}
Target Customer: {idea_data.get('target_customer', '')}
Industry: {idea_data.get('industry', '')}

Return exactly this JSON structure:
{{
  "interview_questions": array of 8 strings,
  "cold_email": {{
    "subject": string,
    "body": string
  }},
  "landing_page_copy": {{
    "headline": string,
    "subheadline": string,
    "cta_button": string
  }},
  "seven_day_plan": array of 7 objects each with:
    "day": number,
    "title": string,
    "description": string,
    "action": string
  "mvp_test_plan": {{
    "week1": string,
    "week2": string,
    "success_metric": string,
    "kill_condition": string
  }},
  "success_metrics": array of 5 strings
}}"""
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = re.sub(r',\s*([\]}])', r'\1', text)
        return json.loads(text.strip())
    except Exception as e:
        if 'response' in locals() and hasattr(response, 'text'):
            try:
                text = response.text.strip()
                start = text.find('{')
                end = text.rfind('}')
                if start != -1 and end != -1:
                    clean_text = text[start:end+1]
                    clean_text = re.sub(r',\s*([\]}])', r'\1', clean_text)
                    return json.loads(clean_text)
            except Exception:
                pass
        return {"error": f"AI service error: {str(e)}"}

if __name__ == "__main__":
    test = {
        "name": "AI Tutor SaaS",
        "problem": "Students lack quality tutoring",
        "target_customer": "Parents of students 10-18",
        "industry": "EdTech",
        "business_model": "SaaS",
        "geography": "India",
        "pricing_assumption": "499 per month",
        "key_assumptions": "Parents pay for results",
        "founder_background": "2 years EdTech"
    }
    result = analyze_idea(test)
    print(json.dumps(result, indent=2))
