import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { value: "10K+", label: "Ideas Analyzed", color: "from-cyan-400 to-blue-500" },
    { value: "95%", label: "AI Accuracy", color: "from-purple-400 to-pink-500" },
    { value: "500+", label: "Startups Validated", color: "from-green-400 to-emerald-500" },
    { value: "24/7", label: "AI Support", color: "from-orange-400 to-red-500" },
  ];

  return (
    <section className="py-12 relative z-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center border-t border-t-white/10"
            >
              <h3 className={`text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </h3>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
