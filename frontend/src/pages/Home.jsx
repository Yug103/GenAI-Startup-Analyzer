import { Link } from "react-router-dom";
import RocketIcon from "../components/RocketIcon";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-hidden">
       {/* Background Decorative Elements */}
       <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
       <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
       <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

       <header className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 w-full relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 select-none group cursor-pointer min-w-0">
            <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md transition-all duration-300 shrink-0">
              <RocketIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#534AB7] transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#534AB7] to-[#7b74cc] truncate">
              IdeaValidator
            </span>
          </div>
          <nav className="flex items-center gap-3 sm:gap-6 shrink-0 ml-2">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-[#534AB7] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-[#463faa] transition-all duration-300 shadow-[0_4px_14px_0_rgba(83,74,183,0.39)] hover:shadow-[0_6px_20px_rgba(83,74,183,0.23)] hover:-translate-y-0.5 active:scale-95 text-center whitespace-nowrap">
              <span className="sm:hidden">Get Started</span>
              <span className="hidden sm:inline">Get Started Free</span>
            </Link>
          </nav>
       </header>

       {/* Hero Section */}
       <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32 max-w-5xl mx-auto w-full relative z-10">
          <div className="animate-fade-in-up inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold tracking-wide text-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-[#534AB7] animate-pulse"></span>
            Powered by AI
          </div>
          
          <h1 className="animate-fade-in-up animation-delay-200 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6 sm:mb-8">
            Stop Guessing. <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#534AB7] via-[#7b74cc] to-[#ec4899] animate-float inline-block mt-2 sm:mt-0">
              Validate with Data.
            </span>
          </h1>
          
          <p className="animate-fade-in-up animation-delay-400 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Submit your startup idea and let our AI analyst generate a comprehensive validation plan, uncover competitor gaps, and calculate your true market potential in seconds.
          </p>
          
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto bg-[#534AB7] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#463faa] transition-all duration-300 shadow-[0_4px_14px_0_rgba(83,74,183,0.39)] hover:shadow-[0_6px_20px_rgba(83,74,183,0.23)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group">
              Analyze My Idea
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
       </main>

       {/* Features */}
       <section className="relative bg-white/60 backdrop-blur-3xl py-24 border-t border-white/50 px-4 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.03)] z-10">
         <div className="max-w-6xl mx-auto">
            <h2 className="animate-fade-in-up text-center text-3xl md:text-4xl font-extrabold text-slate-900 mb-16 tracking-tight">Everything you need to launch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
               {/* Feature 1 */}
               <div className="animate-fade-in-up animation-delay-200 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Scoring</h3>
                 <p className="text-slate-500 leading-relaxed font-medium">Get an objective 0-100 score analyzing problem severity, founder fit, and market feasibility.</p>
               </div>
               
               {/* Feature 2 */}
               <div className="animate-fade-in-up animation-delay-400 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#534AB7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="relative z-10">
                   <div className="w-14 h-14 bg-[#534AB7]/10 text-[#534AB7] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#534AB7]/20 transition-all duration-300">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">7-Day Action Plan</h3>
                   <p className="text-slate-500 leading-relaxed font-medium">Receive a day-by-day roadmap, complete with customer interview questions and MVP kill-conditions.</p>
                 </div>
               </div>
               
               {/* Feature 3 */}
               <div className="animate-fade-in-up animation-delay-400 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Competitor Intel</h3>
                 <p className="text-slate-500 leading-relaxed font-medium">Automatically map out your direct and indirect competitors, their pricing models, and your market gap.</p>
               </div>
            </div>
         </div>
       </section>

       {/* Footer */}
       <footer className="bg-white py-10 text-center text-slate-500 text-sm font-medium border-t border-slate-100 z-10 relative">
         <p>© {new Date().getFullYear()} IdeaValidator. Designed for founders.</p>
       </footer>
    </div>
  );
};

export default Home;
