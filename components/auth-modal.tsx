'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

/* ── Icons ── */
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconEye = ({ show }: { show: boolean }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const IconGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const IconSpinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ animation: 'authSpin 0.75s linear infinite', display: 'inline-block' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/* ── Shared Input ── */
function AuthInput({ icon, placeholder, type = 'text', value, onChange, disabled, rightSlot }: {
  icon: React.ReactNode; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void; disabled?: boolean; rightSlot?: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)',
      border: '1.5px solid rgba(108,99,255,0.13)', borderRadius: 14,
      padding: '0 14px', height: 48,
      opacity: disabled ? 0.6 : 1, transition: 'opacity 0.2s',
    }}>
      <span style={{ color: '#a0a3b1', flexShrink: 0 }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontSize: '0.875rem', color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)',
        }}
      />
      {rightSlot}
    </div>
  );
}

/* ── Social Button ── */
function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
      border: '1.5px solid rgba(108,99,255,0.13)', borderRadius: 12,
      padding: '10px 14px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
      color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)', transition: 'background 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.85)'; }}
      onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.6)'; }}
    >
      {icon}{label}
    </button>
  );
}

/* ── Divider ── */
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'rgba(108,99,255,0.13)' }} />
    <span style={{ fontSize: '0.73rem', color: '#a0a3b1', fontFamily: 'var(--font-sora,Sora,sans-serif)', whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
    <div style={{ flex: 1, height: 1, background: 'rgba(108,99,255,0.13)' }} />
  </div>
);

/* ── Error banner ── */
const ErrorBanner = ({ msg }: { msg: string }) => (
  <div style={{
    background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.25)',
    borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', color: '#c0334d',
    fontFamily: 'var(--font-sora,Sora,sans-serif)',
  }}>{msg}</div>
);

/* ── Sign-In Panel ── */
function SignInPanel({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Sign in failed.'); return; }
      onSuccess();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 2 }}>
        <h2 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 700, color: '#1a1a2e', fontFamily: 'var(--font-sora,Sora,sans-serif)', letterSpacing: '-0.02em' }}>Welcome Back</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: '#7b7fa8', fontFamily: 'var(--font-sora,Sora,sans-serif)' }}>Please enter your details to sign in</p>
      </div>

      {error && <ErrorBanner msg={error} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)', display: 'block', marginBottom: 5 }}>Email Address</label>
          <AuthInput icon={<IconMail />} placeholder="name@company.com" type="email" value={email} onChange={setEmail} disabled={loading} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)' }}>Password</label>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.76rem', color: '#FF6584', fontWeight: 600, fontFamily: 'var(--font-sora,Sora,sans-serif)', padding: 0 }}>Forgot Password?</button>
          </div>
          <AuthInput icon={<IconLock />} placeholder="••••••••" type={showPw ? 'text' : 'password'} value={password} onChange={setPassword} disabled={loading}
            rightSlot={<button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a3b1', padding: 0, display: 'flex', alignItems: 'center' }}><IconEye show={showPw} /></button>}
          />
        </div>
      </div>

      <button type="submit" disabled={loading} style={{
        width: '100%', height: 48, borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
        color: '#fff', fontFamily: 'var(--font-sora,Sora,sans-serif)', fontWeight: 700, fontSize: '0.95rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(108,99,255,0.35)', transition: 'opacity 0.2s',
        opacity: loading ? 0.7 : 1,
      }}>
        {loading ? <><IconSpinner /> Signing in…</> : 'Sign In →'}
      </button>

      <Divider />

      <div style={{ display: 'flex', gap: 10 }}>
        <SocialBtn icon={<IconGoogle />} label="Google" />
        <SocialBtn icon={<span style={{ color: '#1a1a2e' }}><IconGitHub /></span>} label="GitHub" />
      </div>

      <p style={{ textAlign: 'center', margin: 0, fontSize: '0.8rem', color: '#7b7fa8', fontFamily: 'var(--font-sora,Sora,sans-serif)' }}>
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C63FF', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-sora,Sora,sans-serif)', padding: 0 }}>
          Create an account
        </button>
      </p>
    </form>
  );
}

