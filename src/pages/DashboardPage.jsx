import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Activity, Target, Brain, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppStore';
import api from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [stats, setStats] = useState({ totalAnalyses: 0, avgScore: 0, recentReports: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dataMarket = [
    { name: 'Jan', demand: 4000, supply: 2400 },
    { name: 'Feb', demand: 3000, supply: 1398 },
    { name: 'Mar', demand: 2000, supply: 9800 },
    { name: 'Apr', demand: 2780, supply: 3908 },
    { name: 'May', demand: 1890, supply: 4800 },
    { name: 'Jun', demand: 2390, supply: 3800 },
    { name: 'Jul', demand: 3490, supply: 4300 },
  ];

  const dataScore = stats.recentReports.length > 0 
    ? stats.recentReports.map((r, i) => ({ name: `Idea ${i+1}`, score: r.scores?.overall || 0 }))
    : [
        { name: 'Analysis 1', score: 0 },
      ];

  const avgScore = stats.avgScore;

  if (loading) {
    return <div className="text-center text-white p-12">Loading Dashboard...</div>;
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Alex'}</h2>
          <p className="text-slate-400 mt-1">Here's the latest data for your startup analyses.</p>
        </div>
        <button onClick={() => navigate('/analyze')} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Analyses', value: stats.totalAnalyses.toString(), trend: stats.totalAnalyses > 0 ? '+1' : '0', icon: <Activity className="w-5 h-5 text-cyan-400" />, up: true },
          { label: 'Avg Startup Score', value: `${avgScore}/100`, trend: 'Active', icon: <Target className="w-5 h-5 text-purple-400" />, up: true },
          { label: 'Market Viability', value: avgScore >= 75 ? 'High' : avgScore >= 50 ? 'Medium' : 'Low', trend: 'Stable', icon: <TrendingUp className="w-5 h-5 text-green-400" />, up: true },
          { label: 'Competitor Threat', value: 'Medium', trend: '-12%', icon: <Users className="w-5 h-5 text-orange-400" />, up: false },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border border-slate-700/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend}
                {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 border border-slate-700/50 h-[400px] flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Market Demand vs Supply</h3>
            <p className="text-sm text-slate-400">Trend prediction for your primary industry</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataMarket} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                <Area type="monotone" dataKey="supply" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSupply)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 border border-slate-700/50 h-[400px] flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Startup Score Progression</h3>
            <p className="text-sm text-slate-400">Improvement over iterations</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataScore} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Reports Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card border border-slate-700/50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Recent Analyses</h3>
          {stats.recentReports.length > 5 && <button onClick={() => navigate('/profile')} className="text-cyan-400 text-sm hover:text-cyan-300 font-medium">View All</button>}
        </div>
        
        {stats.recentReports.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <FileText className="w-12 h-12 text-slate-600 mb-4" />
            <h4 className="text-white font-medium mb-2">No Reports Yet</h4>
            <p className="text-slate-400 text-sm mb-4">Start by analyzing your first startup idea.</p>
            <button onClick={() => navigate('/analyze')} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors">
              New Analysis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-sm">
                  <th className="p-4 font-medium">Project Name</th>
                  <th className="p-4 font-medium">Industry</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentReports.slice(0, 5).map((row) => (
                  <tr key={row._id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{row.name}</td>
                    <td className="p-4 text-slate-300 capitalize">{row.industry}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        (row.scores?.overall || 0) > 80 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {row.scores?.overall || 0}/100
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium text-green-400`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Completed
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => navigate(`/dashboard/report/${row._id}`)} className="text-cyan-400 hover:text-white transition-colors">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
