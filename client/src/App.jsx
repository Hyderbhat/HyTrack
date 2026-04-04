import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import AddTransactionModal from './components/AddTransactionModal.jsx';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Insights from './pages/Insights.jsx';
import Profile from './pages/Profile.jsx';
import AuthPage from './pages/Auth.jsx';
import { useTransactions } from './hooks/useTransactions.js';
import { useInsights } from './hooks/useInsights.js';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/*" element={<ProtectedRoute><ProtectedApp /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedApp() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { transactions, filtered, stats, categoryBreakdown, personality: fallbackPersonality, addTransaction, filter, setFilter, search, setSearch } = useTransactions(user);

  const { insights, alerts, weeklyChange, weeklyData, personality, markAlertRead, markAllAlertsRead } = useInsights(user, transactions, stats);

  const sharedProps = {
    user,
    transactions,
    stats,
    categoryBreakdown,
    insights,
    alerts,
    personality: personality || fallbackPersonality,
    onOpenProfile: () => navigate('/profile'),
    onMarkAlertRead: markAlertRead,
    onMarkAllAlertsRead: markAllAlertsRead,
  };

  return (
    <div className="relative mx-auto min-h-screen" style={{ maxWidth: '480px', background: '#0f1e24' }}>
      <Routes>
        <Route path="/" element={<Dashboard {...sharedProps} />} />
        <Route path="/transactions" element={<Transactions {...sharedProps} filtered={filtered} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />} />
        <Route path="/insights" element={<Insights {...sharedProps} weeklyChange={weeklyChange} weeklyData={weeklyData} />} />
        <Route path="/profile" element={<Profile {...sharedProps} onSignOut={logout} onUpdateProfile={updateProfile} onChangePassword={changePassword} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <BottomNav onAddClick={() => setModalOpen(true)} />

      {modalOpen && <AddTransactionModal onClose={() => setModalOpen(false)} onAdd={async (payload) => { await addTransaction(payload); setModalOpen(false); }} />}
    </div>
  );
}
