import { useState } from 'react';
import { X, DollarSign, Tag, FileText, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { CATEGORIES } from '../../../shared/constants.js';

const INITIAL = { type: 'expense', amount: '', category: 'food', note: '', date: '' };

export default function AddTransactionModal({ onClose, onAdd }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (!form.note.trim()) e.note = 'Add a note';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ ...form, amount: Number(form.amount), date: form.date || new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        style={{ maxWidth: '480px', margin: '0 auto' }}
      >
        <div
          className="rounded-t-3xl p-6"
          style={{
            background: 'linear-gradient(180deg, #1a3340 0%, #0f1e24 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
            boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Add Transaction</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all-smooth"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type toggle */}
            <div
              className="flex rounded-2xl p-1 gap-1"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all-smooth"
                  style={
                    form.type === t
                      ? {
                          background: t === 'expense'
                            ? 'linear-gradient(135deg, #9E2A2B, #c43536)'
                            : 'linear-gradient(135deg, #27ae60, #2ecc71)',
                          color: '#fff',
                        }
                      : { color: 'rgba(255,255,255,0.4)' }
                  }
                >
                  {t === 'expense'
                    ? <ArrowDownCircle size={16} />
                    : <ArrowUpCircle size={16} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium opacity-50 mb-1.5 block">Amount (₹)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-base font-semibold outline-none transition-all-smooth"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: errors.amount
                      ? '1px solid #9E2A2B'
                      : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#E09F3E';
                    e.target.style.boxShadow = '0 0 0 3px rgba(224,159,62,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.amount ? '#9E2A2B' : 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.amount && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.amount}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium opacity-50 mb-1.5 block">Category</label>
              <div
                className="relative"
              >
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 z-10 pointer-events-none" />
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none appearance-none transition-all-smooth"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#E09F3E';
                    e.target.style.boxShadow = '0 0 0 3px rgba(224,159,62,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: '#1a3340' }}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-medium opacity-50 mb-1.5 block">Note</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all-smooth"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: errors.note
                      ? '1px solid #9E2A2B'
                      : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#E09F3E';
                    e.target.style.boxShadow = '0 0 0 3px rgba(224,159,62,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.note ? '#9E2A2B' : 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.note && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.note}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-medium opacity-50 mb-1.5 block">Date (optional)</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all-smooth"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    colorScheme: 'dark',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#E09F3E';
                    e.target.style.boxShadow = '0 0 0 3px rgba(224,159,62,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all-smooth active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #c4872a, #E09F3E, #f0b85a)',
                color: '#0f1e24',
                boxShadow: '0 8px 24px rgba(224,159,62,0.35)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 32px rgba(224,159,62,0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(224,159,62,0.35)'}
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
