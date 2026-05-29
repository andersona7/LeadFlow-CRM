import { RiDeleteBin6Line, RiCloseLine } from 'react-icons/ri';

export default function ConfirmModal({ isOpen, onClose, onConfirm, loading, title, description }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative w-full max-w-sm p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <RiDeleteBin6Line className="text-red-600 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-1">{title || 'Delete Lead'}</h3>
            <p className="text-sm text-surface-500 dark:text-slate-400">
              {description || 'Are you sure? This action cannot be undone.'}
            </p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-600 dark:hover:text-slate-200">
            <RiCloseLine className="text-xl" />
          </button>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 justify-center inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-all duration-200 disabled:opacity-60">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
