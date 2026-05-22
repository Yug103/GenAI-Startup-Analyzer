import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppStore';
import api from '../services/api';

const IdeaSubmissionPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm();
  const navigate = useNavigate();
  const { addReport } = useAppStore();
  const [errorMsg, setErrorMsg] = useState(null);

  const totalSteps = 3;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.post('/startup/analyze', data);
      addReport(res.data);
      navigate(`/dashboard/report/${res.data._id}`);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to analyze idea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Submit Your Startup Idea</h1>
        <p className="text-slate-400">Provide details to generate a comprehensive AI validation report.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="flex justify-between mb-2">
          {['Basics', 'Market', 'Assumptions'].map((label, i) => (
            <span key={i} className={`text-sm font-medium ${step >= i + 1 ? 'text-cyan-400' : 'text-slate-500'}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="glass-card p-8 border border-slate-700/50 relative overflow-hidden">
        {isSubmitting ? (
           <motion.div 
           initial={{ opacity: 0 }} animate={{ opacity: 1 }}
           className="flex flex-col items-center justify-center py-12"
         >
           <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
           <h3 className="text-xl font-semibold text-white mb-2">AI is Analyzing Your Idea...</h3>
           <p className="text-slate-400 text-center max-w-sm">Generating market insights, competitor analysis, and validation plans.</p>
         </motion.div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Startup Idea Name *</label>
                    <input {...register("name", { required: true })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="e.g. NextGen AI" />
                    {errors.name && <span className="text-red-400 text-xs mt-1">Required field</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Problem Statement *</label>
                    <textarea {...register("problem", { required: true })} rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none" placeholder="What specific problem are you solving?" />
                    {errors.problem && <span className="text-red-400 text-xs mt-1">Required field</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Industry *</label>
                    <select {...register("industry", { required: true })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all">
                      <option value="">Select Industry</option>
                      <option value="saas">SaaS</option>
                      <option value="fintech">Fintech</option>
                      <option value="healthtech">Healthtech</option>
                      <option value="edtech">Edtech</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="ai">AI / ML</option>
                    </select>
                    {errors.industry && <span className="text-red-400 text-xs mt-1">Required field</span>}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Target Customer *</label>
                    <input {...register("customer", { required: true })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="e.g. Small business owners, Students" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Geography</label>
                    <input {...register("geography")} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="e.g. North America, Global" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Business Model *</label>
                    <select {...register("businessModel", { required: true })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all">
                      <option value="">Select Model</option>
                      <option value="b2b">B2B</option>
                      <option value="b2c">B2C</option>
                      <option value="b2b2c">B2B2C</option>
                      <option value="marketplace">Marketplace</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Pricing Assumption</label>
                    <input {...register("pricing")} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="e.g. $20/month subscription" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Key Assumptions *</label>
                    <textarea {...register("assumptions", { required: true })} rows={3} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none" placeholder="What must be true for this to succeed? (e.g. Users will pay for time-saving tools)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Founder Background / Unfair Advantage</label>
                    <textarea {...register("founder")} rows={3} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none" placeholder="Why are you the right person to build this?" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-6 border-t border-slate-700/50 mt-8">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div></div>}
              
              {step < totalSteps ? (
                <button type="button" onClick={handleNext} className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors flex items-center gap-2">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Sparkles className="w-4 h-4" /> Generate Report
                </button>
              )}
            </div>
          </form>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaSubmissionPage;
