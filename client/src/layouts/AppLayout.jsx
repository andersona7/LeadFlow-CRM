import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine, RiUserLine, RiAddCircleLine,
  RiMenuLine, RiCloseLine, RiMoonLine, RiSunLine,
  RiLogoutBoxLine, RiFlowChart,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/leads', icon: RiUserLine, label: 'Leads' },
];

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-glow">
      <RiFlowChart className="text-white text-lg" />
    </div>
    <span className="font-bold text-lg tracking-tight text-surface-900 dark:text-white">
      Lead<span className="text-brand-600">Flow</span>
    </span>
  </div>
);

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-100 dark:border-surface-700">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-surface-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="text-lg shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 space-y-2 border-t border-surface-100 dark:border-surface-700 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-surface-500 dark:text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <RiLogoutBoxLine /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-surface-900 shadow-2xl animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
            <RiMenuLine className="text-xl" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-slate-400 transition-colors"
              title="Toggle theme"
            >
              {dark ? <RiSunLine className="text-lg" /> : <RiMoonLine className="text-lg" />}
            </button>
            <button
              onClick={() => navigate('/leads?modal=add')}
              className="btn-primary text-xs px-3 py-2"
            >
              <RiAddCircleLine /> New Lead
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
