export default function InsightCard({ insight }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl card-hover"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(224,159,62,0.15)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.2)' }}
      >
        {insight.icon}
      </div>
      <div className="flex-1 min-w-0">
        <span
          className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1"
          style={{ background: 'rgba(224,159,62,0.15)', color: '#E09F3E' }}
        >
          {insight.tag}
        </span>
        <p className="text-sm leading-relaxed opacity-80">{insight.message}</p>
      </div>
    </div>
  );
}
