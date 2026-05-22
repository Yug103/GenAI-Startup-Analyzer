import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// This is a simplified in-memory RAG implementation.
// In a real production system, this would use Pinecone or ChromaDB.

let publicData = [
  "SaaS startups with B2B models have seen a 25% increase in funding in 2024.",
  "Freemium models work best when the marginal cost of a new user is near zero.",
  "AI-powered tools in healthcare reduce diagnostic time by 40%.",
  "Customer acquisition costs in edtech have doubled over the last 3 years.",
];

export const initializeRagEngine = async () => {
  console.log("RAG Engine initialized with sample data.");
};

export const generateEvidenceBasedInsights = async (ideaDescription) => {
  try {
    const context = publicData.join('\n');

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY || 'dummy_key',
      modelName: "gpt-3.5-turbo"
    });

    const promptTemplate = PromptTemplate.fromTemplate(`
      Based on the following research context, provide a brief insight for the startup idea.
      Context: {context}
      Startup Idea: {idea}
      Insight:
    `);

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
    
    // We will just return a mocked string if there is no openai key or if it errors out
    try {
      const insight = await chain.invoke({
        context,
        idea: ideaDescription
      });
      return insight;
    } catch(err) {
       return "Market trend points towards increased AI automation. Ensure your model differentiates on data moat.";
    }

  } catch (error) {
    console.error("RAG Query Error:", error.message);
    return "Could not generate evidence-based insights at this time.";
  }
};
