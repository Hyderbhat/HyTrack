import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function BalanceCard({ stats }) {
  const { currency } = useCurrency();
  const { balance, income, expense, savingsRate } = stats;
  const isPositive = balance >= 0;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 card-hover"
      style={{
        background: 'linear-gradient(135deg, #1a2f36 0%, #335c67 50%, #2a4d57 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #E09F3E, transparent)' }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #FFF3B0, transparent)' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <p className="text-sm font-medium opacity-60 tracking-wide uppercase mb-1">
            Total Balance
          </p>
          <div className="animate-count-up">
            <h2
              className="text-4xl font-bold tracking-tight"
              style={{ color: isPositive ? '#FFF3B0' : '#9E2A2B' }}
            >
              {formatCurrency(balance, currency)}
            </h2>
          </div>
          <p className="text-xs mt-1 opacity-50">
            Savings rate:{' '}
            <span style={{ color: '#E09F3E' }} className="font-semibold">
              {formatPercent(savingsRate)}
            </span>
          </p>
        </div>
        <div
          className="p-3 rounded-2xl"
          style={{ background: 'rgba(224,159,62,0.2)', border: '1px solid rgba(224,159,62,0.3)' }}
        >
          <Wallet size={22} style={{ color: '#E09F3E' }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        <StatPill
          label="Income"
          value={income}
          currency={currency}
          Icon={TrendingUp}
          color="#4ade80"
          bg="rgba(74,222,128,0.12)"
          border="rgba(74,222,128,0.2)"
        />
        <StatPill
          label="Expenses"
          value={expense}
          currency={currency}
          Icon={TrendingDown}
          color="#f87171"
          bg="rgba(248,113,113,0.12)"
          border="rgba(248,113,113,0.2)"
        />
      </div>

      {/* Gold accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #E09F3E, transparent)' }}
      />
    </div>
  );
}

function StatPill({ label, value, currency, Icon, color, bg, border }) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-2xl"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <Icon size={16} style={{ color }} />
      <div>
        <p className="text-xs opacity-60">{label}</p>
        <p className="text-sm font-semibold" style={{ color }}>
          {formatCurrency(value, currency)}
        </p>
      </div>
    </div>
  );
}
