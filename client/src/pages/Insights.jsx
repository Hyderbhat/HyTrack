import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Header from '../components/Header.jsx';
import InsightCard from '../components/InsightCard.jsx';
import AlertCard from '../components/AlertCard.jsx';
import PersonalityCard from '../components/PersonalityCard.jsx';
import { formatCurrency, formatPercent } from '../utils/formatters.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(26,46,56,0.95)', border: '1px solid rgba(255,255,255,0.15)' }}>
      <p className="font-semibold mb-1 opacity-60">{label}</p>
      {payload.map((entry) => <p key={entry.dataKey} style={{ color: entry.color }}>{entry.dataKey === 'income' ? 'Income' : 'Expense'}: {formatCurrency(entry.value)}</p>)}
    </div>
  );
};

export default function Insights({ user, alerts, onOpenProfile, insights, weeklyChange, weeklyData, stats, personality }) {
  const isUp = weeklyChange.pct > 0;

  return (
    <div className="min-h-screen pb-safe">
      <Header title="Insights" showAvatar={false} user={user} alerts={alerts} onOpenProfile={onOpenProfile} />

      <main className="px-4 pb-6 space-y-5">
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: isUp ? 'linear-gradient(135deg, rgba(158,42,43,0.25), rgba(158,42,43,0.1))' : 'linear-gradient(135deg, rgba(39,174,96,0.25), rgba(39,174,96,0.1))', border: `1px solid ${isUp ? 'rgba(158,42,43,0.3)' : 'rgba(39,174,96,0.3)'}` }}>
          <span className="text-xs uppercase tracking-wide opacity-60">Weekly</span>
          <div>
            <p className="text-sm font-semibold text-white">{isUp ? 'Spending Up' : 'Spending Down'} {formatPercent(weeklyChange.pct)} this week</p>
            <p className="text-xs opacity-50 mt-0.5">This week: {formatCurrency(weeklyChange.thisWeek)} vs last week: {formatCurrency(weeklyChange.lastWeek)}</p>
          </div>
        </div>

        <Section title="Weekly Overview" icon="Chart">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="income" fill="#27ae60" radius={[6, 6, 0, 0]} maxBarSize={20} />
                <Bar dataKey="expense" fill="#E09F3E" radius={[6, 6, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            <Legend label="Income" color="#27ae60" />
            <Legend label="Expense" color="#E09F3E" />
          </div>
        </Section>

        {alerts.length > 0 && <Section title="Smart Alerts" icon="Alerts"><div className="space-y-2">{alerts.map((alert, index) => <AlertCard key={alert.id || `${alert.title}-${index}`} alert={alert} />)}</div></Section>}

        <Section title="AI Insights" icon="Signals"><div className="space-y-2">{insights.map((insight, index) => <InsightCard key={insight.id || `${insight.tag}-${index}`} insight={insight} />)}</div></Section>

        <Section title="Savings Rate" icon="Savings">
          <div className="space-y-2">
            <div className="flex justify-between text-xs opacity-60">
              <span>Current rate</span>
              <span className="font-bold" style={{ color: '#E09F3E' }}>{formatPercent(stats.savingsRate)}</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, stats.savingsRate))}%`, background: 'linear-gradient(90deg, #c4872a, #E09F3E)', transition: 'width 1s ease' }} />
            </div>
            <div className="flex justify-between text-xs opacity-30"><span>0%</span><span>50%</span><span>100%</span></div>
          </div>
        </Section>

        <PersonalityCard type={personality} />
      </main>
    </div>
  );
}

function Section({ title, icon, children }) {
  return <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}><div className="flex items-center gap-2 mb-4"><span className="text-xs uppercase tracking-wide opacity-40">{icon}</span><h3 className="text-sm font-semibold text-white">{title}</h3></div>{children}</div>;
}

function Legend({ label, color }) {
  return <div className="flex items-center gap-2 text-xs opacity-60"><span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />{label}</div>;
}
