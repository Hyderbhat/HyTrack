// Shared across client + server
export const COLORS = {
  hunyadi: '#E09F3E',
  auburn: '#9E2A2B',
  slateDark: '#335C67',
  vanilla: '#FFF3B0',
};

export const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',   icon: '🍔', color: '#E09F3E' },
  { id: 'transport',     label: 'Transport',        icon: '🚗', color: '#335C67' },
  { id: 'shopping',      label: 'Shopping',         icon: '🛍️', color: '#9b59b6' },
  { id: 'entertainment', label: 'Entertainment',    icon: '🎬', color: '#2980b9' },
  { id: 'health',        label: 'Health',           icon: '💊', color: '#27ae60' },
  { id: 'utilities',     label: 'Utilities',        icon: '⚡', color: '#f39c12' },
  { id: 'rent',          label: 'Rent / Housing',   icon: '🏠', color: '#c0392b' },
  { id: 'salary',        label: 'Salary',           icon: '💼', color: '#16a085' },
  { id: 'freelance',     label: 'Freelance',        icon: '💻', color: '#8e44ad' },
  { id: 'investment',    label: 'Investment',       icon: '📈', color: '#27ae60' },
  { id: 'education',     label: 'Education',        icon: '📚', color: '#2c3e50' },
  { id: 'other',         label: 'Other',            icon: '📦', color: '#7f8c8d' },
];

export const PERSONALITIES = {
  saver: {
    label: 'Saver',
    emoji: '💰',
    color: '#27ae60',
    description: 'You consistently spend less than you earn. Excellent financial discipline!',
    tip: 'Consider investing your surplus for long-term growth.',
  },
  balanced: {
    label: 'Balanced',
    emoji: '⚖️',
    color: '#E09F3E',
    description: 'Your income and expenses are well balanced. You\'re on the right track.',
    tip: 'Build an emergency fund of 3–6 months expenses.',
  },
  overspender: {
    label: 'Overspender',
    emoji: '🛑',
    color: '#9E2A2B',
    description: 'Your expenses frequently exceed your income. Time to review your budget.',
    tip: 'Try the 50/30/20 rule: needs / wants / savings.',
  },
  risky: {
    label: 'Risky',
    emoji: '📉',
    color: '#e74c3c',
    description: 'High volatility in your spending patterns. Inconsistent cash flow detected.',
    tip: 'Set spending limits per category and track weekly.',
  },
};

export const CHART_COLORS = [
  '#E09F3E', '#335C67', '#9b59b6', '#2980b9',
  '#27ae60', '#e74c3c', '#f39c12', '#16a085',
];
