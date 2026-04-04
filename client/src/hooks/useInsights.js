import { useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';
import { getPersonality } from '../utils/dummyData.js';

function buildWeeklyData(transactions) {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - index));
    const isoDate = day.toISOString().split('T')[0];

    const dayTransactions = transactions.filter((transaction) => transaction.date === isoDate);
    const income = dayTransactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expense = dayTransactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return { day: formatter.format(day), income, expense };
  });
}

export function useInsights(user, transactions, stats) {
  const [insights, setInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [personality, setPersonality] = useState('balanced');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setInsights([]);
      setAlerts([]);
      setPersonality('balanced');
      setError(null);
      return;
    }

    let cancelled = false;
    const fetchInsights = async () => {
      try {
        setError(null);
        const [insightResponse, alertResponse, personalityResponse] = await Promise.all([
          api.get('/insights'),
          api.get('/alerts'),
          api.get('/personality'),
        ]);

        if (!cancelled) {
          setInsights(insightResponse.data || []);
          setAlerts(alertResponse.data || []);
          setPersonality(personalityResponse.data?.type || getPersonality(transactions));
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setInsights([]);
          setAlerts([]);
          setPersonality(getPersonality(transactions));
        }
      }
    };

    fetchInsights();
    return () => { cancelled = true; };
  }, [stats.expense, stats.income, transactions, user?.id]);

  const markAlertRead = async (alertId) => {
    const response = await api.patch(`/alerts/${alertId}/read`, {});
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? response.data : alert)));
  };

  const markAllAlertsRead = async () => {
    await api.patch('/alerts/read-all', {});
    setAlerts((prev) => prev.map((alert) => ({ ...alert, is_read: true })));
  };

  const weeklyChange = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    const thisWeek = transactions.filter((t) => t.type === 'expense' && new Date(t.date) >= oneWeekAgo).reduce((sum, t) => sum + Number(t.amount), 0);
    const lastWeek = transactions.filter((t) => t.type === 'expense' && new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo).reduce((sum, t) => sum + Number(t.amount), 0);
    const pct = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;
    return { thisWeek, lastWeek, pct };
  }, [transactions]);

  const weeklyData = useMemo(() => buildWeeklyData(transactions), [transactions]);

  return { insights, alerts, weeklyChange, weeklyData, personality, error, markAlertRead, markAllAlertsRead };
}
