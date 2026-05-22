import StartupReport from '../models/StartupReport.js';
import User from '../models/User.js';
import { analyzeStartupIdea } from '../ai/analyzeIdea.js';

// @desc    Submit and analyze startup idea
// @route   POST /api/startup/analyze
// @access  Private
const analyzeIdea = async (req, res, next) => {
  try {
    const { name, problem, customer, industry, businessModel, pricing, geography, founder, assumptions } = req.body;

    // Call AI Service
    const aiAnalysis = await analyzeStartupIdea(req.body);

    const report = await StartupReport.create({
      user: req.user._id,
      name,
      problem,
      customer,
      industry,
      businessModel,
      pricing,
      geography,
      founder,
      assumptions,
      scores: aiAnalysis.scores,
      recommendation: aiAnalysis.recommendation,
      swot: aiAnalysis.swot,
      analysis: aiAnalysis.analysis
    });

    // Update user's saved reports
    await User.findByIdAndUpdate(req.user._id, {
      $push: { savedReports: report._id }
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's startup reports
// @route   GET /api/startup/user/reports
// @access  Private
const getUserReports = async (req, res, next) => {
  try {
    const reports = await StartupReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report
// @route   GET /api/startup/:id
// @access  Private
const getReportById = async (req, res, next) => {
  try {
    const report = await StartupReport.findById(req.params.id);

    if (report && report.user.toString() === req.user._id.toString()) {
      res.json(report);
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
// @route   DELETE /api/startup/:id
// @access  Private
const deleteReport = async (req, res, next) => {
  try {
    const report = await StartupReport.findById(req.params.id);

    if (report && report.user.toString() === req.user._id.toString()) {
      await report.deleteOne();
      
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedReports: req.params.id }
      });
      
      res.json({ message: 'Report removed' });
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  } catch (error) {
    next(error);
  }
};

export { analyzeIdea, getUserReports, getReportById, deleteReport };
