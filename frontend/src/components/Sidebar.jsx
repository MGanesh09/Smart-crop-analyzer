import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { LayoutDashboard, User, LogOut, Sprout, Bot, TrendingUp, FileText, MessageSquare, ShieldAlert } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const links = [
    { name: t('dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('farms'), path: '/farms', icon: Sprout },
    { name: t('ai'), path: '/ai', icon: Bot },
    { name: t('market'), path: '/market', icon: TrendingUp },
    { name: t('reports'), path: '/reports', icon: FileText },
    { name: t('forum'), path: '/forum', icon: MessageSquare },
    { name: t('profile'), path: '/profile', icon: User },
  ];

  if (user?.role === 'admin') {
    links.splice(links.length - 1, 0, { name: 'Admin Console', path: '/admin', icon: ShieldAlert });
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-20 w-64 border-r border-white/5 bg-slate-950 transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between p-6">
          <div className="space-y-6">
            <div className="py-2">
              <h2 className="mb-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Navigation
              </h2>
              <nav className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all duration-250 ${
                          isActive
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {link.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Quick Status banner */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sprout className="h-4 w-4" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{t('nodeStatus')}</span>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
                {t('transmitting')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition duration-200"
            >
              <LogOut className="h-4.5 w-4.5" />
              {t('signOut')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
