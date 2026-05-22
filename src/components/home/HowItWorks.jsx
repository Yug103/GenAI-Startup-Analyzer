import React from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, FileText } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "1. Enter Startup Idea",
      desc: "Describe your concept, target audience, and problem statement.",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "2. AI Analyzes Market",
      desc: "Our AI scans millions of data points to evaluate competition and demand.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "3. Get Detailed Report",
      desc: "Receive a comprehensive validation report with actionable next steps.",
      color: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            How It <span className="text-gradient">Works</span>
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-green-500/20 z-0"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-card p-8 text-center max-w-sm w-full z-10 border-t border-t-white/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-300 ${step.color}"></div>
              
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 relative`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
