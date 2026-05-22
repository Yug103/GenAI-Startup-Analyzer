import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Copy, CheckCircle2, ChevronDown, MessageSquare, Mail, Globe, ListChecks } from 'lucide-react';
import { useAppStore } from '../context/AppStore';

const ValidationExperimentPage = () => {
  const { activeIdea } = useAppStore();
  const [activeTab, setActiveTab] = useState('interviews');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs = [
    { id: 'interviews', label: 'Customer Interviews', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'landing', label: 'Landing Page Copy', icon: <Globe className="w-4 h-4" /> },
    { id: 'email', label: 'Cold Emails', icon: <Mail className="w-4 h-4" /> },
    { id: 'plan', label: '7-Day Plan', icon: <ListChecks className="w-4 h-4" /> },
  ];

  const interviewQuestions = [
    "Can you describe the hardest part about dealing with [Problem]?",
    "How are you currently trying to solve this problem?",
    "Why is your current solution not awesome?",
    "If you could wave a magic wand, what would the perfect solution look like?",
    "Have you ever paid for a tool to solve this problem? If so, what was it?"
  ];

  const coldEmails = [
    { subject: "Quick question about your workflow", body: "Hi [Name],\n\nI noticed you work in [Industry]. I'm researching how professionals handle [Problem]. \n\nI'm not selling anything—just trying to understand the space. Would you be open to a 10-minute chat next week?\n\nBest,\n[Your Name]" },
    { subject: "Struggling with [Problem]?", body: "Hi [Name],\n\nMost [Target Audience] I speak with hate dealing with [Problem]. \n\nI'm building a tool to automate this and looking for early feedback. Would you be willing to take a quick look?\n\nBest,\n[Your Name]" }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          Validation Experiment Generator <Beaker className="text-purple-400 w-6 h-6" />
        </h1>
        <p className="text-slate-400">Actionable assets to test if people actually want: <span className="text-white font-medium">{activeIdea?.name || 'Your Startup'}</span></p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-px">
        {tabs.map(tab => (
          <button 
            key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 border border-slate-700/50 min-h-[400px]">
        {activeTab === 'interviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Discovery Interview Script</h3>
            <p className="text-sm text-slate-400 mb-6">Focus on past behavior, not future promises. The Mom Test methodology.</p>
            {interviewQuestions.map((q, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-colors group">
                <p className="text-slate-200 text-sm">{q}</p>
                <button onClick={() => copyToClipboard(q, i)} className="text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all">
                  {copiedIndex === i ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'email' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Cold Outreach Templates</h3>
            {coldEmails.map((email, i) => (
              <div key={i} className="rounded-xl bg-slate-900/50 border border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-sm text-slate-300 font-medium">Subject: {email.subject}</span>
                  <button onClick={() => copyToClipboard(email.body, `email-${i}`)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {copiedIndex === `email-${i}` ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-4 text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                  {email.body}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'plan' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">7-Day MVP Validation Plan</h3>
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {[
                { day: 'Day 1', task: 'Define target persona and build list of 50 contacts' },
                { day: 'Day 2', task: 'Send cold emails / LinkedIn outreach' },
                { day: 'Day 3', task: 'Set up a simple Carrd landing page with email capture' },
                { day: 'Day 4-6', task: 'Conduct at least 5 customer interviews' },
                { day: 'Day 7', task: 'Review data: Go / No-Go decision based on waitlist signups' },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-purple-500/30 bg-slate-900 text-purple-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.2)] z-10">
                    {i+1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <h4 className="font-semibold text-cyan-400 text-sm">{item.day}</h4>
                    <p className="text-slate-300 text-sm mt-1">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'landing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-full text-slate-400">
            Work in progress. Implement landing page headline generation here.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ValidationExperimentPage;
