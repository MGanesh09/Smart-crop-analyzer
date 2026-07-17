import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import { Sun, Moon, LogOut, Sprout, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Brand Link & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/5 md:hidden transition duration-200"
            title="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/10">
              <Sprout className="h-5.5 w-5.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              AgriSmart<span className="text-emerald-400">.</span>
            </span>
          </Link>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/60 py-1.5 px-2.5 text-xs font-semibold text-slate-300 outline-none hover:border-emerald-500/40 hover:text-white transition cursor-pointer"
          >
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिंदी</option>
          </select>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/5 transition duration-200"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400 animate-pulse" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Alarm Notifications */}
          <button className="relative rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/5 transition duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </button>

          {/* Profile details */}
          {user && (
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 rounded-xl p-1 hover:bg-white/5 transition duration-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 leading-none">{user.name}</span>
                  <span className="text-[9px] text-slate-500 capitalize">{user.role}</span>
                </div>
              </Link>
              
              <button
                onClick={logout}
                className="rounded-xl p-2 text-rose-500 hover:bg-rose-500/10 transition duration-200"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
