import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RocketIcon from '../components/RocketIcon';
import EyeIcon from '../components/EyeIcon';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (password.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: 'w-1/2' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  // Handles user registration by calling the backend API and redirecting to dashboard on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await registerUser(firstName, lastName, email, password, role);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-10">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:px-10 sm:py-12">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#534AB7]/10">
            <RocketIcon className="h-6 w-6 text-[#534AB7]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">IdeaValidator</h1>
          <p className="mt-1 text-sm text-gray-500">Validate your startup ideas with AI</p>
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First name & Last name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} className="h-5 w-5" />
              </button>
            </div>

            {/* Password strength indicator */}
            {strength && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.width}`}
                  />
                </div>
                <p className={`mt-1 text-xs ${
                  strength.label === 'Weak' ? 'text-red-500' :
                  strength.label === 'Medium' ? 'text-amber-500' :
                  'text-green-500'
                }`}>
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          {/* Role dropdown */}
          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="Founder">Founder</option>
              <option value="Student">Student</option>
              <option value="Mentor">Mentor</option>
              <option value="Incubator">Incubator</option>
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              Account created successfully! Redirecting...
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#534AB7] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#463faa] hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#534AB7] transition hover:text-[#463faa]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
