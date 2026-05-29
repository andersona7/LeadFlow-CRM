import { useState, useCallback, useRef } from 'react';
import { leadService } from '../services/api';
import toast from 'react-hot-toast';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await leadService.getAll(params);
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback((params, delay = 400) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchLeads(params), delay);
  }, [fetchLeads]);

  const createLead = async (data) => {
    const res = await leadService.create(data);
    toast.success('Lead created successfully!');
    return res.data;
  };

  const updateLead = async (id, data) => {
    const res = await leadService.update(id, data);
    toast.success('Lead updated successfully!');
    return res.data;
  };

  const updateStatus = async (id, status) => {
    const res = await leadService.updateStatus(id, status);
    toast.success(`Status updated to "${status}"`);
    return res.data;
  };

  const deleteLead = async (id) => {
    await leadService.delete(id);
    toast.success('Lead deleted.');
  };

  return { leads, pagination, loading, fetchLeads, debouncedFetch, createLead, updateLead, updateStatus, deleteLead };
};
