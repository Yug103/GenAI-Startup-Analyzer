import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RocketIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M32 6C32 6 24 16 24 34C24 38 26 42 28 44L32 40L36 44C38 42 40 38 40 34C40 16 32 6 32 6Z"
      fill="currentColor"
    />
    <circle cx="32" cy="28" r="4" fill="white" />
    <circle cx="32" cy="28" r="2.5" fill="currentColor" opacity="0.3" />
    <path
      d="M24 34C20 34 17 39 17 39L24 36Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M40 34C44 34 47 39 47 39L40 36Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M28 44L30 52C30.5 54 31.5 56 32 58C32.5 56 33.5 54 34 52L36 44"
      fill="currentColor"
      opacity="0.35"
    />
    <path
      d="M30 44L31 50C31.3 51 31.7 52 32 53C32.3 52 32.7 51 33 50L34 44"
      fill="currentColor"
      opacity="0.55"
    />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F8F9FA]">
      <div className="w-full max-w-[420px]">
        {/* ── Card ── */}
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)]
                      px-8 py-10 sm:px-10 sm:py-12"
        >
          {/* ── Logo & Tagline ── */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2.5 mb-3 select-none">
              <RocketIcon className="w-9 h-9 text-[#534AB7]" />
              <span className="text-[1.55rem] font-bold tracking-tight text-gray-900">
                IdeaValidator
              </span>
            </div>
            <p className="text-sm text-gray-500 tracking-wide">
              Validate your startup idea with AI
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white
                           px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400
                           outline-none transition
                           focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white
                             px-3.5 py-2.5 pr-11 text-sm text-gray-900
                             placeholder-gray-400 outline-none transition
                             focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[#534AB7]/40
                             rounded"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Forgot password */}
              <div className="mt-2 text-right">
                <a
                  href="#"
                  className="text-xs font-medium text-[#534AB7] hover:text-[#423999]
                             transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#534AB7] px-4 py-2.5 text-sm font-semibold
                         text-white shadow-sm transition-all duration-200
                         hover:bg-[#463faa] hover:shadow-md
                         focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-[#534AB7]
                         active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#534AB7] hover:text-[#423999]
                         transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
