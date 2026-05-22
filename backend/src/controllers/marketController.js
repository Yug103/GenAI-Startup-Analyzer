// @desc    Get market insights
// @route   GET /api/market/insights
// @access  Private
const getMarketInsights = async (req, res, next) => {
  try {
    const { industry } = req.query;

    const dummyInsights = {
      marketTrends: [
        `Increasing demand for automation in ${industry || 'this sector'}`,
        'Shift towards subscription-based pricing models',
        'High focus on AI integration'
      ],
      demandSignals: [
        'High Google Search volume for related keywords',
        'Growing VC investment in similar startups'
      ],
      pricingInsights: {
        averageWillingnessToPay: '$49/mo',
        models: ['Freemium', 'Usage-based', 'Flat-rate subscription']
      },
      historicalData: [
        { year: '2020', searches: 4000, investment: 2400 },
        { year: '2021', searches: 3000, investment: 1398 },
        { year: '2022', searches: 2000, investment: 9800 },
        { year: '2023', searches: 2780, investment: 3908 },
        { year: '2024', searches: 1890, investment: 4800 },
      ]
    };

    res.json(dummyInsights);
  } catch (error) {
    next(error);
  }
};

export { getMarketInsights };
