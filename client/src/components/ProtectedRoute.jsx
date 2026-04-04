import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <FullScreenState label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <FullScreenState label="Checking your session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function FullScreenState({ label }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'radial-gradient(circle at top, #23404a 0%, #0f1e24 55%)' }}
    >
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center font-bold text-lg"
          style={{ background: '#E09F3E', color: '#0f1e24', boxShadow: '0 12px 30px rgba(224,159,62,0.25)' }}
        >
          ht
        </div>
        <p className="text-sm text-white opacity-70">{label}</p>
      </div>
    </div>
  );
}
