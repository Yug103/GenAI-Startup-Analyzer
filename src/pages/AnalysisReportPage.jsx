import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, TrendingUp, Target, CheckCircle2, ShieldAlert, AlertCircle, FileText, Download } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAppStore } from '../context/AppStore';
import api from '../services/api';

const AnalysisReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setActiveIdea } = useAppStore();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/startup/${id}`);
        setReport(res.data);
        setActiveIdea(res.data);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate, setActiveIdea]);

  const handleExport = async () => {
    try {
      const res = await api.get(`/export/pdf/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.name}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF', err);
    }
  };

  if (loading || !report) return <div className="p-12 text-center text-white">Loading...</div>;

  const getRecommendationColor = (rec) => {
    if (rec?.includes('Proceed')) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (rec?.includes('Pivot')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const radarData = [
    { subject: 'Market', A: report.scores?.market || 0, fullMark: 100 },
    { subject: 'Competition', A: report.scores?.competition || 0, fullMark: 100 },
    { subject: 'Feasibility', A: report.scores?.validation || 0, fullMark: 100 },
    { subject: 'Overall', A: report.scores?.overall || 0, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-700/50 pb-6 gap-4">
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationColor(report.recommendation)}`}>
              {report.recommendation}
            </div>
            <span className="text-slate-500 text-sm">{new Date(report.date).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{report.name} Analysis</h1>
          <p className="text-slate-400 max-w-2xl mt-2">{report.problem}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-2 transition-colors text-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={() => navigate(`/dashboard/competitors`)} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors text-sm">
            View Competitors
          </button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border border-cyan-500/30 flex flex-col items-center justify-center text-center col-span-1">
          <h3 className="text-slate-400 text-sm font-medium mb-4">Overall Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
              <motion.circle 
                initial={{ strokeDasharray: "0 351" }} animate={{ strokeDasharray: `${(report.score / 100) * 351} 351` }}
                transition={{ duration: 1.5 }}
                cx="64" cy="64" r="56" stroke="#06b6d4" strokeWidth="8" fill="none" strokeLinecap="round" 
              />
            </svg>
            <div className="absolute text-4xl font-bold text-white">{report.score}</div>
          </div>
        </div>

        <div className="glass-card p-6 border border-slate-700/50 col-span-1 md:col-span-3">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-purple-400"/> Category Breakdown</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SWOT & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border border-green-500/20 bg-green-500/5">
          <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2"><Target className="w-5 h-5" /> Strengths</h3>
          <ul className="space-y-3">
            {report.swot?.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {str}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-card p-6 border border-red-500/20 bg-red-500/5">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Risks & Weaknesses</h3>
          <ul className="space-y-3">
            {report.swot?.weaknesses?.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> {wk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-card p-6 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" /> Key Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
            <h4 className="text-cyan-400 font-medium mb-1">1. MVP Features</h4>
            <p className="text-slate-300 text-sm">Focus strictly on solving the core problem. Avoid building tangential features until you hit $1k MRR.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
            <h4 className="text-purple-400 font-medium mb-1">2. Validation Strategy</h4>
            <p className="text-slate-300 text-sm">Run 20 customer discovery interviews within the next two weeks. Validate the pain point before writing code.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={() => navigate('/dashboard/validation')} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors text-sm flex items-center gap-2">
            Generate Validation Plan <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default AnalysisReportPage;
