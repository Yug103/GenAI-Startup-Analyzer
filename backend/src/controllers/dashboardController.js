import StartupReport from '../models/StartupReport.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const reports = await StartupReport.find({ user: req.user._id });
    
    const totalAnalyses = reports.length;
    const avgScore = totalAnalyses > 0 ? Math.round(reports.reduce((acc, curr) => acc + curr.scores.overall, 0) / totalAnalyses) : 0;
    
    res.json({
      totalAnalyses,
      avgScore,
      recentReports: reports.slice(-5).reverse()
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardStats };
