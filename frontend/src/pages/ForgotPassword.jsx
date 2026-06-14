import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RocketIcon from '../components/RocketIcon';
import EyeIcon from '../components/EyeIcon';
import { forgotPassword, verifyOTP, resetPassword } from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSuccess('An OTP has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await verifyOTP(email, otp);
      setSuccess('OTP verified successfully!');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Password reset successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group cursor-pointer w-fit mx-auto">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md transition-all duration-300 shrink-0">
            <RocketIcon className="w-6 h-6 text-[#534AB7] transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#534AB7] to-[#7b74cc]">
            IdeaValidator
          </span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {step === 1 && "Reset your password"}
          {step === 2 && "Enter your code"}
          {step === 3 && "Create new password"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 1 && "Or "}
          {step === 1 && <Link to="/login" className="font-semibold text-[#534AB7] hover:text-[#463faa] transition-colors">return to log in</Link>}
          {step === 2 && `We sent a 6-digit code to ${email}`}
          {step === 3 && "Please enter a strong password for your account"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-emerald-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOTP}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] sm:text-sm transition-colors"
                    placeholder="founder@startup.com" />
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#534AB7] hover:bg-[#463faa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#534AB7] disabled:opacity-50 transition-colors">
                {isLoading ? 'Sending...' : 'Send reset code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">6-Digit Code</label>
                <div className="mt-1">
                  <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] text-center text-2xl tracking-[0.5em] font-mono transition-colors"
                    placeholder="••••••" />
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#534AB7] hover:bg-[#463faa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#534AB7] disabled:opacity-50 transition-colors">
                {isLoading ? 'Verifying...' : 'Verify code'}
              </button>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
                  Didn't receive the code? Go back
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
                <div className="mt-1 relative">
                  <input id="newPassword" name="newPassword" type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] sm:text-sm pr-10 transition-colors"
                    placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="mt-1 relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] sm:text-sm pr-10 transition-colors"
                    placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showConfirmPassword} className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#534AB7] hover:bg-[#463faa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#534AB7] disabled:opacity-50 transition-colors">
                {isLoading ? 'Saving...' : 'Reset password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
