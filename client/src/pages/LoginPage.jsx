import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiFlowChart, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-brand-50/30 to-surface-100 dark:from-surface-950 dark:via-brand-950/20 dark:to-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-glow mx-auto mb-4">
            <RiFlowChart className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Lead<span className="text-brand-600">Flow</span> CRM
          </h1>
          <p className="text-sm text-surface-500 dark:text-slate-500 mt-1">Sign in to your workspace</p>
        </div>

        <div className="card p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                className="input"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors">
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm text-surface-500 dark:text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:text-brand-700">Create one</Link>
          </div>
        </div>

        <p className="text-center text-xs text-surface-400 dark:text-slate-600 mt-4">
          LeadFlow CRM
        </p>
      </div>
    </div>
  );
}
