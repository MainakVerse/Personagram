'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { User } from '@/lib/queries/auth';

const PLAN_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  free:    { bg: 'rgba(108,99,255,0.1)',   color: '#6C63FF', label: 'Free'    },
  creator: { bg: 'rgba(0,191,166,0.1)',    color: '#00BFA6', label: 'Creator' },
  pro:     { bg: 'rgba(255,149,0,0.12)',   color: '#FF9500', label: 'Pro'     },
};

const STAT_CARDS = [
  { label: 'Prompts Published', value: '0',   icon: '✍️', grad: 'linear-gradient(135deg,#6C63FF,#9B94FF)' },
  { label: 'Total Sales',       value: '$0',  icon: '💸', grad: 'linear-gradient(135deg,#00BFA6,#00D4B8)' },
  { label: 'Followers',         value: '0',   icon: '👥', grad: 'linear-gradient(135deg,#FF6584,#FF8FA3)' },
  { label: 'Leaderboard Rank',  value: '–',   icon: '🏆', grad: 'linear-gradient(135deg,#FF9500,#FFBE59)' },
];

const QUICK_LINKS = [
  { icon: '🛍️', label: 'Browse Marketplace', desc: 'Discover top prompts from creators worldwide.' },
  { icon: '✍️', label: 'Publish a Prompt',   desc: 'Share your best work and start earning.'       },
  { icon: '🧪', label: 'AI Playground',       desc: 'Test any prompt live in your browser.'         },
  { icon: '📊', label: 'View Analytics',      desc: 'Track sales, views, and follower growth.'      },
];

export default function DashboardClient({ user }: { user: User }) {
  const router = useRouter();
  const plan = PLAN_COLORS[user.plan] ?? PLAN_COLORS.free;
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0efff 0%,#f7f9fc 50%,#fff0f5 100%)', fontFamily: 'var(--font-sora,Sora,sans-serif)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108,99,255,0.1)',
        padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Image src="/favicon.png" alt="Personagram" width={28} height={28} style={{ borderRadius: 8 }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>Personagram</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Plan badge */}
          <div style={{
            padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
            background: plan.bg, color: plan.color,
          }}>
            {plan.label} Plan
          </div>

          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6C63FF,#FF6584)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.78rem', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>

          <button onClick={handleSignOut} style={{
            padding: '7px 16px', borderRadius: 100, border: '1.5px solid rgba(108,99,255,0.2)',
            background: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            color: '#6C63FF', fontFamily: 'var(--font-sora,Sora,sans-serif)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget).style.background = '#6C63FF'; (e.currentTarget).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.8)'; (e.currentTarget).style.color = '#6C63FF'; }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── Welcome hero ── */}
        <div style={{
          background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: 28,
          boxShadow: '0 8px 40px rgba(108,99,255,0.12)',
          padding: '36px 40px', marginBottom: 28, position: 'relative', overflow: 'hidden',
        }}>
          {/* Blobs */}
          <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,191,166,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Big avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg,#6C63FF,#FF6584)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: '#fff', flexShrink: 0,
              boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
            }}>
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>
                  Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: plan.bg, color: plan.color }}>
                  ✦ {plan.label}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7b7fa8' }}>
                {user.email} · Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <button style={{
              padding: '11px 24px', borderRadius: 100, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: 'linear-gradient(135deg,#6C63FF,#8B84FF)', color: '#fff',
              fontFamily: 'var(--font-sora,Sora,sans-serif)', fontWeight: 700, fontSize: '0.88rem',
              boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
            }}>
              + Publish Prompt
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 16, marginBottom: 28 }}>
          {STAT_CARDS.map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: 20,
              boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
              padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                boxShadow: '0 4px 12px rgba(108,99,255,0.2)',
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#7b7fa8', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main two-col ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

          {/* Quick links */}
          <div style={{
            background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: 24,
            boxShadow: '0 4px 20px rgba(108,99,255,0.08)', padding: '28px',
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700, color: '#1a1a2e' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {QUICK_LINKS.map(q => (
                <button key={q.label} style={{
                  background: 'rgba(108,99,255,0.04)', border: '1.5px solid rgba(108,99,255,0.1)',
                  borderRadius: 16, padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', fontFamily: 'var(--font-sora,Sora,sans-serif)',
                }}
                  onMouseEnter={e => { const b = e.currentTarget; b.style.background = 'rgba(108,99,255,0.08)'; b.style.borderColor = 'rgba(108,99,255,0.25)'; b.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'rgba(108,99,255,0.04)'; b.style.borderColor = 'rgba(108,99,255,0.1)'; b.style.transform = ''; }}
                >
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{q.icon}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{q.label}</div>
                  <div style={{ fontSize: '0.76rem', color: '#7b7fa8', lineHeight: 1.4 }}>{q.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Side panel: account info + upgrade */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Account details card */}
            <div style={{
              background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: 24,
              boxShadow: '0 4px 20px rgba(108,99,255,0.08)', padding: '24px',
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e' }}>Account Details</h2>
              {[
                { label: 'Name',   value: user.name  },
                { label: 'Email',  value: user.email },
                { label: 'Plan',   value: plan.label },
                { label: 'User ID', value: user.id.slice(0, 8) + '…' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(108,99,255,0.08)' }}>
                  <span style={{ fontSize: '0.78rem', color: '#a0a3b1', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: '0.78rem', color: '#1a1a2e', fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            {user.plan === 'free' && (
              <div style={{
                background: 'linear-gradient(135deg,rgba(108,99,255,0.08),rgba(0,191,166,0.08))',
                border: '1.5px solid rgba(108,99,255,0.2)', borderRadius: 24,
                padding: '24px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ fontSize: 28, marginBottom: 10 }}>🚀</div>
                <h3 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>Upgrade to Creator</h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#7b7fa8', lineHeight: 1.5 }}>
                  Sell prompts, access analytics, and climb the leaderboard.
                </p>
                <button style={{
                  width: '100%', padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#6C63FF,#8B84FF)', color: '#fff',
                  fontFamily: 'var(--font-sora,Sora,sans-serif)', fontWeight: 700, fontSize: '0.85rem',
                  boxShadow: '0 4px 14px rgba(108,99,255,0.3)',
                }}>
                  Upgrade – $12/mo
                </button>
              </div>
            )}

            {/* Getting started checklist */}
            <div style={{
              background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: 24,
              boxShadow: '0 4px 20px rgba(108,99,255,0.08)', padding: '24px',
            }}>
              <h2 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e' }}>Getting Started</h2>
              {[
                { done: true,  text: 'Create your account'          },
                { done: false, text: 'Complete your profile'         },
                { done: false, text: 'Publish your first prompt'     },
                { done: false, text: 'Get your first sale'           },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 3 ? '1px solid rgba(108,99,255,0.07)' : 'none' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: item.done ? 'rgba(0,191,166,0.15)' : 'rgba(108,99,255,0.08)',
                    border: `2px solid ${item.done ? '#00BFA6' : 'rgba(108,99,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: item.done ? '#00BFA6' : 'transparent',
                  }}>
                    {item.done ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: item.done ? '#7b7fa8' : '#1a1a2e', fontWeight: item.done ? 400 : 500, textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
