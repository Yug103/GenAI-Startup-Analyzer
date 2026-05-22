import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs font-medium text-cyan-400 mb-6 border border-cyan-500/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Startup Validation 2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
          >
            Transform Startup Ideas Into <br className="hidden md:block" />
            <span className="text-gradient">Successful Businesses</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed"
          >
            Leverage advanced generative AI to analyze market trends, evaluate competitors, and validate your startup idea instantly. Get actionable insights before writing a single line of code.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/analyze" className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Analysis
            </Link>
            <button className="px-8 py-3.5 rounded-full glass hover:bg-white/10 text-white font-semibold transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Right Dashboard Preview */}
        <div className="w-full lg:w-1/2 relative z-10 mt-12 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="glass-card p-6 border border-slate-700/50 shadow-2xl relative"
            style={{ transformPerspective: "1000px" }}
          >
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Live Analysis</h3>
                  <p className="text-xs text-slate-400">Project: FinTech App</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Processing
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">Startup Score</span>
                </div>
                <div className="text-3xl font-bold text-white">92<span className="text-sm text-cyan-400 ml-1">/100</span></div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "92%" }} 
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Market Demand</span>
                </div>
                <div className="text-3xl font-bold text-white">High</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "85%" }} 
                    transition={{ duration: 1, delay: 1 }}
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">Success Probability</span>
                <span className="text-sm font-semibold text-green-400">87%</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "87%" }} 
                  transition={{ duration: 1.2, delay: 1.2 }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">Low Competition</span>
                <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">High Margin</span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/30 rounded-full blur-2xl z-[-1]"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl z-[-1]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
