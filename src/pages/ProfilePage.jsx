import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, CreditCard, Settings, LogOut, FileText, Download, Trash2, Shield, Bell } from 'lucide-react';
import { useAppStore } from '../context/AppStore';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, savedReports, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeUser = user || { name: 'Alex Founder', email: 'alex@startup.com' };

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 border border-slate-700/50 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-cyan-500/20 to-purple-600/20"></div>
              <div className="relative mt-8 mb-4">
                <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-800 relative z-10" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-slate-800 rounded-full z-20"></div>
              </div>
              <h2 className="text-xl font-bold text-white">{activeUser.name}</h2>
              <p className="text-sm text-slate-400 mb-6">{activeUser.email}</p>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wide">
                Pro Plan
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4 border border-slate-700/50"
            >
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-cyan-400 font-medium">
                  <User className="w-5 h-5" /> Account Details
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                  <CreditCard className="w-5 h-5" /> Billing & Plan
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                  <Bell className="w-5 h-5" /> Notifications
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                  <Shield className="w-5 h-5" /> Security
                </button>
                <div className="pt-4 mt-4 border-t border-slate-700/50">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Log Out
                  </button>
                </div>
              </nav>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3 space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 px-4 py-3 rounded-xl">
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="text-white">{activeUser.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 px-4 py-3 rounded-xl">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <span className="text-white">{activeUser.email}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors">
                  Edit Profile
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Saved Analyses
                </h3>
              </div>
              
              <div className="p-0">
                {savedReports.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-slate-500" />
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">No reports yet</h4>
                    <p className="text-slate-400 mb-6">You haven't generated any startup analysis reports.</p>
                    <button 
                      onClick={() => navigate('/analyze')}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
                    >
                      Create First Analysis
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {savedReports.map((report) => (
                      <div key={report.id} className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-white">{report.name}</h4>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400">Score: {report.score}/100</span>
                          </div>
                          <p className="text-sm text-slate-400">{report.industry.toUpperCase()} • generated recently</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" title="Download PDF">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/dashboard/report/${report.id}`)} className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-medium text-sm transition-colors">
                            View Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
