import React from 'react';
import { Rocket, Hash, Briefcase, Code, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-white/10 bg-slate-900/80 pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                GenAI <span className="text-gradient">Analyzer</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Empowering founders with AI-driven insights to build the next generation of successful startups.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full max-w-xs"
              />
              <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Use Cases</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} GenAI Analyzer. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors"><Hash className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Briefcase className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Code className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
