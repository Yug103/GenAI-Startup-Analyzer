// @desc    Search for competitors
// @route   GET /api/competitors/search
// @access  Private
const searchCompetitors = async (req, res, next) => {
  try {
    const { idea, industry } = req.query;

    if (!idea) {
      res.status(400);
      throw new Error('Idea parameter is required');
    }

    // In a real scenario, this would use a web scraper, Google Custom Search API, or an AI agent
    // Here we return dummy structured data simulating RAG/AI output
    const dummyCompetitors = [
      {
        companyName: 'IncumbentCorp',
        category: 'direct',
        pricingModel: 'Enterprise ($500/mo)',
        description: `Legacy software solving a similar problem to ${idea} in ${industry || 'the industry'}.`,
        website: 'https://example.com',
        source: 'Google Search'
      },
      {
        companyName: 'StartupFast',
        category: 'indirect',
        pricingModel: 'Freemium ($15/mo)',
        description: 'Modern UI, limited functionality. Targets small businesses.',
        website: 'https://example.com',
        source: 'Product Hunt'
      },
      {
        companyName: 'Manual Process',
        category: 'substitute',
        pricingModel: 'Labor Cost',
        description: 'Using spreadsheets, emails, and manual workarounds to bypass the problem.',
        website: '',
        source: 'User Interviews'
      }
    ];

    res.json(dummyCompetitors);
  } catch (error) {
    next(error);
  }
};

export { searchCompetitors };
