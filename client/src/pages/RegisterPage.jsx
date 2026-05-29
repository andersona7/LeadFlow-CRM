import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiFlowChart } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-brand-50/30 to-surface-100 dark:from-surface-950 dark:via-brand-950/20 dark:to-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-glow mx-auto mb-4">
            <RiFlowChart className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Join <span className="text-brand-600">LeadFlow</span>
          </h1>
          <p className="text-sm text-surface-500 dark:text-slate-500 mt-1">Create your CRM workspace</p>
        </div>

        <div className="card p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input value={form.name} onChange={set('name')} placeholder="Your Name" className="input" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="text-center text-sm text-surface-500 dark:text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