/* ── Sign-Up Panel ── */
function SignUpPanel({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Sign up failed.'); return; }
      onSuccess();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 2 }}>
        <h2 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 700, color: '#1a1a2e', fontFamily: 'var(--font-sora,Sora,sans-serif)', letterSpacing: '-0.02em' }}>Create Account</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: '#7b7fa8', fontFamily: 'var(--font-sora,Sora,sans-serif)' }}>Join our community and start your journey</p>
      </div>

      {error && <ErrorBanner msg={error} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)', display: 'block', marginBottom: 5 }}>Full Name</label>
          <AuthInput icon={<IconUser />} placeholder="John Doe" value={name} onChange={setName} disabled={loading} />
        </div>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)', display: 'block', marginBottom: 5 }}>Email</label>
          <AuthInput icon={<IconMail />} placeholder="name@example.com" type="email" value={email} onChange={setEmail} disabled={loading} />
        </div>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d3a', fontFamily: 'var(--font-sora,Sora,sans-serif)', display: 'block', marginBottom: 5 }}>Password</label>
          <AuthInput icon={<IconLock />} placeholder="Min. 8 characters" type={showPw ? 'text' : 'password'} value={password} onChange={setPassword} disabled={loading}
            rightSlot={<button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a3b1', padding: 0, display: 'flex', alignItems: 'center' }}><IconEye show={showPw} /></button>}
          />
        </div>
      </div>

      <button type="submit" disabled={loading} style={{
        width: '100%', height: 48, borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
        color: '#fff', fontFamily: 'var(--font-sora,Sora,sans-serif)', fontWeight: 700, fontSize: '0.95rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(108,99,255,0.35)', transition: 'opacity 0.2s',
        opacity: loading ? 0.7 : 1,
      }}>
        {loading ? <><IconSpinner /> Creating account…</> : 'Create Account'}
      </button>

      <p style={{ textAlign: 'center', margin: 0, fontSize: '0.8rem', color: '#7b7fa8', fontFamily: 'var(--font-sora,Sora,sans-serif)' }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C63FF', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-sora,Sora,sans-serif)', padding: 0 }}>
          Sign In
        </button>
      </p>

      <Divider />

      <div style={{ display: 'flex', gap: 10 }}>
        <SocialBtn icon={<IconGoogle />} label="Google" />
        <SocialBtn icon={<span style={{ color: '#1a1a2e' }}><IconGitHub /></span>} label="GitHub" />
      </div>
    </form>
  );
}

/* ── Auth Modal ── */
export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [panel, setPanel] = useState<'signin' | 'signup'>('signin');
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => { if (open) setPanel('signin'); }, [open]);

  if (!open) return null;

  const switchTo = (next: 'signin' | 'signup') => {
    if (sliding || panel === next) return;
    setDirection(next === 'signup' ? 'left' : 'right');
    setSliding(true);
    setTimeout(() => { setPanel(next); setSliding(false); }, 320);
  };

  const handleSuccess = () => {
    onClose();
    router.push('/dashboard');
  };

  const slideOut = direction === 'left' ? '-100%' : '100%';
  const slideIn  = direction === 'left' ? '100%'  : '-100%';

  return (
    <>
      <style>{`
        @keyframes authBackdropIn { from { opacity:0 } to { opacity:1 } }
        @keyframes authCardIn     { from { opacity:0; transform:scale(0.94) translateY(16px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes authSlideOut   { from { transform:translateX(0); opacity:1 } to { transform:translateX(var(--slide-out)); opacity:0 } }
        @keyframes authSlideIn    { from { transform:translateX(var(--slide-in)); opacity:0 } to { transform:translateX(0); opacity:1 } }
        @keyframes authSpin       { to { transform:rotate(360deg) } }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(30,24,60,0.45)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        animation: 'authBackdropIn 0.25s ease',
      }} />

      {/* Card */}
      <div onClick={e => e.stopPropagation()} style={{
        position: 'fixed', zIndex: 10001,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(420px, calc(100vw - 32px))',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1.5px solid rgba(255,255,255,0.9)',
        boxShadow: '0 24px 80px rgba(108,99,255,0.18), 0 2px 0 rgba(255,255,255,0.8) inset',
        animation: 'authCardIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>
        {/* Ambient blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,101,132,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 2,
          background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(108,99,255,0.12)',
          borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#7b7fa8', transition: 'background 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(255,255,255,1)'; }}
          onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.7)'; }}
        >
          <IconClose />
        </button>

        {/* Sliding viewport */}
        <div style={{ overflow: 'hidden' }}>
          <div key={panel} style={{
            padding: '44px 34px 32px',
            animation: sliding
              ? 'authSlideOut 0.32s cubic-bezier(0.4,0,0.6,1) forwards'
              : 'authSlideIn 0.32s cubic-bezier(0.4,0,0.2,1) forwards',
            ['--slide-out' as string]: slideOut,
            ['--slide-in' as string]: slideIn,
          }}>
            {panel === 'signin'
              ? <SignInPanel onSwitch={() => switchTo('signup')} onSuccess={handleSuccess} />
              : <SignUpPanel onSwitch={() => switchTo('signin')} onSuccess={handleSuccess} />
            }
          </div>
        </div>
      </div>
    </>
  );
}
