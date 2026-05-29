import { RiUserAddLine } from 'react-icons/ri';

export default function EmptyState({ title = 'No leads yet', description = 'Add your first lead to get started.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
        <RiUserAddLine className="text-3xl text-surface-400 dark:text-slate-600" />
      </div>
      <h3 className="text-base font-semibold text-surface-700 dark:text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-slate-500 max-w-xs mb-4">{description}</p>
      {action && action}
    </div>
  );
}
