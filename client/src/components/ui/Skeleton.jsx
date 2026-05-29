export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-surface-200 dark:bg-surface-700 rounded-lg ${className}`} />
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="flex-1 h-4" />
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-16 h-4" />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="w-24 h-3" />
      <Skeleton className="w-16 h-8" />
      <Skeleton className="w-32 h-3" />
    </div>
  );
}
