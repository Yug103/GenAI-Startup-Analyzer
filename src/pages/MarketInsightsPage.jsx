import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../context/AppStore';

const MarketInsightsPage = () => {
  const { activeIdea } = useAppStore();

  const trendData = [
    { year: '2020', searches: 4000, investment: 2400 },
    { year: '2021', searches: 3000, investment: 1398 },
    { year: '2022', searches: 2000, investment: 9800 },
    { year: '2023', searches: 2780, investment: 3908 },
    { year: '2024', searches: 1890, investment: 4800 },
    { year: '2025', searches: 2390, investment: 3800 },
    { year: '2026', searches: 3490, investment: 4300 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          Market & Pricing Insights <TrendingUp className="text-cyan-400 w-6 h-6" />
        </h1>
        <p className="text-slate-400">Data-driven market intelligence for: <span className="text-white font-medium">{activeIdea?.name || 'Your Startup'}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-cyan-500/10 rounded-xl"><Users className="w-6 h-6 text-cyan-400" /></div>
            <div>
              <p className="text-sm text-slate-400">TAM (Total Addressable Market)</p>
              <h3 className="text-2xl font-bold text-white">$4.2B</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
            <ArrowUpRight className="w-4 h-4" /> <span>+12.5% YoY Growth</span>
          </div>
        </div>
        <div className="glass-card p-6 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-xl"><Activity className="w-6 h-6 text-purple-400" /></div>
            <div>
              <p className="text-sm text-slate-400">Search Interest Score</p>
              <h3 className="text-2xl font-bold text-white">87 / 100</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
            <ArrowUpRight className="w-4 h-4" /> <span>High Demand Trend</span>
          </div>
        </div>
        <div className="glass-card p-6 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-500/10 rounded-xl"><DollarSign className="w-6 h-6 text-green-400" /></div>
            <div>
              <p className="text-sm text-slate-400">Avg. Willingness to Pay</p>
              <h3 className="text-2xl font-bold text-white">$49/mo</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-400 mt-2">
            Based on direct competitor pricing
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Historical Market Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="searches" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSearches)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">VC Investment Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Line type="monotone" dataKey="investment" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MarketInsightsPage;
