import { useState, useEffect, useCallback } from 'react';
import {
  RiSearchLine, RiFilterLine, RiAddLine, RiDownloadLine,
  RiEditLine, RiDeleteBin6Line, RiPhoneLine, RiMailLine,
  RiArrowUpLine, RiArrowDownLine,
} from 'react-icons/ri';
import { useLeads } from '../hooks/useLeads';
import { useSearchParams } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge';
import LeadModal from '../components/modals/LeadModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { STATUSES, SOURCES, SOURCE_ICONS, exportToCSV, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const LEAD_STATUSES = ['All', ...STATUSES];
const LEAD_SOURCES = ['All', ...SOURCES];

export default function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All', source: 'All' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { leads, pagination, loading, fetchLeads, debouncedFetch, createLead, updateLead, deleteLead } = useLeads();

  // Open add modal if url has ?modal=add
  useEffect(() => {
    if (searchParams.get('modal') === 'add') {
      setModalOpen(true);
      setSearchParams({});
    }
  }, []);

  const buildParams = useCallback(() => ({
    search,
    status: filters.status !== 'All' ? filters.status : undefined,
    source: filters.source !== 'All' ? filters.source : undefined,
    sortBy,
    sortOrder,
    page,
    limit: 10,
  }), [search, filters, sortBy, sortOrder, page]);

  // Debounced fetch on search change
  useEffect(() => {
    debouncedFetch(buildParams());
  }, [search]);

  // Immediate fetch on filter/sort/page change
  useEffect(() => {
    fetchLeads(buildParams());
  }, [filters, sortBy, sortOrder, page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-surface-300 dark:text-slate-600 text-xs">⇅</span>;
    return sortOrder === 'ASC'
      ? <RiArrowUpLine className="text-brand-600 text-xs" />
      : <RiArrowDownLine className="text-brand-600 text-xs" />;
  };

  const handleSubmitLead = async (data) => {
    setActionLoading(true);
    try {
      if (editLead) {
        await updateLead(editLead.id, data);
      } else {
        await createLead(data);
      }
      setModalOpen(false);
      setEditLead(null);
      fetchLeads(buildParams());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteLead(deleteTarget.id);
      setDeleteTarget(null);
      fetchLeads(buildParams());
    } catch {
      toast.error('Failed to delete lead.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">Leads</h1>
          <p className="text-sm text-surface-500 dark:text-slate-500 mt-0.5">{pagination.total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportToCSV(leads)} className="btn-secondary text-xs px-3 py-2 hidden sm:flex">
            <RiDownloadLine /> Export CSV
          </button>
          <button onClick={() => { setEditLead(null); setModalOpen(true); }} className="btn-primary text-xs px-3 py-2">
            <RiAddLine /> Add Lead
          </button>
        </div>
      </div>

      {/* Search & filters bar */}
      <div className="card p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-base" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, or email..."
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters((f) => !f)}
          className={`btn-secondary text-xs px-3 py-2 gap-2 ${showFilters ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 text-brand-700 dark:text-brand-400' : ''}`}
        >
          <RiFilterLine /> Filters
          {(filters.status !== 'All' || filters.source !== 'All') && (
            <span className="w-2 h-2 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
          <div>
            <label className="label">Status</label>
            <select value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }} className="input">
              {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Source</label>
            <select value={filters.source} onChange={(e) => { setFilters((f) => ({ ...f, source: e.target.value })); setPage(1); }} className="input">
              {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex items-end">
            <button onClick={() => { setFilters({ status: 'All', source: 'All' }); setSearch(''); setPage(1); }} className="btn-secondary text-xs">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Desktop table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-surface-800 dark:hover:text-white transition-colors">
                    Name <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  <button onClick={() => handleSort('source')} className="flex items-center gap-1 hover:text-surface-800 dark:hover:text-white transition-colors">
                    Source <SortIcon field="source" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-surface-800 dark:hover:text-white transition-colors">
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-surface-800 dark:hover:text-white transition-colors">
                    Date <SortIcon field="createdAt" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 dark:text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-700/50">
              {loading ? (
                <tr><td colSpan={6}><TableSkeleton rows={5} /></td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6}>
                  <EmptyState
                    title="No leads found"
                    description={search || filters.status !== 'All' ? 'Try adjusting your search or filters.' : 'Add your first lead to get started.'}
                    action={
                      <button onClick={() => setModalOpen(true)} className="btn-primary text-xs">
                        <RiAddLine /> Add Lead
                      </button>
                    }
                  />
                </td></tr>
              ) : (
                leads.map((lead, i) => (
                  <tr key={lead.id} className="hover:bg-surface-50/60 dark:hover:bg-surface-700/30 transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white text-sm">{lead.name}</p>
                          <p className="text-xs text-surface-500 dark:text-slate-500 md:hidden">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-surface-700 dark:text-slate-300 font-mono text-xs flex items-center gap-1">
                        <RiPhoneLine className="text-surface-400 shrink-0" /> {lead.phone}
                      </p>
                      {lead.email && (
                        <p className="text-surface-500 dark:text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <RiMailLine className="shrink-0" /> {lead.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm">{SOURCE_ICONS[lead.source]}</span>
                      <span className="text-xs text-surface-600 dark:text-slate-400 ml-1">{lead.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-surface-500 dark:text-slate-500 hidden lg:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditLead(lead); setModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-surface-400 hover:text-brand-600 transition-colors"
                          title="Edit"
                        >
                          <RiEditLine className="text-base" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(lead)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <RiDeleteBin6Line className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100 dark:border-surface-700">
            <p className="text-xs text-surface-500 dark:text-slate-500">
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-brand-600 text-white' : 'text-surface-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditLead(null); }}
        onSubmit={handleSubmitLead}
        lead={editLead}
        loading={actionLoading}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This lead will be permanently removed from the system."
      />
    </div>
  );
}
