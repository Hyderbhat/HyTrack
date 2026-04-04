import { PERSONALITIES } from '../../../shared/constants.js';

export default function PersonalityCard({ type }) {
  const p = PERSONALITIES[type] || PERSONALITIES.balanced;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 card-hover"
      style={{
        background: `linear-gradient(135deg, ${p.color}20 0%, ${p.color}08 100%)`,
        border: `1px solid ${p.color}30`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ background: p.color }}
      />

      <div className="relative z-10">
        {/* Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${p.color}25`, border: `1px solid ${p.color}35` }}
          >
            {p.emoji}
          </div>
          <div>
            <p className="text-xs opacity-50 uppercase tracking-wide">Spending Personality</p>
            <h3
              className="text-xl font-bold"
              style={{ color: p.color }}
            >
              {p.label}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed opacity-70 mb-4">{p.description}</p>

        {/* Tip */}
        <div
          className="flex items-start gap-2 p-3 rounded-xl"
          style={{ background: `${p.color}12`, border: `1px solid ${p.color}20` }}
        >
          <span className="text-sm">💡</span>
          <p className="text-xs opacity-60 leading-relaxed">{p.tip}</p>
        </div>
      </div>
    </div>
  );
}
