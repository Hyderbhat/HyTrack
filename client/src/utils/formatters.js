export const formatCurrency = (amount, currency = 'INR') => {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const formatPercent = (value, decimals = 1) =>
  `${Math.abs(value).toFixed(decimals)}%`;

export const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return formatShortDate(dateStr);
};

export const groupByDate = (transactions) => {
  const groups = {};
  transactions.forEach((t) => {
    const key = t.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a));
};

export const summarizeByCategory = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const amount = Number(t.amount);
      map[t.category] = (map[t.category] || 0) + (Number.isFinite(amount) ? amount : 0);
    });
  return Object.entries(map)
    .map(([id, value]) => ({ id, value }))
    .sort((a, b) => b.value - a.value);
};
