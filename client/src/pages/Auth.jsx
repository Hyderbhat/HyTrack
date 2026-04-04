import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  budget: '50000',
};

function validateSignup(form) {
  if (!form.name.trim()) return 'Full name is required';
  if (!form.email.trim()) return 'Email is required';
  if (!form.password) return 'Password is required';
  if (form.password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(form.password)) return 'Password must include an uppercase letter';
  if (!/[a-z]/.test(form.password)) return 'Password must include a lowercase letter';
  if (!/\d/.test(form.password)) return 'Password must include a number';
  if (form.password !== form.confirmPassword) return 'Passwords do not match';
  if ((Number(form.budget) || 0) < 0) return 'Budget must be zero or greater';
  return '';
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signup } = useAuth();

  const title = mode === 'login' ? 'Welcome back' : 'Create your account';
  const subtitle = mode === 'login'
    ? 'Sign in to see your transactions, insights, and profile.'
    : 'Start tracking with your own protected account and private data.';

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        if (!form.email.trim() || !form.password) throw new Error('Email and password are required');
        await login({ email: form.email, password: form.password });
      } else {
        const validationError = validateSignup(form);
        if (validationError) throw new Error(validationError);
        await signup({ name: form.name, email: form.email, password: form.password, budget: Number(form.budget) || 0 });
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center" style={{ background: 'radial-gradient(circle at top, #23404a 0%, #0f1e24 58%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center font-bold text-xl" style={{ background: 'linear-gradient(135deg, #c4872a, #E09F3E)', color: '#0f1e24' }}>HT</div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-sm mt-2 opacity-60">{subtitle}</p>
        </div>

        <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <ModeButton active={mode === 'login'} onClick={() => switchMode('login')}>Sign In</ModeButton>
            <ModeButton active={mode === 'signup'} onClick={() => switchMode('signup')}>Sign Up</ModeButton>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && <Field icon={UserRound} label="Full name" value={form.name} onChange={(value) => updateField('name', value)} placeholder="Your name" autoComplete="name" />}

            <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} placeholder="you@example.com" autoComplete="email" />

            <PasswordField icon={LockKeyhole} label="Password" value={form.password} onChange={(value) => updateField('password', value)} placeholder={mode === 'login' ? 'Enter your password' : '8+ chars, uppercase, lowercase, number'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />

            {mode === 'signup' && (
              <>
                <PasswordField icon={LockKeyhole} label="Confirm password" value={form.confirmPassword} onChange={(value) => updateField('confirmPassword', value)} placeholder="Repeat your password" autoComplete="new-password" visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((prev) => !prev)} />
                <Field icon={Wallet} label="Monthly budget" type="number" value={form.budget} onChange={(value) => updateField('budget', value)} placeholder="50000" min="0" step="100" />
                <p className="text-xs opacity-45 px-1">Passwords must include uppercase, lowercase, and a number.</p>
              </>
            )}

            {error && <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: 'rgba(158,42,43,0.16)', border: '1px solid rgba(248,113,113,0.35)', color: '#fecaca' }}>{error}</div>}

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all-smooth disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #c4872a, #E09F3E)', color: '#0f1e24' }}>
              {submitting ? 'Working...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, children }) {
  return <button type="button" onClick={onClick} className="py-2.5 rounded-xl text-sm font-semibold transition-all-smooth" style={active ? { background: '#E09F3E', color: '#0f1e24' } : { color: 'rgba(255,255,255,0.55)' }}>{children}</button>;
}

function Field({ icon: Icon, label, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide opacity-40">{label}</span>
      <div className="relative mt-2">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
        <input {...props} onChange={(event) => onChange(event.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
      </div>
    </label>
  );
}

function PasswordField({ icon: Icon, label, onChange, visible, onToggle, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide opacity-40">{label}</span>
      <div className="relative mt-2">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
        <input {...props} type={visible ? 'text' : 'password'} onChange={(event) => onChange(event.target.value)} className="w-full pl-10 pr-11 py-3 rounded-2xl text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-55 hover:opacity-85">
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
