export default function StatCard({ label, value, icon: Icon, color, sub, trend }) {
  return (
    <div className="card p-5 hover:shadow-lg transition-shadow duration-300 animate-fade-in group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="text-lg" />
        </div>
      </div>
      <p className="text-3xl font-bold text-surface-900 dark:text-white mb-1 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-surface-500 dark:text-slate-500">{sub}</p>}
      {trend !== undefined && (
        <p className={`text-xs font-medium mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
        </p>
      )}
    </div>
  );
}
