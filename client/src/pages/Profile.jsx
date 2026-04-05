import { useEffect, useRef, useState } from 'react';
import {
  User, Mail, Calendar, Target, Shield,
  ChevronRight, LogOut, Bell, Moon, PencilLine, Save, ImagePlus, LockKeyhole, Eye, EyeOff,
} from 'lucide-react';
import Header from '../components/Header.jsx';
import PersonalityCard from '../components/PersonalityCard.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { resolveAssetUrl } from '../utils/assets.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

const SETTINGS = [
  { icon: Bell, label: 'Notifications', desc: 'Alerts & reminders' },
  { icon: Target, label: 'Budget Goals', desc: 'Monthly spending limits' },
  { icon: Moon, label: 'Appearance', desc: 'Theme & display' },
  { icon: Shield, label: 'Privacy', desc: 'Security settings' },
];

export default function Profile({ user, alerts = [], onOpenProfile, onMarkAlertRead, onMarkAllAlertsRead, stats, personality, onSignOut, onUpdateProfile, onChangePassword }) {
  const { currency, setCurrency, currencyOptions } = useCurrency();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', budget: String(user?.budget || 0), currency: user?.currency || currency, avatarUrl: user?.avatar_url || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setForm({ name: user?.name || '', budget: String(user?.budget || 0), currency: user?.currency || currency, avatarUrl: user?.avatar_url || '' });
  }, [currency, user?.avatar_url, user?.budget, user?.currency, user?.name]);

  const joinedLabel = user?.created_at ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(user.created_at)) : 'Recently';
  const currentBudget = Number(user?.budget || 0);
  const currentAvatar = resolveAssetUrl(form.avatarUrl || user?.avatar_url || '');

  const handleAvatarPick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: String(reader.result || '') }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setMessage('');
    setError('');
    if (!form.name.trim()) return setError('Name is required');

    const parsedBudget = Number(form.budget);
    if (Number.isNaN(parsedBudget) || parsedBudget < 0) return setError('Budget must be zero or greater');

    setSaving(true);
    try {
      await onUpdateProfile({ name: form.name.trim(), budget: parsedBudget, currency: form.currency, avatarUrl: form.avatarUrl });
      setCurrency(form.currency);
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordMessage('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword) return setPasswordError('Both password fields are required');

    setChangingPassword(true);
    try {
      const response = await onChangePassword(passwordForm);
      setPasswordMessage(response.message || 'Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (changeError) {
      setPasswordError(changeError.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen pb-safe">
      <Header title="Profile" showAvatar={false} user={user} alerts={alerts} onOpenProfile={onOpenProfile} onMarkAlertRead={onMarkAlertRead} onMarkAllAlertsRead={onMarkAllAlertsRead} />

      <main className="px-4 pb-6 space-y-5">
        <div className="rounded-3xl p-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a42 0%, #335c67 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #E09F3E, transparent)' }} />

          <div className="relative w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #c4872a, #E09F3E)', color: '#0f1e24', boxShadow: '0 8px 24px rgba(224,159,62,0.4)' }}>
            {currentAvatar ? <img src={currentAvatar} alt={user?.name || 'User avatar'} className="w-full h-full object-cover" /> : (user?.name || 'H').charAt(0).toUpperCase()}
            {editing && <button type="button" className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(15,30,36,0.85)', color: '#fff' }} onClick={() => fileInputRef.current?.click()}><ImagePlus size={14} /></button>}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />

          <h2 className="text-xl font-bold text-white">{user?.name || 'HyTrack User'}</h2>
          <p className="text-xs opacity-40 mt-1">{user?.email || 'No email available'}</p>

          <div className="flex items-center justify-center gap-1 mt-2">
            <Calendar size={11} className="opacity-30" />
            <span className="text-xs opacity-30">Member since {joinedLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Balance" value={formatCurrency(stats.balance, currency)} color="#FFF3B0" />
          <StatCard label="Income" value={formatCurrency(stats.income, currency)} color="#4ade80" />
          <StatCard label="Expense" value={formatCurrency(stats.expense, currency)} color="#f87171" />
        </div>

        <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Target size={16} style={{ color: '#E09F3E' }} /><h3 className="text-sm font-semibold text-white">Monthly Budget</h3></div><span className="text-xs font-bold" style={{ color: '#E09F3E' }}>{formatCurrency(currentBudget, currency)}</span></div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}><div className="h-full rounded-full" style={{ width: `${Math.min(100, (stats.expense / Math.max(currentBudget || 1, 1)) * 100)}%`, background: stats.expense > currentBudget ? 'linear-gradient(90deg, #9E2A2B, #c43536)' : 'linear-gradient(90deg, #c4872a, #E09F3E)', transition: 'width 1s ease' }} /></div>
          <div className="flex justify-between mt-2"><p className="text-xs opacity-40">Spent: {formatCurrency(stats.expense, currency)}</p><p className="text-xs font-medium" style={{ color: stats.expense > currentBudget ? '#f87171' : 'rgba(255,255,255,0.4)' }}>{stats.expense > currentBudget ? 'Over budget!' : `${formatCurrency(currentBudget - stats.expense, currency)} left`}</p></div>
        </div>

        <PersonalityCard type={personality} />

        <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4"><div><p className="text-xs font-semibold uppercase tracking-widest opacity-30">Profile Settings</p><h3 className="text-sm font-semibold text-white mt-1">Manage your account details</h3></div><button type="button" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.25)', color: '#E09F3E' }} onClick={() => { setEditing((prev) => !prev); setError(''); setMessage(''); }}><PencilLine size={14} />{editing ? 'Close' : 'Edit'}</button></div>
          <div className="space-y-4">
            <Field icon={User} label="Name" value={form.name} disabled={!editing || saving} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
            <Field icon={Mail} label="Email" value={user?.email || ''} disabled />
            <Field icon={Target} label="Monthly budget" type="number" value={form.budget} disabled={!editing || saving} onChange={(value) => setForm((prev) => ({ ...prev, budget: value }))} />
            <SelectField icon={Target} label="Currency" value={form.currency} disabled={!editing || saving} options={currencyOptions} onChange={(value) => { setForm((prev) => ({ ...prev, currency: value })); setCurrency(value); }} />
            <Field icon={ImagePlus} label="Avatar image URL" value={form.avatarUrl} disabled={!editing || saving} onChange={(value) => setForm((prev) => ({ ...prev, avatarUrl: value }))} placeholder="Paste an image URL or upload above" />
          </div>
          {message && <p className="text-xs mt-4" style={{ color: '#86efac' }}>{message}</p>}
          {error && <p className="text-xs mt-4" style={{ color: '#fca5a5' }}>{error}</p>}
          {editing && <button type="button" className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #c4872a, #E09F3E)', color: '#0f1e24' }} onClick={handleSave} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Changes'}</button>}
        </div>

        <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-30 mb-4">Security</p>
          <div className="space-y-4">
            <PasswordField icon={LockKeyhole} label="Current password" value={passwordForm.currentPassword} onChange={(value) => setPasswordForm((prev) => ({ ...prev, currentPassword: value }))} placeholder="Enter current password" visible={showCurrentPassword} onToggle={() => setShowCurrentPassword((prev) => !prev)} />
            <PasswordField icon={LockKeyhole} label="New password" value={passwordForm.newPassword} onChange={(value) => setPasswordForm((prev) => ({ ...prev, newPassword: value }))} placeholder="8+ chars, uppercase, lowercase, number" visible={showNewPassword} onToggle={() => setShowNewPassword((prev) => !prev)} />
          </div>
          {passwordMessage && <p className="text-xs mt-4" style={{ color: '#86efac' }}>{passwordMessage}</p>}
          {passwordError && <p className="text-xs mt-4" style={{ color: '#fca5a5' }}>{passwordError}</p>}
          <button type="button" className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(224,159,62,0.14)', border: '1px solid rgba(224,159,62,0.24)', color: '#f6d38d' }} onClick={handlePasswordChange} disabled={changingPassword}><LockKeyhole size={16} />{changingPassword ? 'Updating...' : 'Change Password'}</button>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-30 px-5 pt-4 pb-2">Settings</p>
          <div className="px-5 pb-2">
            <div className="flex items-center gap-3 py-3 text-left"><div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.15)' }}><User size={16} style={{ color: '#E09F3E' }} /></div><div className="flex-1"><p className="text-sm font-medium text-white">Account</p><p className="text-xs opacity-35">Authenticated with your personal login</p></div></div>
            <div className="h-px opacity-10" style={{ background: '#fff' }} />
            <div className="flex items-center gap-3 py-3 text-left"><div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.15)' }}><Mail size={16} style={{ color: '#E09F3E' }} /></div><div className="flex-1"><p className="text-sm font-medium text-white">Email</p><p className="text-xs opacity-35">{user?.email || 'Not available'}</p></div></div>
          </div>
          {SETTINGS.map((setting, index) => <SettingRow key={setting.label} {...setting} isLast={index === SETTINGS.length - 1} />)}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium transition-all-smooth" style={{ background: 'rgba(158,42,43,0.15)', border: '1px solid rgba(158,42,43,0.3)', color: '#f87171' }} onClick={onSignOut}><LogOut size={16} />Sign Out</button>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return <div className="p-3 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}><p className="text-xs opacity-40 mb-1">{label}</p><p className="text-xs font-bold leading-tight" style={{ color }}>{value}</p></div>;
}

function Field({ icon: Icon, onChange = () => {}, disabled = false, label, ...props }) {
  return <label className="block"><span className="text-xs uppercase tracking-wide opacity-40">{label}</span><div className="relative mt-2"><Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" /><input {...props} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white outline-none disabled:opacity-60" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} /></div></label>;
}

function SelectField({ icon: Icon, onChange = () => {}, disabled = false, label, value, options = [] }) {
  return <label className="block"><span className="text-xs uppercase tracking-wide opacity-40">{label}</span><div className="relative mt-2"><Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" /><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white outline-none disabled:opacity-60" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{options.map((item) => <option key={item.code} value={item.code} style={{ background: '#1a3340' }}>{item.label}</option>)}</select></div></label>;
}

function PasswordField({ icon: Icon, onChange = () => {}, label, visible, onToggle, ...props }) {
  return <label className="block"><span className="text-xs uppercase tracking-wide opacity-40">{label}</span><div className="relative mt-2"><Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" /><input {...props} type={visible ? 'text' : 'password'} onChange={(event) => onChange(event.target.value)} className="w-full pl-10 pr-11 py-3 rounded-2xl text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} /><button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-55 hover:opacity-85">{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>;
}

function SettingRow({ icon: Icon, label, desc, isLast }) {
  return <button className="w-full flex items-center gap-3 px-5 py-3.5 transition-all-smooth text-left" style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}><div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.15)' }}><Icon size={16} style={{ color: '#E09F3E' }} /></div><div className="flex-1"><p className="text-sm font-medium text-white">{label}</p><p className="text-xs opacity-35">{desc}</p></div><ChevronRight size={15} className="opacity-30" /></button>;
}
