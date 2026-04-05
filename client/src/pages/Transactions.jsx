import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Header from '../components/Header.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { CATEGORIES } from '../../../shared/constants.js';
import { formatCurrency } from '../utils/formatters.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
];

export default function Transactions({ user, alerts, onOpenProfile, filtered, filter, setFilter, search, setSearch, stats }) {
  const { currency } = useCurrency();
  const [showCatFilter, setShowCatFilter] = useState(false);

  return (
    <div className="min-h-screen pb-safe">
      <Header title="Transactions" showAvatar={false} user={user} alerts={alerts} onOpenProfile={onOpenProfile} />

      <main className="px-4 pb-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <SummaryPill label="Total Income" amount={stats.income} currency={currency} color="#4ade80" bg="rgba(74,222,128,0.08)" />
          <SummaryPill label="Total Expense" amount={stats.expense} currency={currency} color="#f87171" bg="rgba(248,113,113,0.08)" />
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all-smooth"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"><X size={15} /></button>}
        </div>

        <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {TYPE_FILTERS.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter((prev) => ({ ...prev, type: item.value }))}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all-smooth"
              style={filter.type === item.value ? { background: '#E09F3E', color: '#0f1e24' } : { color: 'rgba(255,255,255,0.4)' }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <button onClick={() => setShowCatFilter((prev) => !prev)} className="flex items-center gap-2 text-xs transition-all-smooth" style={{ color: showCatFilter ? '#E09F3E' : 'rgba(255,255,255,0.5)' }}>
            <Filter size={13} />
            {filter.category ? `Category: ${CATEGORIES.find((c) => c.id === filter.category)?.label}` : 'Filter by category'}
          </button>
          {showCatFilter && (
            <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
              <Chip label="All" active={!filter.category} onClick={() => setFilter((prev) => ({ ...prev, category: '' }))} />
              {CATEGORIES.map((category) => (
                <Chip
                  key={category.id}
                  label={`${category.icon} ${category.label}`}
                  active={filter.category === category.id}
                  color={category.color}
                  onClick={() => setFilter((prev) => ({ ...prev, category: prev.category === category.id ? '' : category.id }))}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs opacity-30 px-1">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>

        <div className="rounded-3xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <TransactionList transactions={filtered} />
        </div>
      </main>
    </div>
  );
}

function SummaryPill({ label, amount, currency, color, bg }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: bg, border: `1px solid ${color}20` }}>
      <p className="text-xs opacity-50">{label}</p>
      <p className="text-base font-bold mt-1" style={{ color }}>{formatCurrency(amount, currency)}</p>
    </div>
  );
}

function Chip({ label, active, onClick, color }) {
  return <button onClick={onClick} className="px-3 py-1 rounded-full text-xs font-medium transition-all-smooth" style={active ? { background: color || '#E09F3E', color: '#0f1e24' } : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>{label}</button>;
}
