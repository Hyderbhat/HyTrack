import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORIES, CHART_COLORS } from '../../../shared/constants.js';
import { formatCurrency } from '../utils/formatters.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

const CustomTooltip = ({ active, payload, currency }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div
      className="px-3 py-2 rounded-xl text-sm"
      style={{
        background: 'rgba(26,46,56,0.95)',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <p className="font-semibold" style={{ color: '#E09F3E' }}>{name}</p>
      <p className="text-white">{formatCurrency(value, currency)}</p>
    </div>
  );
};

export default function DonutChart({ data }) {
  const { currency } = useCurrency();
  const chartData = data.map((item) => {
    const cat = CATEGORIES.find((c) => c.id === item.id);
    return {
      name: cat?.label || item.id,
      value: item.value,
      color: cat?.color || CHART_COLORS[0],
      icon: cat?.icon || '📦',
    };
  }).slice(0, 6);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      {/* Chart */}
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs opacity-40">Total spend</p>
          <p className="text-base font-bold" style={{ color: '#FFF3B0' }}>
            {formatCurrency(total, currency)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-xs opacity-60 truncate">{item.icon} {item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
