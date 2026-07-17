import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-emerald-950 px-4 py-12 sm:px-6 lg:px-8 animate-gradient">
      
      {/* Background Decorative Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 h-[35rem] w-[35rem] rounded-full bg-emerald-500/10 blur-3xl animate-glow-1"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full bg-primary-600/10 blur-3xl animate-glow-2"></div>

      {/* Floating Bubbles */}
      <div className="bubble text-emerald-500/20 h-4 w-4 left-[10%]" style={{ animationDelay: '0s', animationDuration: '14s' }}></div>
      <div className="bubble text-primary-500/25 h-8 w-8 left-[25%]" style={{ animationDelay: '2s', animationDuration: '18s' }}></div>
      <div className="bubble text-emerald-400/15 h-6 w-6 left-[45%]" style={{ animationDelay: '4s', animationDuration: '16s' }}></div>
      <div className="bubble text-primary-600/20 h-10 w-10 left-[70%]" style={{ animationDelay: '1s', animationDuration: '22s' }}></div>
      <div className="bubble text-emerald-500/20 h-5 w-5 left-[85%]" style={{ animationDelay: '5s', animationDuration: '15s' }}></div>

      {/* Central Login Card */}
      <div className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-xl animate-card">
        
        {/* Branding & Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-500 to-emerald-400 text-white shadow-xl shadow-primary-500/20 transform transition-transform hover:rotate-12 duration-300">
            <Sprout className="h-8 w-8" />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary-500 to-emerald-400 opacity-35 blur-sm -z-10"></div>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Access your agricultural insights platform
          </p>
        </div>

        {/* Demo Mode Reminder Widget */}
        <div className="rounded-2xl border border-primary-500/20 bg-primary-950/30 p-3.5 text-xs text-primary-300 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-semibold block mb-0.5 text-emerald-300">Auto-Registration Sandbox Mode Active</span>
            Logging in with <span className="underline font-medium text-white">any valid email format</span> automatically sets up a new farm profile on the fly!
          </div>
        </div>

        {formError && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4 text-sm text-rose-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{formError}</p>
          </div>
        )}

        {/* Form Container */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
                Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-900/50 py-3.5 pl-11 pr-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-primary-500 focus:bg-slate-900/90 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="ganeshmannena@gamil.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 pl-1">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-900/50 py-3.5 pl-11 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-primary-500 focus:bg-slate-900/90 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pl-1">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3.5 px-4 text-sm font-bold text-white hover:brightness-110 active:scale-[0.99] focus:outline-none disabled:opacity-50 transition-all duration-200 shadow-lg shadow-primary-500/10"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 mt-6 border-t border-white/5 pt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary-400 hover:text-primary-300">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
