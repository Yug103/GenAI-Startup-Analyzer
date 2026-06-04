import os
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

def search_web(query, num_results=3):
    """Basic function to search DuckDuckGo and return text snippets."""
    print(f"Searching web for: {query}")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=num_results))
            return results
    except Exception as e:
        print(f"Search error for '{query}': {e}")
        return []

def get_market_context(idea_data):
    """Retrieve broad market trends based on the idea."""
    industry = idea_data.get('industry', 'tech')[:30] # Keep it short
    customer = idea_data.get('target_customer', '')[:30]
    
    query = f"{industry} market trends for {customer}"
    results = search_web(query, num_results=3)
    
    context = ""
    for r in results:
        title = r.get('title')
        snippet = r.get('body')
        context += f"- **{title}**: {snippet}\n"
        
    return context

def discover_competitors(idea_data):
    """Search for existing companies solving the same problem."""
    industry = idea_data.get('industry', 'tech')[:30]
    problem_short = idea_data.get('problem', '')[:40] # Truncate long problem descriptions
    
    query = f"startups companies tools for {problem_short} in {industry}"
    results = search_web(query, num_results=4)
    
    context = ""
    for r in results:
        title = r.get('title')
        snippet = r.get('body')
        context += f"- **{title}**: {snippet}\n"
        
    return context

def mine_reviews(competitors_context):
    """
    Search for customer complaints and reviews of the competitors we found.
    (We'll do a generic search for alternatives and complaints).
    """
    query = "Reddit alternatives and complaints for tools in this space"
    results = search_web(query, num_results=3)
    
    context = ""
    for r in results:
        title = r.get('title')
        snippet = r.get('body')
        context += f"- **{title}**: {snippet}\n"
        
    return context

def run_rag_research(idea_data):
    """Orchestrates the entire research phase."""
    print("Running RAG research...")
    
    market_context = get_market_context(idea_data)
    competitors = discover_competitors(idea_data)
    reviews = mine_reviews(competitors)
    
    rag_context = f"""
--- REAL-TIME MARKET RESEARCH DATA (USE THIS TO ANSWER THE PROMPT) ---
    
1. MARKET CONTEXT & TRENDS:
{market_context if market_context else "No real-time market data found."}
    
2. REAL COMPETITORS FOUND:
{competitors if competitors else "No direct competitors found in search."}
    
3. CUSTOMER COMPLAINTS / REVIEWS (Reddit & Web):
{reviews if reviews else "No specific reviews found."}
    
---------------------------------------------------------------------
"""
    return rag_context
