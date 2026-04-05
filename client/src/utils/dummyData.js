import { CATEGORIES } from '../../../shared/constants.js';

const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - offset);
  return dt.toISOString().split('T')[0];
};

export const DUMMY_USER = {
  id: 'user-001',
  name: 'Hyder Bhat',
  email: 'hyder@example.com',
  avatar: null,
  budget: 50000,
  memberSince: '2024-01-01',
};

export const DUMMY_TRANSACTIONS = [
  { id: 't001', type: 'income',  amount: 85000, category: 'salary',        note: 'Monthly salary',          date: d(1) },
  { id: 't002', type: 'income',  amount: 15000, category: 'freelance',     note: 'UI design project',       date: d(3) },
  { id: 't003', type: 'expense', amount: 18000, category: 'rent',          note: 'Monthly rent',            date: d(2) },
  { id: 't004', type: 'expense', amount: 4200,  category: 'food',          note: 'Groceries + restaurant',  date: d(0) },
  { id: 't005', type: 'expense', amount: 1800,  category: 'transport',     note: 'Uber & metro',            date: d(0) },
  { id: 't006', type: 'expense', amount: 3500,  category: 'shopping',      note: 'Myntra order',            date: d(2) },
  { id: 't007', type: 'expense', amount: 999,   category: 'entertainment', note: 'Netflix & Spotify',       date: d(4) },
  { id: 't008', type: 'expense', amount: 2200,  category: 'health',        note: 'Pharmacy + gym',          date: d(5) },
  { id: 't009', type: 'expense', amount: 1500,  category: 'utilities',     note: 'Electricity bill',        date: d(6) },
  { id: 't010', type: 'income',  amount: 5000,  category: 'investment',    note: 'Dividend received',       date: d(7) },
  { id: 't011', type: 'expense', amount: 2800,  category: 'food',          note: 'Team lunch outing',       date: d(7) },
  { id: 't012', type: 'expense', amount: 6500,  category: 'shopping',      note: 'Electronics (earbuds)',   date: d(9) },
  { id: 't013', type: 'expense', amount: 800,   category: 'transport',     note: 'Auto & cab fare',         date: d(9) },
  { id: 't014', type: 'expense', amount: 4000,  category: 'education',     note: 'Online course',           date: d(11) },
  { id: 't015', type: 'income',  amount: 8000,  category: 'freelance',     note: 'Logo design',             date: d(13) },
  { id: 't016', type: 'expense', amount: 1200,  category: 'food',          note: 'Swiggy orders',           date: d(13) },
  { id: 't017', type: 'expense', amount: 500,   category: 'other',         note: 'Misc expenses',           date: d(14) },
  { id: 't018', type: 'expense', amount: 3200,  category: 'entertainment', note: 'Movie night + dinner',    date: d(15) },
  { id: 't019', type: 'expense', amount: 9000,  category: 'shopping',      note: 'Clothes & footwear',      date: d(16) },
  { id: 't020', type: 'income',  amount: 12000, category: 'freelance',     note: 'App development',         date: d(20) },
];

export const getCategoryMeta = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

const toSafeAmount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const computeStats = (transactions = DUMMY_TRANSACTIONS) => {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + toSafeAmount(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + toSafeAmount(t.amount), 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  return { income, expense, balance, savingsRate };
};

export const getPersonality = (transactions = DUMMY_TRANSACTIONS) => {
  const { income, expense, savingsRate } = computeStats(transactions);
  if (savingsRate >= 30) return 'saver';
  if (savingsRate >= 10) return 'balanced';
  if (expense > income)  return 'overspender';
  return 'risky';
};

export const DUMMY_WEEKLY_DATA = [
  { day: 'Mon', income: 0,     expense: 2400 },
  { day: 'Tue', income: 0,     expense: 1800 },
  { day: 'Wed', income: 15000, expense: 5200 },
  { day: 'Thu', income: 0,     expense: 3100 },
  { day: 'Fri', income: 0,     expense: 6800 },
  { day: 'Sat', income: 8000,  expense: 4500 },
  { day: 'Sun', income: 0,     expense: 2900 },
];

export const DUMMY_ALERTS = [
  { id: 'a1', type: 'danger',  icon: '🔴', title: 'Budget Exceeded', desc: 'You\'ve spent 120% of your monthly food budget.' },
  { id: 'a2', type: 'warning', icon: '🟡', title: 'High Spend Day',  desc: 'Yesterday you spent ₹6,800 — 3× your daily avg.' },
  { id: 'a3', type: 'info',    icon: '🔵', title: 'Savings Tip',     desc: 'Reduce entertainment by 15% to hit your goal.' },
];

export const DUMMY_INSIGHTS = [
  { id: 'i1', icon: '📊', message: 'You spent 24% more this week compared to last week.', tag: 'Spending Trend' },
  { id: 'i2', icon: '🍔', message: 'Food & Dining is your highest expense category this month.', tag: 'Top Category' },
  { id: 'i3', icon: '💡', message: 'Your savings rate is 27% — you\'re a strong saver!', tag: 'Savings' },
  { id: 'i4', icon: '🛍️', message: 'Shopping expenses increased by ₹15,700 compared to last month.', tag: 'Shopping' },
];
