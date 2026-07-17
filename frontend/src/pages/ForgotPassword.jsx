import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, Key } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [simulatedToken, setSimulatedToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      if (data.success) {
        setSimulatedToken(data.resetToken);
        setSuccess('Token generated successfully (simulated link).');
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to request reset token.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(simulatedToken, newPassword);
      setSuccess('Your password has been reset successfully. You can now log in.');
      setStep(3); // success state
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white/70 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-emerald-400 text-white shadow-lg shadow-primary-500/20">
            <Sprout className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Reset Password'}
            {step === 3 && 'Password Changed!'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {step === 1 && 'We will generate a sandbox password reset link'}
            {step === 2 && 'Enter the generated token and your new password'}
            {step === 3 && 'Successfully updated your security credentials'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleRequestToken}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500 dark:focus:bg-slate-950"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-4 text-sm font-semibold text-white hover:brightness-105 focus:outline-none disabled:opacity-50 transition-all duration-200 shadow-md shadow-primary-500/10"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  'Generate Reset Token'
                )}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="rounded-xl border border-primary-100 bg-primary-50/30 p-3 text-xs text-primary-800 dark:border-primary-900/50 dark:bg-primary-950/20 dark:text-primary-300">
                <span className="font-semibold block mb-1">Simulated Reset Token:</span>
                <span className="font-mono select-all break-all block p-2 bg-white dark:bg-slate-950 rounded border border-primary-200 dark:border-primary-900">
                  {simulatedToken}
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">The token is pre-filled and valid for 10 minutes.</span>
              </div>

              <div>
                <label htmlFor="token" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Reset Token
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Key className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="token"
                    type="text"
                    required
                    value={simulatedToken}
                    onChange={(e) => setSimulatedToken(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-4 text-sm font-semibold text-white hover:brightness-105 focus:outline-none disabled:opacity-50 transition-all duration-200 shadow-md shadow-primary-500/10"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="mt-8">
            <Link
              to="/login"
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-4 text-sm font-semibold text-white hover:brightness-105 transition-all duration-200 shadow-md shadow-primary-500/10"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}

        <div className="text-center text-sm mt-6">
          <Link to="/login" className="inline-flex items-center gap-2 font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
