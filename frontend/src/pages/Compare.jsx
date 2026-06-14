import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getComparison } from '../services/api';
import Navbar from '../components/Navbar';

export default function ComparePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getComparison();
        // data is already sorted by overall_score DESC from the backend
        setComparisonData(data);
      } catch (err) {
        setError(err.message || 'Failed to load comparison data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDecisionColor = (score) => {
    if (score >= 75) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getDecisionText = (score) => {
    if (score >= 75) return 'GO';
    if (score >= 50) return 'PIVOT';
    return 'NO-GO';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 flex flex-col">
      <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activePage="Compare Ideas" />

        <main className="flex-1 lg:ml-[260px] p-4 sm:p-6 md:p-8 transition-all duration-300">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Compare Ideas
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Evaluate all your analyzed startup concepts side-by-side to find the winner.
                </p>
              </div>
              <Link
                to="/submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#534AB7] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#463faa] hover:shadow-md active:scale-[0.98]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Idea
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#534AB7] border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            ) : comparisonData.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#534AB7]/10">
                  <svg className="h-8 w-8 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No analyzed ideas yet</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  You need to submit and analyze at least one startup idea before you can compare them.
                </p>
                <Link
                  to="/submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#463faa]"
                >
                  Submit your first idea
                </Link>
              </div>
            ) : (
              <div className="space-y-8 fade-in">
                {/* Top Idea Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#534AB7] to-[#7B68EE] p-8 text-white shadow-lg">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10 blur-2xl"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-4">
                        🏆 Top Recommendation
                      </div>
                      <h2 className="text-3xl font-bold">{comparisonData[0].name}</h2>
                      <p className="mt-2 text-indigo-100 max-w-xl">
                        {comparisonData[0].problem}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                      <div className="text-center">
                        <div className="text-sm text-indigo-200 font-medium uppercase">Overall Score</div>
                        <div className="text-4xl font-black mt-1">{comparisonData[0].overall_score}</div>
                      </div>
                      <div className="h-12 w-px bg-white/20"></div>
                      <div className="text-center">
                        <div className="text-sm text-indigo-200 font-medium uppercase">Decision</div>
                        <div className="text-2xl font-bold mt-1 tracking-tight">{getDecisionText(comparisonData[0].overall_score)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {comparisonData.map((idea, index) => {
                    const scores = typeof idea.category_scores === 'string' 
                      ? JSON.parse(idea.category_scores) 
                      : idea.category_scores || {};
                    
                    return (
                      <div 
                        key={idea.idea_id} 
                        className={`relative flex flex-col rounded-2xl bg-white p-6 shadow-sm border transition-all hover:shadow-md ${
                          index === 0 ? 'border-[#534AB7] ring-1 ring-[#534AB7]' : 'border-gray-200'
                        }`}
                      >
                        {index === 0 && (
                          <div className="absolute -top-3 left-6 inline-flex rounded-full bg-[#534AB7] px-3 py-0.5 text-xs font-bold text-white shadow-sm">
                            #1 Pick
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{idea.name}</h3>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${getDecisionColor(idea.overall_score)}`}>
                            {idea.overall_score} / 100
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[40px]">
                          {idea.target_customer} - {idea.industry}
                        </p>
                        
                        <div className="space-y-3 mb-6 flex-1">
                          {/* Progress Bars for Categories */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">Market Opportunity</span>
                              <span className="text-gray-500">{scores.market_opportunity || 0}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scores.market_opportunity || 0}%` }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">MVP Feasibility</span>
                              <span className="text-gray-500">{scores.mvp_feasibility || 0}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${scores.mvp_feasibility || 0}%` }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">Founder Fit</span>
                              <span className="text-gray-500">{scores.founder_market_fit || 0}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scores.founder_market_fit || 0}%` }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          to={`/report?id=${idea.idea_id}`}
                          className="mt-auto block w-full rounded-lg border border-gray-200 bg-white py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                          View Full Report
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
