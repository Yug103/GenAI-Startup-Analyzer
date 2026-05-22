import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Founder, FinTrack",
      image: "https://i.pravatar.cc/150?img=1",
      text: "GenAI Analyzer literally saved me months of market research. The AI identified two major competitors I had completely missed and suggested a pivot that secured our pre-seed funding.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "CEO, HealthSync",
      image: "https://i.pravatar.cc/150?img=11",
      text: "The financial feasibility score was incredibly accurate. It helped us realisticly price our SaaS product from day one. I don't validate any new feature without running it through this tool first.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Co-founder, Edutopia",
      image: "https://i.pravatar.cc/150?img=5",
      text: "The pitch generator feature is mind-blowing. It created a narrative for our startup that resonated perfectly with investors. We closed our seed round 3 weeks after using it.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Loved by <span className="text-gradient">Founders</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-card p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-700 opacity-50" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                ))}
              </div>
              
              <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full border-2 border-cyan-500/30"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
