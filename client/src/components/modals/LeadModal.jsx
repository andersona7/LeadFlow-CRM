import { useState, useEffect } from 'react';
import { RiCloseLine, RiUserLine } from 'react-icons/ri';
import { STATUSES, SOURCES } from '../../utils/helpers';

const INITIAL_FORM = { name: '', phone: '', email: '', source: 'Call', status: 'New', notes: '' };

export default function LeadModal({ isOpen, onClose, onSubmit, lead = null, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = !!lead;

  useEffect(() => {
    if (lead) {
      setForm({ name: lead.name || '', phone: lead.phone || '', email: lead.email || '', source: lead.source || 'Call', status: lead.status || 'New', notes: lead.notes || '' });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [lead, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[+]?[\d\s\-().]{7,20}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.source) errs.source = 'Source is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit(form);
  };

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((prev) => ({ ...prev, [key]: '' })); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
              <RiUserLine className="text-brand-600 text-base" />
            </div>
            <h2 className="font-semibold text-surface-900 dark:text-white">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h2>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Full Name *</label>
              <input value={form.name} onChange={set('name')} placeholder="Name" className={`input ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Phone *</label>
              <input value={form.phone} onChange={set('phone')} placeholder="9876543210" maxLength={10} className={`input ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="name@example.com" className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Source *</label>
              <select value={form.source} onChange={set('source')} className="input">
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={set('status')} className="input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Notes</label>
              <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Any notes about this lead..." className="input resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
