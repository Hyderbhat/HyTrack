import { Bell, Settings, CheckCheck } from 'lucide-react';
import AlertCard from './AlertCard.jsx';
import { resolveAssetUrl } from '../utils/assets.js';

export default function Header({ title, showAvatar = true, user, alerts = [], onOpenProfile, onMarkAlertRead, onMarkAllAlertsRead }) {
  const initials = (user?.name || 'H').charAt(0).toUpperCase();
  const avatarUrl = resolveAssetUrl(user?.avatar_url || '');
  const unreadAlerts = alerts.filter((alert) => !alert.is_read);
  const unreadCount = unreadAlerts.length;
  const displayAlerts = alerts.slice(0, 4);

  return (
    <header className="relative px-4 pt-4 pb-3">
      <div className="flex items-center justify-between gap-3">
        {showAvatar ? (
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button type="button" onClick={onOpenProfile} className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-base font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c4872a, #E09F3E)', color: '#0f1e24' }}>
              {avatarUrl ? <img src={avatarUrl} alt={user?.name || 'User avatar'} className="w-full h-full object-cover" /> : initials}
            </button>
            <div className="min-w-0">
              <p className="text-[11px] opacity-40 leading-tight">Welcome back,</p>
              <p className="text-sm font-semibold text-white leading-tight truncate">{user?.name || 'Guest'}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-xl font-bold text-white">{title}</h1>
        )}

        <div className="flex items-center justify-center gap-1.5 flex-shrink-0 px-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px]" style={{ background: '#E09F3E', color: '#0f1e24' }}>HT</div>
          <span className="font-bold text-lg tracking-tight text-white">HyTrack</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <details className="relative group">
            <summary className="list-none w-10 h-10 rounded-xl flex items-center justify-center transition-all-smooth relative cursor-pointer" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Bell size={17} />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: '#9E2A2B', color: '#fff' }}>{unreadCount}</span>}
            </summary>
            <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] rounded-3xl p-4 z-40" style={{ background: 'rgba(15,30,36,0.98)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <p className="text-xs opacity-40">Budget and spending alerts</p>
                </div>
                <button type="button" className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: unreadCount ? '#E09F3E' : 'rgba(255,255,255,0.35)' }} onClick={() => unreadCount && onMarkAllAlertsRead?.()}>
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              </div>
              {displayAlerts.length > 0 ? (
                <div className="space-y-2">
                  {displayAlerts.map((alert, index) => (
                    <button key={alert.id || `${alert.title}-${index}`} type="button" className="w-full text-left" onClick={() => !alert.is_read && onMarkAlertRead?.(alert.id)}>
                      <AlertCard alert={alert} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl p-4 text-sm opacity-55" style={{ background: 'rgba(255,255,255,0.04)' }}>No notifications right now.</div>
              )}
            </div>
          </details>

          <button type="button" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all-smooth" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={onOpenProfile}>
            <Settings size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
