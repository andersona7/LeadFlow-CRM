import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  RiGroupLine, RiHeartLine, RiThumbDownLine, RiCheckDoubleLine,
  RiArrowRightLine, RiTimeLine,
} from 'react-icons/ri';
import { dashboardService } from '../services/api';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { SOURCE_ICONS, formatDate, timeAgo } from '../utils/helpers';
import { format } from 'date-fns';

const PIE_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const monthlyData = stats?.monthlyTrend?.map((m) => ({
    month: format(new Date(m.month), 'MMM'),
    leads: parseInt(m.count),
  })) || [];

  const pieData = stats?.statusBreakdown?.map((s) => ({
    name: s.status, value: parseInt(s.count),
  })) || [];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-surface-500 dark:text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Leads" value={stats?.totals?.all ?? 0} icon={RiGroupLine} color="bg-brand-100 dark:bg-brand-900/30 text-brand-600" sub={`${stats?.totals?.thisMonth} this month`} />
            <StatCard label="Interested" value={stats?.totals?.interested ?? 0} icon={RiHeartLine} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" />
            <StatCard label="Converted" value={stats?.totals?.converted ?? 0} icon={RiCheckDoubleLine} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600" sub={`${stats?.conversionRate}% conversion rate`} />
            <StatCard label="Not Interested" value={stats?.totals?.notInterested ?? 0} icon={RiThumbDownLine} color="bg-red-100 dark:bg-red-900/30 text-red-600" />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly trend */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Monthly Lead Trend</h2>
          {loading ? (
            <div className="h-48 animate-pulse bg-surface-100 dark:bg-surface-700 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&_line]:stroke-slate-700" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={2} fill="url(#leadGrad)" dot={{ fill: '#0ea5e9', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status pie */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Status Breakdown</h2>
          {loading ? (
            <div className="h-48 animate-pulse bg-surface-100 dark:bg-surface-700 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Source breakdown + recent leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Leads by Source</h2>
          {loading ? (
            <div className="h-40 animate-pulse bg-surface-100 dark:bg-surface-700 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats?.sourceBreakdown?.map(s => ({ source: s.source, count: parseInt(s.count) })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="source" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: 12 }} />
                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent leads */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Leads</h2>
            <a href="/leads" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
              View all <RiArrowRightLine />
            </a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse bg-surface-100 dark:bg-surface-700 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.recentLeads?.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{lead.name}</p>
                    <p className="text-xs text-surface-500 dark:text-slate-500">
                      {SOURCE_ICONS[lead.source]} {lead.source} · {timeAgo(lead.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
