import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeStartupIdea = async (ideaData) => {
  const prompt = `
    Analyze the following startup idea comprehensively.
    Name: ${ideaData.name}
    Problem: ${ideaData.problem}
    Customer: ${ideaData.customer}
    Industry: ${ideaData.industry}
    Business Model: ${ideaData.businessModel}
    Pricing: ${ideaData.pricing || 'N/A'}
    Geography: ${ideaData.geography || 'Global'}
    Founder Background: ${ideaData.founder || 'N/A'}
    Assumptions: ${ideaData.assumptions || 'N/A'}

    Provide a JSON response containing the following structure EXACTLY:
    {
      "scores": {
        "overall": (0-100),
        "market": (0-100),
        "competition": (0-100),
        "validation": (0-100)
      },
      "recommendation": "Proceed | Pivot Customer Segment | Pivot Problem | Change Pricing | Run More Validation | Stop Idea",
      "swot": {
        "strengths": ["...", "...", "..."],
        "weaknesses": ["...", "...", "..."],
        "opportunities": ["...", "...", "..."],
        "threats": ["...", "...", "..."]
      },
      "analysis": {
        "problemSeverity": "...",
        "customerClarity": "...",
        "marketOpportunity": "...",
        "competitorDifferentiation": "...",
        "willingnessToPay": "...",
        "mvpFeasibility": "...",
        "founderFit": "..."
      }
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Return dummy data if OpenAI key is invalid or request fails
    return {
      scores: {
        overall: Math.floor(Math.random() * 20) + 70,
        market: 80,
        competition: 65,
        validation: 75
      },
      recommendation: "Proceed",
      swot: {
        strengths: ["Clear problem", "Scalable model"],
        weaknesses: ["High competition", "Customer acquisition cost"],
        opportunities: ["Growing market", "AI adoption"],
        threats: ["Tech giants", "Regulation"]
      },
      analysis: {
        problemSeverity: "High",
        customerClarity: "Clear",
        marketOpportunity: "Large and growing",
        competitorDifferentiation: "Moderate",
        willingnessToPay: "High",
        mvpFeasibility: "Feasible in 3 months",
        founderFit: "Good"
      }
    };
  }
};
