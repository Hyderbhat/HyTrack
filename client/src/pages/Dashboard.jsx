import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header.jsx';
import BalanceCard from '../components/BalanceCard.jsx';
import TransactionList from '../components/TransactionList.jsx';
import DonutChart from '../components/DonutChart.jsx';
import InsightCard from '../components/InsightCard.jsx';
import AlertCard from '../components/AlertCard.jsx';

export default function Dashboard({ user, transactions, stats, categoryBreakdown, insights, alerts, onOpenProfile }) {
  return (
    <div className="min-h-screen pb-safe">
      <Header showAvatar user={user} alerts={alerts} onOpenProfile={onOpenProfile} />

      <main className="px-4 pb-6 space-y-5">
        <BalanceCard stats={stats} />

        <div className="grid grid-cols-2 gap-3">
          <QuickStat label="This Month" value={`${transactions.filter((t) => t.type === 'expense').length} expenses`} icon="Stats" />
          <QuickStat label="Avg/Day" value={`INR ${Math.round(stats.expense / 30).toLocaleString('en-IN')}`} icon="Daily" />
        </div>

        <Section title="Spending Breakdown" icon="Breakdown" link="/insights">
          {categoryBreakdown.length > 0 ? <DonutChart data={categoryBreakdown} /> : <p className="text-sm text-center opacity-40 py-8">No expenses yet</p>}
        </Section>

        {alerts.length > 0 && (
          <Section title="Smart Alerts" icon="Alerts" link="/insights">
            <div className="space-y-2">
              {alerts.slice(0, 2).map((alert, index) => <AlertCard key={alert.id || `${alert.title}-${index}`} alert={alert} />)}
            </div>
          </Section>
        )}

        <Section title="AI Insights" icon="Insights" link="/insights">
          <div className="space-y-2">
            {insights.slice(0, 2).map((insight, index) => <InsightCard key={insight.id || `${insight.tag}-${index}`} insight={insight} />)}
          </div>
        </Section>

        <Section title="Recent Transactions" icon="Recent" link="/transactions">
          <TransactionList transactions={transactions} limit={5} />
        </Section>
      </main>
    </div>
  );
}

function Section({ title, icon, link, children }) {
  return (
    <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide opacity-40">{icon}</span>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        {link && <Link to={link} className="flex items-center gap-1 text-xs transition-all-smooth" style={{ color: '#E09F3E' }}>See all <ArrowRight size={12} /></Link>}
      </div>
      {children}
    </div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="text-xs uppercase tracking-wide opacity-40">{icon}</span>
      <p className="text-xs opacity-40 mt-2">{label}</p>
      <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
    </div>
  );
}
