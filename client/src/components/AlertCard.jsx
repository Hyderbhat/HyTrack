const TYPE_STYLES = {
  danger: { bg: 'rgba(158,42,43,0.2)', border: 'rgba(158,42,43,0.4)', dot: '#9E2A2B' },
  warning: { bg: 'rgba(224,159,62,0.15)', border: 'rgba(224,159,62,0.3)', dot: '#E09F3E' },
  info: { bg: 'rgba(51,92,103,0.3)', border: 'rgba(51,92,103,0.5)', dot: '#335C67' },
};

export default function AlertCard({ alert }) {
  const style = TYPE_STYLES[alert.type] || TYPE_STYLES.info;

  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl card-hover" style={{ background: style.bg, border: `1px solid ${style.border}`, opacity: alert.is_read ? 0.68 : 1 }}>
      <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: style.dot }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white leading-tight">{alert.title}</p>
          {alert.created_at && <span className="text-[10px] uppercase tracking-wide opacity-35 flex-shrink-0">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(alert.created_at))}</span>}
        </div>
        <p className="text-xs opacity-60 mt-1 leading-relaxed">{alert.desc || alert.message}</p>
      </div>
    </div>
  );
}
