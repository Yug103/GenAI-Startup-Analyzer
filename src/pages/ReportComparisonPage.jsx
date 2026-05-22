import React, { useState } from 'react';
import { useAppStore } from '../context/AppStore';
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportComparisonPage = () => {
  const { savedReports } = useAppStore();
  const navigate = useNavigate();
  const [selectedReports, setSelectedReports] = useState([]);

  if (savedReports.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <ArrowLeftRight className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Not Enough Reports</h2>
        <p className="text-slate-400 mb-6">You need at least two saved startup analyses to use the comparison tool.</p>
        <button onClick={() => navigate('/analyze')} className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
          Analyze New Idea
        </button>
      </div>
    );
  }

  const toggleReport = (id) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter(r => r !== id));
    } else {
      if (selectedReports.length < 3) {
        setSelectedReports([...selectedReports, id]);
      }
    }
  };

  const reportsToCompare = selectedReports.map(id => savedReports.find(r => r.id === id));

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          Compare Startup Ideas <ArrowLeftRight className="text-cyan-400 w-6 h-6" />
        </h1>
        <p className="text-slate-400">Select up to 3 ideas to compare viability side-by-side.</p>
      </div>

      {/* Selector */}
      <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-700/50">
        {savedReports.map(report => (
          <button
            key={report.id}
            onClick={() => toggleReport(report.id)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
              selectedReports.includes(report.id) 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
              : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {report.name}
            {selectedReports.includes(report.id) && <Check className="w-3 h-3" />}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {reportsToCompare.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-slate-700 text-slate-400 font-medium w-1/4">Metrics</th>
                {reportsToCompare.map(r => (
                  <th key={r.id} className="p-4 text-left border-b border-slate-700 text-white font-bold w-1/4">
                    <div className="flex justify-between items-center">
                      {r.name}
                      <button onClick={() => toggleReport(r.id)} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-slate-700/50 text-slate-300 font-medium bg-slate-900/30">Overall Score</td>
                {reportsToCompare.map(r => (
                  <td key={r.id} className="p-4 border-b border-slate-700/50 bg-slate-900/30">
                    <span className={`text-xl font-bold ${r.score >= 80 ? 'text-green-400' : r.score >= 60 ? 'text-orange-400' : 'text-red-400'}`}>{r.score}/100</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b border-slate-700/50 text-slate-300 font-medium">Industry</td>
                {reportsToCompare.map(r => <td key={r.id} className="p-4 border-b border-slate-700/50 text-slate-400 capitalize">{r.industry}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-b border-slate-700/50 text-slate-300 font-medium bg-slate-900/30">Business Model</td>
                {reportsToCompare.map(r => <td key={r.id} className="p-4 border-b border-slate-700/50 text-slate-400 capitalize bg-slate-900/30">{r.businessModel || 'N/A'}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-b border-slate-700/50 text-slate-300 font-medium">Recommendation</td>
                {reportsToCompare.map(r => (
                  <td key={r.id} className="p-4 border-b border-slate-700/50">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${r.recommendation?.includes('Proceed') ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {r.recommendation || 'Needs Review'}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportComparisonPage;
