import { Link } from "react-router-dom";
import RocketIcon from "../components/RocketIcon";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans flex flex-col">
       {/* Navbar */}
       <header className="flex items-center justify-between px-8 py-6 w-full">
          <div className="flex items-center gap-2 select-none">
            <RocketIcon className="w-8 h-8 text-[#534AB7]" />
            <span className="text-xl font-bold tracking-tight text-gray-900">IdeaValidator</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-medium bg-[#534AB7] text-white px-5 py-2.5 rounded-lg hover:bg-[#463faa] transition shadow-sm active:scale-95">
              Get Started Free
            </Link>
          </nav>
       </header>

       {/* Hero Section */}
       <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-5xl mx-auto w-full">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#534AB7]/10 text-[#534AB7] text-sm font-semibold tracking-wide">
            Powered by AI
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-6">
            Stop Guessing. <br className="hidden sm:block" />
            <span className="text-[#534AB7]">Validate with Data.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Submit your startup idea and let our AI analyst generate a comprehensive validation plan, uncover competitor gaps, and calculate your true market potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto bg-[#534AB7] text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-[#463faa] transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-center">
              Analyze My Idea
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm active:scale-95 text-center">
              Sign In
            </Link>
          </div>
       </main>

       {/* Features */}
       <section className="bg-white py-20 border-t border-gray-100 px-4">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-16">Everything you need to launch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {/* Feature 1 */}
               <div className="text-center md:text-left">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 mx-auto md:mx-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Scoring</h3>
                 <p className="text-gray-500 leading-relaxed">Get an objective 0-100 score analyzing problem severity, founder fit, and market feasibility.</p>
               </div>
               {/* Feature 2 */}
               <div className="text-center md:text-left">
                 <div className="w-12 h-12 bg-[#534AB7]/10 text-[#534AB7] rounded-xl flex items-center justify-center mb-5 mx-auto md:mx-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">7-Day Action Plan</h3>
                 <p className="text-gray-500 leading-relaxed">Receive a day-by-day roadmap, complete with customer interview questions and MVP kill-conditions.</p>
               </div>
               {/* Feature 3 */}
               <div className="text-center md:text-left">
                 <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 mx-auto md:mx-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Competitor Intel</h3>
                 <p className="text-gray-500 leading-relaxed">Automatically map out your direct and indirect competitors, their pricing models, and your market gap.</p>
               </div>
            </div>
         </div>
       </section>

       {/* Footer */}
       <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
         <p>© {new Date().getFullYear()} IdeaValidator. Designed for founders.</p>
       </footer>
    </div>
  );
};

export default Home;
