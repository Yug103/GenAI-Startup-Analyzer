import mongoose from 'mongoose';

const startupReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Inputs
  name: { type: String, required: true },
  problem: { type: String, required: true },
  customer: { type: String, required: true },
  industry: { type: String, required: true },
  businessModel: { type: String, required: true },
  pricing: { type: String },
  geography: { type: String },
  founder: { type: String },
  assumptions: { type: String },
  
  // AI Generated Outputs
  scores: {
    overall: { type: Number, default: 0 },
    market: { type: Number, default: 0 },
    competition: { type: Number, default: 0 },
    validation: { type: Number, default: 0 }
  },
  recommendation: { type: String },
  swot: {
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    threats: [String]
  },
  analysis: {
    problemSeverity: String,
    customerClarity: String,
    marketOpportunity: String,
    competitorDifferentiation: String,
    willingnessToPay: String,
    mvpFeasibility: String,
    founderFit: String
  }
}, {
  timestamps: true,
});

const StartupReport = mongoose.model('StartupReport', startupReportSchema);
export default StartupReport;
