import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Filter, Shield } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import api from '../services/api';

const CompetitorDiscoveryPage = () => {
  const { activeIdea } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const res = await api.get('/competitors/search', {
          params: { idea: activeIdea?.name || 'Startup', industry: activeIdea?.industry || 'Tech' }
        });
        setCompetitors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitors();
  }, [activeIdea]);

  const filtered = filter === 'all' ? competitors : competitors.filter(c => c.type === filter);

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-700/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            Competitor Discovery <Shield className="text-cyan-400 w-6 h-6" />
          </h1>
          <p className="text-slate-400">AI-identified competitors and substitutes for: <span className="text-white font-medium">{activeIdea?.name || 'Your Startup'}</span></p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search competitors..." className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" />
          </div>
          <button className="p-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'direct', 'indirect', 'substitute'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <motion.div key={comp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border border-slate-700/50 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${comp.type === 'direct' ? 'bg-red-500/20 text-red-400' : comp.type === 'indirect' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-300'}`}>{comp.type}</span>
              </div>
              <a href="#" className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-slate-400 mb-6 flex-1">{comp.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <div className="text-sm"><span className="text-slate-500">Pricing:</span> <span className="text-white font-medium">{comp.pricing}</span></div>
              <div className="text-sm"><span className="text-slate-500">Category:</span> <span className="text-slate-300">{comp.category}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorDiscoveryPage;
