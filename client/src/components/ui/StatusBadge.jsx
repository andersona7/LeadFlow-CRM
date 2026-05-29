import { STATUS_COLORS, STATUS_DOT } from '../../utils/helpers';

export default function StatusBadge({ status, size = 'md' }) {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-600';
  const dotClass = STATUS_DOT[status] || 'bg-slate-400';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`badge ${colorClass} ${sizeClass} font-semibold`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}
