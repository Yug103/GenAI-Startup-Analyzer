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

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  
  const initials = user
    ? ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || "U"
    : "AK";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 select-none">
          <RocketIcon className="w-7 h-7 text-[#534AB7]" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            IdeaValidator
          </span>
        </Link>
 
        {/* Right side */}
        <div className="flex items-center gap-3">
          {children}
 
          <button
            onClick={() => navigate("/submit")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#534AB7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#463faa] hover:shadow-md active:scale-[0.97]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Idea
          </button>
 
          {/* Mobile new idea button */}
          <button
            onClick={() => navigate("/submit")}
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#534AB7] text-white shadow-sm transition-all hover:bg-[#463faa] active:scale-[0.95]"
            aria-label="New Idea"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
 
          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#534AB7]/10 text-[#534AB7] text-sm font-semibold select-none cursor-pointer transition-colors hover:bg-[#534AB7]/20 focus:outline-none"
              aria-label="User Menu"
            >
              {initials}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'guest@example.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
