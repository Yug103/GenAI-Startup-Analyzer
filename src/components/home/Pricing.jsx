import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect for testing your initial ideas.",
      features: ["5 Idea Analyses per month", "Basic Market Research", "Startup Score", "Standard Support"],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      desc: "Everything you need to validate serious ventures.",
      features: ["Unlimited Analyses", "Deep Competitor Insights", "Financial Forecasting", "AI Pitch Generator", "Priority Support"],
      buttonText: "Start Free Trial",
      popular: true,
      glowColor: "glow"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      desc: "Advanced tools for venture studios & agencies.",
      features: ["Custom AI Models", "API Access", "Team Collaboration", "White-label Reports", "Dedicated Account Manager"],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </motion.h2>
          <p className="text-slate-400 max-w-xl mx-auto">Choose the plan that fits your startup journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`glass-card p-8 relative ${plan.popular ? 'border-cyan-500/50 md:scale-105 z-10' : 'border-slate-700/50'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-bold text-white tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-slate-300 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-400 mt-3">{plan.desc}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                plan.popular 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
