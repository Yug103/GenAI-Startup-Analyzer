import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate validation experiments
// @route   POST /api/validation/generate
// @access  Private
const generateValidationPlans = async (req, res, next) => {
  try {
    const { ideaName, problem, customer } = req.body;

    const prompt = `
      You are an expert startup advisor. Given the startup idea "${ideaName}" that solves the problem "${problem}" for "${customer}", generate a validation experiment plan.
      Return a JSON object with:
      - interviewQuestions: [5 questions]
      - coldEmails: [{ subject: "...", body: "..." }, { subject: "...", body: "..." }]
      - landingPageHeadlines: [3 headlines]
      - sevenDayPlan: [{ day: "Day 1", task: "..." }, ..., { day: "Day 7", task: "..." }]
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      res.json(parsed);
    } catch (aiError) {
      console.error('AI Error in Validation:', aiError);
      
      // Fallback
      res.json({
        interviewQuestions: [
          "Can you describe the hardest part about dealing with this problem?",
          "How are you currently trying to solve this problem?",
          "Why is your current solution not awesome?",
          "If you could wave a magic wand, what would the perfect solution look like?",
          "Have you ever paid for a tool to solve this problem? If so, what was it?"
        ],
        coldEmails: [
          { subject: "Quick question about your workflow", body: "Hi,\n\nI am researching how professionals handle this problem. Would you be open to a 10-minute chat next week?" }
        ],
        landingPageHeadlines: [
          "Solve [Problem] without the hassle.",
          "The ultimate tool for [Customer]."
        ],
        sevenDayPlan: [
          { day: 'Day 1', task: 'Define target persona and build list of 50 contacts' },
          { day: 'Day 2', task: 'Send cold emails / LinkedIn outreach' },
          { day: 'Day 3', task: 'Set up a simple Carrd landing page with email capture' },
          { day: 'Day 4-6', task: 'Conduct at least 5 customer interviews' },
          { day: 'Day 7', task: 'Review data: Go / No-Go decision based on waitlist signups' },
        ]
      });
    }
  } catch (error) {
    next(error);
  }
};

export { generateValidationPlans };
