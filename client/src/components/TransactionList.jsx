import { getCategoryMeta } from '../utils/dummyData.js';
import { formatCurrency, getRelativeTime, groupByDate } from '../utils/formatters.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function TransactionList({ transactions, limit }) {
  const { currency } = useCurrency();
  const displayed = limit ? transactions.slice(0, limit) : transactions;
  const grouped   = groupByDate(displayed);

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 opacity-40">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {grouped.map(([date, txs]) => (
        <div key={date}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-2 px-1">
            {getRelativeTime(date)}
          </p>
          <div className="space-y-2">
            {txs.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={currency} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionRow({ tx, currency }) {
  const cat = getCategoryMeta(tx.category);
  const isIncome = tx.type === 'income';

  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-2xl transition-all-smooth cursor-pointer active:scale-[0.98]"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.borderColor = 'rgba(224,159,62,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Category icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}30` }}
      >
        {cat.icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate text-white">{tx.note}</p>
        <p className="text-xs opacity-40 mt-0.5">{cat.label}</p>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p
          className="text-sm font-bold"
          style={{ color: isIncome ? '#4ade80' : '#f87171' }}
        >
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
        </p>
      </div>
    </div>
  );
}
