import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles } from 'lucide-react';

const AnalysisForm = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="analyze" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-purple-400 mb-6 border border-purple-500/30"
          >
            <Wand2 className="w-4 h-4" />
            <span>Try It Now</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Analyze Your <span className="text-gradient">Startup Idea</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            Fill out the details below and let our AI engine generate a comprehensive validation report in seconds.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-10 relative overflow-hidden"
        >
          {/* Animated Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Startup Name</label>
              <input 
                type="text" 
                placeholder="e.g. InnovateAI"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Industry</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer">
                <option value="" disabled selected>Select Industry</option>
                <option value="fintech">FinTech</option>
                <option value="healthtech">HealthTech</option>
                <option value="edtech">EdTech</option>
                <option value="saas">SaaS</option>
                <option value="ecommerce">E-commerce</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Problem Statement</label>
              <textarea 
                rows="3"
                placeholder="What problem are you solving?"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none placeholder:text-slate-600"
              ></textarea>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Solution</label>
              <textarea 
                rows="3"
                placeholder="How does your product solve this problem?"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none placeholder:text-slate-600"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Target Audience</label>
              <input 
                type="text" 
                placeholder="e.g. Small business owners"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Revenue Model</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer">
                <option value="" disabled selected>Select Model</option>
                <option value="subscription">Subscription (SaaS)</option>
                <option value="freemium">Freemium</option>
                <option value="marketplace">Marketplace / Commission</option>
                <option value="ads">Advertising</option>
                <option value="one-time">One-time Purchase</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-6">
              <button 
                type="button"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full relative group overflow-hidden rounded-xl p-[1px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></span>
                <div className="relative bg-slate-900 px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-opacity-0">
                  <Sparkles className={`w-5 h-5 text-white ${isHovered ? 'animate-pulse' : ''}`} />
                  <span className="font-bold text-lg text-white">Generate AI Analysis</span>
                </div>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalysisForm;
