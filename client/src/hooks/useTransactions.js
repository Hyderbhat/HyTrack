import { useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../utils/api.js';
import { computeStats, getPersonality } from '../utils/dummyData.js';
import { summarizeByCategory } from '../utils/formatters.js';

export function useTransactions(user) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ type: 'all', category: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/transactions?limit=100');
        if (!cancelled) {
          setTransactions(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setTransactions([]);
          setError(fetchError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const addTransaction = useCallback(async (tx) => {
    const payload = {
      ...tx,
      amount: Number(tx.amount),
      date: tx.date || new Date().toISOString().split('T')[0],
    };

    const { data } = await api.post('/transactions', payload);
    setTransactions((prev) => [data, ...prev]);
    return data;
  }, []);

  const filtered = useMemo(() => transactions.filter((t) => {
    if (filter.type !== 'all' && t.type !== filter.type) return false;
    if (filter.category && t.category !== filter.category) return false;
    if (search && !t.note?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [transactions, filter, search]);

  const stats = useMemo(() => computeStats(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => summarizeByCategory(transactions), [transactions]);
  const personality = useMemo(() => getPersonality(transactions), [transactions]);

  return {
    transactions,
    filtered,
    stats,
    categoryBreakdown,
    personality,
    loading,
    error,
    addTransaction,
    filter,
    setFilter,
    search,
    setSearch,
  };
}
