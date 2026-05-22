import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Settings, User, LogOut, Menu, X, Rocket, Bell, ArrowLeftRight, TrendingUp, Beaker, Shield } from 'lucide-react';
import { useAppStore } from '../context/AppStore';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { activeIdea, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/dashboard' },
    { icon: <ArrowLeftRight className="w-5 h-5" />, label: 'Compare Ideas', path: '/dashboard/compare' },
    { icon: <User className="w-5 h-5" />, label: 'Profile & Reports', path: '/profile' },
  ];

  const activeIdeaItems = [
    { icon: <FileText className="w-5 h-5" />, label: 'AI Report', path: activeIdea ? `/dashboard/report/${activeIdea.id}` : '#' },
    { icon: <Shield className="w-5 h-5" />, label: 'Competitors', path: '/dashboard/competitors' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Market Insights', path: '/dashboard/market' },
    { icon: <Beaker className="w-5 h-5" />, label: 'Experiments', path: '/dashboard/validation' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="w-64 glass border-r border-slate-700/50 flex flex-col fixed h-full z-40 lg:relative"
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              GenAI <span className="text-gradient">Analyzer</span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || (location.pathname === '/dashboard' && item.path === '/dashboard');
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive && location.pathname === item.path
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {activeIdea && (
            <div className="pt-4 mt-4 border-t border-slate-700/50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 truncate">
                Active: {activeIdea.name}
              </p>
              {activeIdeaItems.map((item, index) => {
                const isActive = location.pathname.includes(item.path) && item.path !== '#';
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'text-cyan-400 bg-slate-800/50' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <Link to="/analyze" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:shadow-lg transition-all transform hover:-translate-y-1 mb-4">
            <Rocket className="w-4 h-4" />
            New Analysis
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 glass border-b border-slate-700/50 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold hidden md:block capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 relative rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-10 h-10 rounded-full border-2 border-cyan-500/50" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Alex Founder</p>
                <p className="text-xs text-slate-400">Pro Plan</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0"></div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
