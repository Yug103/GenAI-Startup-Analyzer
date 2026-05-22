import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppStore';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const AuthPage = ({ type = 'login' }) => {
  const isLogin = type === 'login';
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError(null);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, data);
      
      login(res.data);
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });
      login(res.data);
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setAuthError('Google Sign In failed. Please try again.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-8 md:p-10 border border-slate-700/50 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Start analyzing your startup ideas with AI.'}
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  {...register("name", { required: !isLogin })}
                  type="text" 
                  placeholder="Alex Founder"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                type="email" 
                placeholder="alex@startup.com"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
            {errors.email && <span className="text-xs text-red-400">Valid email is required</span>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-300">Password</label>
              {isLogin && <a href="#" className="text-xs text-cyan-400 hover:underline">Forgot password?</a>}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                {...register("password", { required: true, minLength: 6 })}
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
            {errors.password && <span className="text-xs text-red-400">Password must be at least 6 characters</span>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')} {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="text-xs text-slate-500 uppercase font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <div className="mt-6 flex justify-center w-full overflow-hidden rounded-lg">
          <div className="w-full flex justify-center items-center h-10">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text={isLogin ? "signin_with" : "signup_with"}
              width="100%"
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-cyan-400 font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default AuthPage;
