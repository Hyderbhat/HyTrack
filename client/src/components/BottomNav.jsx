import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Sparkles, Bell, User, Plus } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/',             icon: LayoutDashboard, label: 'Home'    },
  { path: '/transactions', icon: ArrowLeftRight,  label: 'History' },
  { path: null,            icon: Plus,            label: 'Add',     isAction: true },
  { path: '/insights',     icon: Sparkles,        label: 'Insights' },
  { path: '/profile',      icon: User,            label: 'Profile'  },
];

export default function BottomNav({ onAddClick }) {
  const location = useLocation();
  const navigate  = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-3 py-2"
      style={{
        background: 'rgba(15,30,36,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {NAV_ITEMS.map((item, i) => {
        if (item.isAction) {
          return (
            <button
              key={i}
              id="fab-add-btn"
              onClick={onAddClick}
              className="relative flex items-center justify-center w-14 h-14 rounded-full transition-all-smooth active:scale-90 pulse-ring"
              style={{
                background: 'linear-gradient(135deg, #c4872a, #E09F3E)',
                boxShadow: '0 8px 24px rgba(224,159,62,0.4)',
                marginTop: '-24px',
              }}
            >
              <Plus size={24} color="#0f1e24" strokeWidth={2.5} />
            </button>
          );
        }

        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all-smooth"
            style={{ minWidth: 48 }}
          >
            <div className="relative">
              <Icon
                size={22}
                style={{ color: isActive ? '#E09F3E' : 'rgba(255,255,255,0.35)' }}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              {isActive && (
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#E09F3E' }}
                />
              )}
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: isActive ? '#E09F3E' : 'rgba(255,255,255,0.35)' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
