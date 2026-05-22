import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, AlertCircle, CheckCircle2, ChevronRight, BarChart3, TrendingUp, Target, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { useNavigate } from 'react-router-dom';

const AnalysisPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const { addReport } = useAppStore();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setIsAnalyzing(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const generatedReport = {
        id: Date.now(),
        ...data,
        score: Math.floor(Math.random() * 20) + 75, // 75-95
        successProbability: 'High',
        marketDemand: 'Growing at 15% YoY',
        competitionLevel: 'Moderate',
        swot: {
          strengths: ['Innovative AI approach', 'Scalable SaaS model'],
          weaknesses: ['High initial marketing cost', 'Reliance on third-party APIs'],
          opportunities: ['Expansion into Enterprise B2B', 'Global remote work trend'],
          threats: ['Tech giants entering the space', 'Rapid AI regulatory changes']
        },
        growthStrategy: 'Focus on content-led SEO and targeted LinkedIn outreach for B2B beta users.'
      };
      setReport(generatedReport);
      addReport(generatedReport);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      
      {!report && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              AI Startup <span className="text-gradient">Analyzer</span>
            </h1>
            <p className="text-slate-400">Provide details about your startup idea to receive a comprehensive AI validation report.</p>
          </div>

          <div className="glass-card p-8 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Startup Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Startup Name *</label>
                  <input 
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. InnovateAI"
                    className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Industry *</label>
                  <select 
                    {...register("industry", { required: "Industry is required" })}
                    className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${errors.industry ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'} appearance-none cursor-pointer`}
                  >
                    <option value="">Select Industry</option>
                    <option value="fintech">FinTech</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="saas">SaaS / B2B</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="ai">Artificial Intelligence</option>
                  </select>
                  {errors.industry && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.industry.message}</p>}
                </div>

                {/* Problem Statement */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Problem Statement *</label>
                  <textarea 
                    {...register("problem", { required: "Problem is required", minLength: 20 })}
                    rows="3"
                    placeholder="What specific problem are you solving for your users?"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Solution */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Solution *</label>
                  <textarea 
                    {...register("solution", { required: "Solution is required" })}
                    rows="3"
                    placeholder="How does your product solve this problem uniquely?"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Target Audience</label>
                  <input 
                    {...register("audience")}
                    placeholder="e.g. SMBs, Gen Z"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                {/* Revenue Model */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Revenue Model</label>
                  <select 
                    {...register("revenueModel")}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="subscription">Subscription (SaaS)</option>
                    <option value="freemium">Freemium</option>
                    <option value="marketplace">Marketplace / Commission</option>
                    <option value="ads">Advertising</option>
                    <option value="one-time">One-time Purchase</option>
                  </select>
                </div>

              </div>

              <button 
                type="submit"
                className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-8"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></span>
                <div className="relative bg-slate-900 px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-opacity-0">
                  <Sparkles className="w-5 h-5 text-white group-hover:animate-pulse" />
                  <span className="font-bold text-lg text-white">Generate AI Analysis</span>
                </div>
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 min-h-[60vh]"
        >
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <Wand2 className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing your Startup Idea...</h2>
          <p className="text-slate-400 text-center max-w-md">Our AI models are evaluating market demand, competition, and generating actionable strategies.</p>
          
          <div className="mt-8 space-y-3 w-64">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"></motion.div>
            </div>
            <p className="text-xs text-center text-slate-500 animate-pulse">Running SWOT analysis...</p>
          </div>
        </motion.div>
      )}

      {/* Report Result */}
      {report && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-medium">Analysis Complete</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{report.name} <span className="text-slate-400 font-normal">Report</span></h1>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              Go to Dashboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Score */}
            <div className="glass-card p-8 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <h3 className="text-slate-400 mb-2 font-medium">Overall Startup Score</h3>
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="none" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 440" }}
                    animate={{ strokeDasharray: `${(report.score / 100) * 440} 440` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="80" cy="80" r="70" stroke="url(#gradient)" strokeWidth="12" fill="none" strokeLinecap="round" 
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-5xl font-bold text-white">{report.score}</div>
              </div>
              <p className="text-green-400 text-sm font-semibold">Highly Viable Idea</p>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: "Success Probability", value: report.successProbability, icon: <Target className="text-cyan-400 w-5 h-5" /> },
                { label: "Market Demand", value: report.marketDemand, icon: <TrendingUp className="text-purple-400 w-5 h-5" /> },
                { label: "Competition Level", value: report.competitionLevel, icon: <BarChart3 className="text-orange-400 w-5 h-5" /> },
                { label: "Recommended Strategy", value: "B2B Outreach", icon: <Sparkles className="text-green-400 w-5 h-5" /> },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 border border-slate-700/50 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-slate-400 text-sm">{stat.label}</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SWOT Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border border-green-500/20 bg-green-500/5">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2"><Target className="w-5 h-5" /> Strengths</h3>
              <ul className="space-y-2">
                {report.swot.strengths.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {item}</li>)}
              </ul>
            </div>
            
            <div className="glass-card p-6 border border-red-500/20 bg-red-500/5">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Weaknesses</h3>
              <ul className="space-y-2">
                {report.swot.weaknesses.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> {item}</li>)}
              </ul>
            </div>

            <div className="glass-card p-6 border border-cyan-500/20 bg-cyan-500/5">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Opportunities</h3>
              <ul className="space-y-2">
                {report.swot.opportunities.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><ChevronRight className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" /> {item}</li>)}
              </ul>
            </div>

            <div className="glass-card p-6 border border-orange-500/20 bg-orange-500/5">
              <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Threats</h3>
              <ul className="space-y-2">
                {report.swot.threats.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> {item}</li>)}
              </ul>
            </div>
          </div>
          
          <div className="glass-card p-8 border border-purple-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-purple-400" /> AI Growth Strategy
            </h3>
            <p className="text-slate-300 leading-relaxed">{report.growthStrategy}</p>
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default AnalysisPage;
