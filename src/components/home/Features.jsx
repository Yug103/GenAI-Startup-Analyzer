import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, BarChart, CheckCircle, Lightbulb, Briefcase, Rocket } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: <Brain className="w-6 h-6" />, title: "AI Idea Analysis", desc: "Instantly evaluate your concept using advanced language models trained on business data." },
    { icon: <Target className="w-6 h-6" />, title: "Competitor Research", desc: "Automatically identify top competitors and analyze their strengths and weaknesses." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Market Trend Prediction", desc: "Forecast market shifts and demand using predictive AI algorithms." },
    { icon: <BarChart className="w-6 h-6" />, title: "SWOT Analysis", desc: "Generate comprehensive Strengths, Weaknesses, Opportunities, and Threats reports." },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Startup Validation", desc: "Get a clear 'Go/No-Go' score based on market viability and financial feasibility." },
    { icon: <Lightbulb className="w-6 h-6" />, title: "AI Pitch Generator", desc: "Create compelling pitch decks and investor summaries in seconds." },
    { icon: <Briefcase className="w-6 h-6" />, title: "Business Model Suggestions", desc: "Discover the most profitable monetization strategies for your idea." },
    { icon: <Rocket className="w-6 h-6" />, title: "Growth Strategy", desc: "Receive customized user acquisition and go-to-market strategies." },
  ];

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Powerful <span className="text-gradient">AI Features</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Everything you need to validate, refine, and launch your startup idea with confidence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 group cursor-pointer border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 mb-4 group-hover:text-white group-hover:bg-cyan-500 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
