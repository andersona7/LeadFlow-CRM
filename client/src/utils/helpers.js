export const STATUS_COLORS = {
  'New':           'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Interested':    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Not Interested':'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Converted':     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Follow Up':     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export const STATUS_DOT = {
  'New':           'bg-blue-500',
  'Interested':    'bg-emerald-500',
  'Not Interested':'bg-red-500',
  'Converted':     'bg-purple-500',
  'Follow Up':     'bg-amber-500',
};

export const SOURCE_ICONS = {
  Call:      '📞',
  WhatsApp:  '💬',
  Field:     '🏃',
  Website:   '🌐',
  Referral:  '🤝',
};

export const STATUSES = ['New', 'Interested', 'Not Interested', 'Converted', 'Follow Up'];
export const SOURCES = ['Call', 'WhatsApp', 'Field', 'Website', 'Referral'];

export const exportToCSV = (leads) => {
  const headers = ['Name', 'Phone', 'Email', 'Source', 'Status', 'Created At'];
  const rows = leads.map((l) => [
    l.name, l.phone, l.email || '', l.source, l.status,
    new Date(l.createdAt).toLocaleDateString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
  URL.revokeObjectURL(url);
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
