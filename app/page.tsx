'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);
  return [dark, setDark] as const;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Word cycle hook ── */
const CYCLE_WORDS = ['Personas', 'Prompts', 'Agents'];
const CYCLE_MS = 5500;
function useWordCycle() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % CYCLE_WORDS.length), CYCLE_MS);
    return () => clearInterval(t);
  }, []);
  return idx;
}

/* ── Warp grid hook ── */
function useWarpGrid(ref: React.RefObject<HTMLElement | null>) {
  const [warp, setWarp] = useState({ rx: 0, ry: 0 });
  const raf = useRef<number>(0);

  const onMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - top)  / height - 0.5;
      setWarp({ rx: y * -12, ry: x * 12 });
    });
  }, [ref]);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setWarp({ rx: 0, ry: 0 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref, onMove, onLeave]);

  return warp;
}

const promptCards = [
  { tag: '🤖 Agent Workflow', tagBg: 'rgba(108,99,255,0.1)', tagColor: '#6C63FF', title: 'Full-Stack Dev Twin', desc: 'A complete AI persona that acts as your senior full-stack engineer — reviews code, suggests architecture, and debugs.', avatarGrad: 'linear-gradient(135deg,#6C63FF,#9B94FF)', letter: 'A', author: '@alexdev', price: '$4.99', free: false },
  { tag: '✍️ Prompt Pack', tagBg: 'rgba(0,191,166,0.1)', tagColor: '#00BFA6', title: 'Marketing Copy Master', desc: '50 battle-tested prompts for landing pages, email campaigns, and product launches that convert.', avatarGrad: 'linear-gradient(135deg,#00BFA6,#00D4B8)', letter: 'S', author: '@sarahmkt', price: '$9.99', free: false },
  { tag: '🧬 AI Persona', tagBg: 'rgba(255,101,132,0.1)', tagColor: '#FF6584', title: 'Socrates — The Questioner', desc: 'A philosophical AI persona that challenges your thinking through the Socratic method.', avatarGrad: 'linear-gradient(135deg,#FF6584,#FF8FA3)', letter: 'M', author: '@mindfulai', price: 'Free', free: true },
  { tag: '📊 Business Agent', tagBg: 'rgba(59,130,246,0.1)', tagColor: '#3B82F6', title: 'Startup Advisor GPT', desc: 'Get venture-capital level feedback on your startup idea, deck, and go-to-market strategy.', avatarGrad: 'linear-gradient(135deg,#3B82F6,#60A5FA)', letter: 'J', author: '@jaspervc', price: '$14.99', free: false },
  { tag: '🎨 Creative', tagBg: 'rgba(255,149,0,0.1)', tagColor: '#FF9500', title: 'Visual Storyteller v2', desc: 'Craft cinematic scene descriptions, mood boards, and storyboards for any genre.', avatarGrad: 'linear-gradient(135deg,#FF9500,#FFBE59)', letter: 'L', author: '@lumina', price: '$2.99', free: false },
  { tag: '⚙️ Automation', tagBg: 'rgba(108,99,255,0.1)', tagColor: '#6C63FF', title: 'N8N Workflow Builder', desc: 'Generate complete N8N automation workflows from plain English descriptions.', avatarGrad: 'linear-gradient(135deg,#6C63FF,#00BFA6)', letter: 'K', author: '@kaiflows', price: '$7.99', free: false },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(108,99,255,0.08)', color:'#6C63FF', border:'1px solid rgba(108,99,255,0.2)', padding:'6px 16px', borderRadius:100, fontSize:'0.8rem', fontWeight:600, fontFamily:'var(--font-sora,Sora,sans-serif)', letterSpacing:'0.05em', textTransform:'uppercase' as const, marginBottom:20 }}>{children}</div>
);

const hover = (el: HTMLElement, enter: boolean) => {
  el.style.transform = enter ? 'translateY(-4px)' : '';
  el.style.boxShadow = enter ? '0 8px 32px rgba(108,99,255,0.12)' : '';
  el.style.borderColor = enter ? 'rgba(108,99,255,0.2)' : '';
};

export default function Home() {
  const [dark, setDark] = useDarkMode();
  useReveal();
  const wordIdx = useWordCycle();
  const heroRef = useRef<HTMLElement>(null);
  const warp = useWarpGrid(heroRef);

  return (
    <div style={{ background:'var(--pg-bg)', color:'var(--pg-text)', minHeight:'100vh' }}>

      {/* NAVBAR */}
      <nav style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 48px)', maxWidth:1100, background: dark ? 'rgba(22,24,38,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid var(--pg-border)', borderRadius:100, padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:1000, boxShadow:'0 4px 24px rgba(108,99,255,0.1)', transition:'all 0.3s' }}>
        <a href="#" style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font-sora,Sora,sans-serif)', fontWeight:700, fontSize:'1.1rem', color:'var(--pg-text)', textDecoration:'none' }}>
          <Image src="/favicon.png" alt="Personagram logo" width={34} height={34} style={{ borderRadius:10 }} />
          Personagram
        </a>
        <ul style={{ display:'flex', alignItems:'center', gap:8, listStyle:'none', margin:0, padding:0 }}>
          {[['Features','#features'],['How it Works','#how-it-works'],['Creators','#creators'],['Pricing','#pricing'],['Leaderboard','#leaderboard']].map(([label, href]) => (
            <li key={label}><a href={href} style={{ textDecoration:'none', color:'var(--pg-text-muted)', fontSize:'0.875rem', fontWeight:500, padding:'8px 14px', borderRadius:100, transition:'all 0.2s' }}>{label}</a></li>
          ))}
        </ul>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => setDark(!dark)} title="Toggle dark mode" style={{ width:36, height:36, borderRadius:'50%', border:'1px solid var(--pg-border)', background:'var(--pg-surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'var(--pg-text)' }}>{dark ? '☀️' : '🌙'}</button>
          <a href="#" style={{ display:'inline-flex', alignItems:'center', padding:'8px 18px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.82rem', fontWeight:600, textDecoration:'none', background:'var(--pg-surface)', color:'var(--pg-text)', border:'1px solid var(--pg-border)' }}>Sign In</a>
          <a href="#" style={{ display:'inline-flex', alignItems:'center', padding:'8px 18px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.82rem', fontWeight:600, textDecoration:'none', background:'linear-gradient(135deg,#6C63FF,#8B84FF)', color:'white', boxShadow:'0 4px 16px rgba(108,99,255,0.35)' }}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} id="hero" style={{ paddingTop:160, paddingBottom:80, paddingLeft:24, paddingRight:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
          {/* Warping perspective grid */}
          <div style={{
            position:'absolute', inset:0,
            perspective: 800,
            perspectiveOrigin: '50% 50%',
          }}>
            <div style={{
              position:'absolute', inset:'-20%',
              backgroundImage:'linear-gradient(rgba(108,99,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.05) 1px,transparent 1px)',
              backgroundSize:'60px 60px',
              transform:`rotateX(${warp.rx}deg) rotateY(${warp.ry}deg) scale(1.1)`,
              transition:'transform 0.15s ease-out',
              animation:'pgGridPulse 4s ease-in-out infinite',
            }} />
          </div>
          <div style={{ position:'absolute', width:600, height:600, background:'#6C63FF', borderRadius:'50%', filter:'blur(80px)', opacity:0.15, top:-200, right:-100 }} />
          <div style={{ position:'absolute', width:400, height:400, background:'#00BFA6', borderRadius:'50%', filter:'blur(80px)', opacity:0.15, bottom:-100, left:-100 }} />
          <div style={{ position:'absolute', width:300, height:300, background:'#FF6584', borderRadius:'50%', filter:'blur(80px)', opacity:0.08, top:200, left:'30%' }} />
          <div style={{ position:'absolute', width:12, height:12, background:'#6C63FF', borderRadius:'50%', opacity:0.6, top:'20%', left:'10%', animation:'pgFloat1 6s ease-in-out infinite' }} />
          <div style={{ position:'absolute', width:8, height:8, background:'#00BFA6', borderRadius:'50%', opacity:0.5, top:'40%', right:'15%', animation:'pgFloat2 8s ease-in-out infinite' }} />
          <div style={{ position:'absolute', width:16, height:16, background:'#FF6584', borderRadius:'50%', opacity:0.3, bottom:'30%', left:'20%', animation:'pgFloat1 7s ease-in-out 2s infinite' }} />
        </div>
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,191,166,0.1))', border:'1px solid rgba(108,99,255,0.2)', padding:'8px 18px', borderRadius:100, fontSize:'0.85rem', fontWeight:500, color:'#6C63FF', marginBottom:32, animation:'pgFadeDown 0.8s ease both' }}>
            <span style={{ width:8, height:8, background:'#00BFA6', borderRadius:'50%', animation:'pgPulse 2s infinite', display:'inline-block' }} />
            Now in Public Beta · 12,000+ Creators Joined
          </div>
          <h1 style={{ fontSize:'clamp(2.8rem,6vw,5rem)', fontWeight:800, lineHeight:1.2, marginBottom:24, animation:'pgFadeDown 0.8s 0.1s ease both', fontFamily:'var(--font-sora,Sora,sans-serif)' }}>
            Build, Share &amp; Earn<br />
            <span style={{ display:'inline-flex', alignItems:'center', whiteSpace:'nowrap' }}>
              From Your&nbsp;
              <span
                key={wordIdx}
                className="pg-gradient-text"
                style={{ display:'inline-block', minWidth:'200px', textAlign:'left', animation:`pgWordBlink ${CYCLE_MS}ms cubic-bezier(0.4,0,0.2,1) both` }}
              >
                {CYCLE_WORDS[wordIdx]}
              </span>
            </span>
          </h1>
          <p style={{ fontSize:'clamp(1rem,2vw,1.2rem)', color:'var(--pg-text-muted)', maxWidth:580, margin:'0 auto 40px', lineHeight:1.7, animation:'pgFadeDown 0.8s 0.2s ease both' }}>
            Personagram is the marketplace and community for powerful AI prompts, personas, and agent workflows — designed for creators who think in systems.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:64, animation:'pgFadeDown 0.8s 0.3s ease both' }}>
            <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 36px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.05rem', fontWeight:600, textDecoration:'none', background:'linear-gradient(135deg,#6C63FF,#8B84FF)', color:'white', boxShadow:'0 4px 16px rgba(108,99,255,0.35)' }}>🔍 Explore Prompts</a>
            <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 36px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.05rem', fontWeight:600, textDecoration:'none', background:'var(--pg-surface)', color:'var(--pg-text)', border:'1px solid var(--pg-border)' }}>✦ Start Creating</a>
          </div>
          <div style={{ display:'flex', gap:40, justifyContent:'center', flexWrap:'wrap', marginBottom:64, animation:'pgFadeDown 0.8s 0.4s ease both' }}>
            {[['48K+','AI Prompts & Personas'],['12K+','Active Creators'],['$2.4M','Creator Earnings'],['180+','Countries Reached']].map(([n, l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div className="pg-gradient-text" style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.8rem', fontWeight:800 }}>{n}</div>
                <div style={{ fontSize:'0.8rem', color:'var(--pg-text-light)', fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Hero visual */}
          <div style={{ position:'relative', maxWidth:900, margin:'0 auto', animation:'pgFadeUp 1s 0.5s ease both' }}>
            <div style={{ background:'var(--pg-surface)', border:'1px solid var(--pg-border)', borderRadius:32, padding:24, boxShadow:'0 20px 60px rgba(108,99,255,0.18)', position:'relative', overflow:'hidden' }}>
              <div className="pg-shimmer-bar" />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {promptCards.map((c) => (
                  <div key={c.title}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(108,99,255,0.12)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(108,99,255,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; (e.currentTarget as HTMLElement).style.boxShadow=''; (e.currentTarget as HTMLElement).style.borderColor=''; }}
                    style={{ background:'var(--pg-bg)', border:'1px solid var(--pg-border)', borderRadius:16, padding:20, cursor:'pointer', transition:'all 0.3s' }}>
                    <div style={{ display:'inline-block', padding:'4px 10px', borderRadius:100, fontSize:'0.7rem', fontWeight:600, marginBottom:12, fontFamily:'var(--font-sora,Sora,sans-serif)', background:c.tagBg, color:c.tagColor }}>{c.tag}</div>
                    <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--pg-text)', marginBottom:6 }}>{c.title}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--pg-text-muted)', lineHeight:1.5, marginBottom:14 }}>{c.desc}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:24, height:24, borderRadius:'50%', background:c.avatarGrad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white' }}>{c.letter}</div>
                        <span style={{ fontSize:'0.72rem', color:'var(--pg-text-light)', fontWeight:500 }}>{c.author}</span>
                      </div>
                      <span style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.85rem', fontWeight:700, color: c.free ? '#00BFA6' : '#6C63FF' }}>{c.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" style={{ padding:'100px 24px', background:'var(--pg-surface)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>⚠️ The Problem</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>AI is Powerful —<br />But Great Prompts Are <span className="pg-gradient-text">Hard to Find</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>The gap between AI&apos;s potential and what most people get from it comes down to one thing: prompts.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
            {[
              { icon:'🗂️', title:'Scattered Resources', desc:"Great prompts are buried in Reddit threads, Discord servers, and random Notion docs. There's no centralized, trusted source." },
              { icon:'💸', title:'No Way to Monetize', desc:'Prompt engineers spend hundreds of hours perfecting their craft but have no real marketplace to sell their work.' },
              { icon:'🔍', title:'Impossible Discovery', desc:'Finding the right prompt for your use case is like finding a needle in a haystack. Bad prompts waste your time.' },
              { icon:'🔒', title:'No Quality Control', desc:'Most prompt communities have zero curation. Untested, low-effort prompts flood the space, impossible to trust.' },
            ].map((c) => (
              <div key={c.title} className="reveal"
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 8px 32px rgba(108,99,255,0.12)'; el.style.borderColor='rgba(255,101,132,0.3)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=''; el.style.borderColor=''; }}
                style={{ background:'var(--pg-bg)', border:'1px solid var(--pg-border)', borderRadius:24, padding:'32px 28px', transition:'all 0.3s' }}>
                <div style={{ width:56, height:56, background:'rgba(255,101,132,0.1)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:20 }}>{c.icon}</div>
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.1rem', fontWeight:700, marginBottom:10 }}>{c.title}</div>
                <div style={{ fontSize:'0.9rem', color:'var(--pg-text-muted)', lineHeight:1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" style={{ padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>✦ The Solution</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>Personagram <span className="pg-gradient-text">Solves This</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>One platform where the best AI minds create, share, and monetize — and everyone benefits.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
            {[
              { icon:'🛍️', title:'Prompt Marketplace', desc:'A curated, searchable marketplace for AI prompts across every domain — coding, marketing, education, creative writing. Every listing is rated, reviewed, and tested.' },
              { icon:'🧬', title:'AI Persona Sharing', desc:'Build and share complete AI personas — not just prompts, but full character sheets with system instructions, tone, style, and knowledge domains. Clone, remix, and evolve.' },
              { icon:'⚙️', title:'Agent Workflow Templates', desc:'Share and sell complete multi-step agent workflows. From research pipelines to content automation — package your processes and let others deploy them instantly.' },
              { icon:'🧪', title:'Built-in AI Playground', desc:'Test any prompt or persona before you buy, directly in the browser. No setup. No API keys. Instant preview of how any prompt performs on your exact use case.' },
            ].map((c) => (
              <div key={c.title} className="reveal"
                onMouseEnter={e => hover(e.currentTarget as HTMLElement, true)}
                onMouseLeave={e => hover(e.currentTarget as HTMLElement, false)}
                style={{ background:'var(--pg-surface)', border:'1px solid var(--pg-border)', borderRadius:24, padding:32, transition:'all 0.3s', position:'relative', overflow:'hidden' }}>
                <div style={{ width:56, height:56, background:'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,191,166,0.1))', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:20 }}>{c.icon}</div>
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.15rem', fontWeight:700, marginBottom:10 }}>{c.title}</div>
                <div style={{ fontSize:'0.9rem', color:'var(--pg-text-muted)', lineHeight:1.65 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding:'100px 24px', background:'var(--pg-surface)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>🗺️ Process</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>How Personagram <span className="pg-gradient-text">Works</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>From creation to monetization in four simple steps.</p>
          </div>
          {/* Steps: icon row + cards below */}
          <div style={{ position:'relative' }}>
            {/* Icon + number row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:0 }}>
              {[
                { n:'1', icon:'✍️', title:'Create', desc:'Craft your AI prompts, build detailed personas, or design full agent workflows using our guided editor.' },
                { n:'2', icon:'🚀', title:'Publish', desc:'List your creation on the marketplace. Set your price, write a description, and add tags for discovery.' },
                { n:'3', icon:'🧪', title:'Test in Playground', desc:'Buyers test your prompt instantly in the live playground. You get more conversions, they get full confidence.' },
                { n:'4', icon:'💰', title:'Earn & Grow', desc:'Earn money from every sale, gain followers, climb the leaderboard, and unlock creator recognition badges.' },
              ].map((s, idx) => (
                <div key={s.n} style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
                  {/* Number badge */}
                  <div style={{ width:32, height:32, background:'linear-gradient(135deg,#6C63FF,#00BFA6)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.78rem', fontWeight:800, color:'white', zIndex:2, boxShadow:'0 0 0 4px var(--pg-surface), 0 4px 12px rgba(108,99,255,0.4)', marginBottom:12 }}>{s.n}</div>

                  {/* Connector line segment — spans the gap between badges */}
                  {idx < 3 && (
                    <div style={{ position:'absolute', top:16, left:'50%', right:'-50%', width:'100%', height:2, zIndex:1, overflow:'hidden', marginLeft:16 }}>
                      {/* base track */}
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(108,99,255,0.25),rgba(0,191,166,0.25))' }} />
                      {/* animated glow pulse */}
                      <div style={{ position:'absolute', top:0, bottom:0, width:'40%', background:'linear-gradient(90deg,transparent,rgba(108,99,255,0.9),rgba(0,191,166,0.9),transparent)', animation:`pgLineFlow ${2 + idx * 0.4}s ease-in-out ${idx * 0.5}s infinite` }} />
                    </div>
                  )}

                  {/* Icon box */}
                  <div className="reveal"
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 8px 32px rgba(108,99,255,0.18)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=''; }}
                    style={{ background:'var(--pg-bg)', border:'1px solid var(--pg-border)', borderRadius:24, padding:'20px 16px 24px', textAlign:'center', transition:'all 0.3s', width:'100%', cursor:'default' }}>
                    <div style={{ width:64, height:64, background:'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,191,166,0.1))', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 16px' }}>{s.icon}</div>
                    <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1rem', fontWeight:700, marginBottom:8 }}>{s.title}</div>
                    <div style={{ fontSize:'0.85rem', color:'var(--pg-text-muted)', lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>🔧 Core Features</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>Everything You Need to<br /><span className="pg-gradient-text">Build & Earn</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { icon:'🛍️', bg:'rgba(108,99,255,0.12)', title:'Prompt & Persona Marketplace', desc:'Browse thousands of curated, rated prompts and AI personas across every domain and use case.' },
              { icon:'🧪', bg:'rgba(0,191,166,0.12)', title:'AI Playground', desc:'Test any prompt or persona instantly in the browser — no API keys or setup required.' },
              { icon:'💸', bg:'rgba(255,101,132,0.12)', title:'Creator Monetization', desc:'Set your own prices, accept one-time or subscription payments, and receive direct payouts.' },
              { icon:'❤️', bg:'rgba(255,149,0,0.12)', title:'Community Interactions', desc:'Like, comment, follow, and remix. Build your network in a community of serious AI practitioners.' },
              { icon:'🏆', bg:'rgba(59,130,246,0.12)', title:'Leaderboards & Badges', desc:'Compete for the top spot with reputation badges, sales rankings, and impact leaderboards.' },
              { icon:'📚', bg:'rgba(234,179,8,0.12)', title:'Collections & Libraries', desc:'Organize prompts into themed collections. Subscribe to curated libraries from top creators.' },
            ].map((f) => (
              <div key={f.title} className="reveal"
                onMouseEnter={e => hover(e.currentTarget as HTMLElement, true)}
                onMouseLeave={e => hover(e.currentTarget as HTMLElement, false)}
                style={{ background:'var(--pg-surface)', border:'1px solid var(--pg-border)', borderRadius:24, padding:'28px 24px', transition:'all 0.3s' }}>
                <div style={{ width:52, height:52, borderRadius:10, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:16 }}>{f.icon}</div>
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1rem', fontWeight:700, marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:'0.875rem', color:'var(--pg-text-muted)', lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATOR ECONOMY */}
      <section id="creators" style={{ padding:'100px 24px', background:'var(--pg-surface)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
          <div className="reveal">
            <SectionLabel>💰 Creator Economy</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>Turn Your AI Skills<br /><span className="pg-gradient-text">Into Income</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, lineHeight:1.7, marginBottom:32 }}>The world&apos;s most powerful AI minds deserve to be rewarded. Personagram is built for you.</p>
            <ul style={{ listStyle:'none', margin:'0 0 32px', padding:0, display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { icon:'🏷️', title:'Sell at Any Price', desc:'Set your own price from free to premium. Bundle prompts into packs for higher average order value.' },
                { icon:'👥', title:'Build a Creator Following', desc:'Grow your audience, get followers, and build a loyal community around your AI expertise.' },
                { icon:'🔄', title:'Earn Recurring Income', desc:'Offer subscription access to your prompt library for steady monthly revenue.' },
                { icon:'🥇', title:'Gain Leaderboard Recognition', desc:'Rise to the top of the leaderboard and earn featured placement across the platform.' },
              ].map((b) => (
                <li key={b.title} style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
                  <div style={{ width:40, height:40, background:'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,191,166,0.1))', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{b.icon}</div>
                  <div>
                    <strong style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.95rem', fontWeight:700, display:'block', marginBottom:3 }}>{b.title}</strong>
                    <span style={{ fontSize:'0.85rem', color:'var(--pg-text-muted)' }}>{b.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1rem', fontWeight:600, textDecoration:'none', background:'linear-gradient(135deg,#6C63FF,#8B84FF)', color:'white', boxShadow:'0 4px 16px rgba(108,99,255,0.35)' }}>Start Selling Today →</a>
          </div>
          {/* Creator Dashboard */}
          <div className="reveal" style={{ background:'var(--pg-bg)', border:'1px solid var(--pg-border)', borderRadius:32, padding:24, boxShadow:'0 20px 60px rgba(108,99,255,0.18)', position:'relative', overflow:'hidden' }}>
            <div className="pg-shimmer-bar" style={{ height:3 }} />
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ width:44, height:44, background:'linear-gradient(135deg,#6C63FF,#00BFA6)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>👤</div>
              <div>
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontWeight:700, fontSize:'0.95rem' }}>@alexdev</div>
                <div style={{ fontSize:'0.72rem', color:'var(--pg-text-muted)' }}>Prompt Engineer · 247 prompts</div>
              </div>
              <div style={{ marginLeft:'auto', background:'rgba(0,191,166,0.12)', color:'#00BFA6', padding:'4px 10px', borderRadius:100, fontSize:'0.72rem', fontWeight:600, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>✓ Verified Creator</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
              {[['$8,420','Total Earned'],['1,204','Purchases'],['847','Followers']].map(([n, l]) => (
                <div key={l} style={{ background:'var(--pg-surface)', borderRadius:10, padding:14, textAlign:'center' }}>
                  <div className="pg-gradient-text" style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.4rem', fontWeight:800 }}>{n}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--pg-text-light)' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--pg-surface)', borderRadius:16, padding:16, marginBottom:16 }}>
              <div style={{ fontSize:'0.78rem', color:'var(--pg-text-muted)', marginBottom:12, fontWeight:500 }}>Monthly Revenue</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:60 }}>
                {[40,55,35,70,50,85,65,90,75,95,80,100].map((h, i) => (
                  <div key={i}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='linear-gradient(180deg,#00BFA6,rgba(0,191,166,0.3))'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='linear-gradient(180deg,#6C63FF,rgba(108,99,255,0.3))'; }}
                    style={{ flex:1, height:`${h}%`, borderRadius:'4px 4px 0 0', background:'linear-gradient(180deg,#6C63FF,rgba(108,99,255,0.3))', transition:'all 0.3s', cursor:'pointer' }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--pg-text-muted)', marginBottom:10, fontFamily:'var(--font-sora,Sora,sans-serif)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Top Prompts</div>
            {[['Full-Stack Dev Twin','342 sales','$1,709'],['N8N Workflow Builder','198 sales','$1,584'],['Startup Advisor GPT','121 sales','$1,814']].map(([name, sales, rev]) => (
              <div key={name} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--pg-border)' }}>
                <div style={{ flex:1, fontSize:'0.8rem', fontWeight:500 }}>{name}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--pg-text-muted)' }}>{sales}</div>
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.8rem', fontWeight:700, color:'#00BFA6' }}>{rev}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>💳 Pricing</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>Simple, <span className="pg-gradient-text">Transparent Pricing</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>Start free, scale when you&apos;re ready.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, alignItems:'start' }}>
            {[
              { plan:'Free', amount:'$0', period:'/mo', alt:'Forever free', desc:'Get started exploring the platform.', featured:false, badge:null as string|null, features:['Browse all prompts & personas','AI Playground (10 tests/day)','Like, bookmark & share','Purchase prompts & packs','Basic profile page'] },
              { plan:'Creator', amount:'$12', period:'/mo', alt:'or $99/year (save 30%)', desc:'For serious prompt engineers who want to earn.', featured:true, badge:'Most Popular', features:['Everything in Free','Sell unlimited prompts','Creator analytics dashboard','Leaderboard eligibility','Set your own prices','Subscription prompt libraries','Priority support'] },
              { plan:'Pro', amount:'$29', period:'/mo', alt:'or $249/year (save 28%)', desc:'For power users who want the best.', featured:false, badge:null as string|null, features:['Everything in Creator','Access all premium prompts','Curated Pro Collections','Early access to trending','Featured placement boosts','Advanced playground (unlimited)','Custom persona builder'] },
            ].map((p) => (
              <div key={p.plan} className="reveal"
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!p.featured) { el.style.transform='translateY(-4px)'; el.style.boxShadow='0 8px 32px rgba(108,99,255,0.12)'; } }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (!p.featured) { el.style.transform=''; el.style.boxShadow=''; } }}
                style={{ background: p.featured ? 'linear-gradient(135deg,rgba(108,99,255,0.05),rgba(0,191,166,0.05))' : 'var(--pg-surface)', border: p.featured ? '1px solid rgba(108,99,255,0.3)' : '1px solid var(--pg-border)', borderRadius:32, padding:'32px 28px', position:'relative', transition:'all 0.3s', transform: p.featured ? 'scale(1.03)' : undefined, boxShadow: p.featured ? '0 20px 60px rgba(108,99,255,0.18)' : undefined }}>
                {p.badge && <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#6C63FF,#00BFA6)', color:'white', padding:'5px 16px', borderRadius:100, fontSize:'0.72rem', fontWeight:700, fontFamily:'var(--font-sora,Sora,sans-serif)', whiteSpace:'nowrap' }}>{p.badge}</div>}
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.85rem', fontWeight:600, color:'var(--pg-text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>{p.plan}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
                  <span style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'2.8rem', fontWeight:800, ...(p.featured ? { background:'linear-gradient(135deg,#6C63FF,#00BFA6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } : { color:'var(--pg-text)' }) }}>{p.amount}</span>
                  <span style={{ color:'var(--pg-text-muted)', fontSize:'0.85rem' }}>{p.period}</span>
                </div>
                <div style={{ fontSize:'0.8rem', color:'var(--pg-text-light)', marginBottom:24 }}>{p.alt}</div>
                <div style={{ fontSize:'0.875rem', color:'var(--pg-text-muted)', marginBottom:24, lineHeight:1.6 }}>{p.desc}</div>
                <div style={{ height:1, background:'var(--pg-border)', marginBottom:24 }} />
                <ul style={{ listStyle:'none', margin:'0 0 28px', padding:0, display:'flex', flexDirection:'column', gap:12 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.875rem' }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(0,191,166,0.12)', color:'#00BFA6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, flexShrink:0 }}>✓</div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#" style={{ display:'block', textAlign:'center', padding:'12px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.9rem', fontWeight:600, textDecoration:'none', ...(p.featured ? { background:'linear-gradient(135deg,#6C63FF,#8B84FF)', color:'white', boxShadow:'0 4px 16px rgba(108,99,255,0.35)' } : { background:'var(--pg-bg)', color:'var(--pg-text)', border:'1px solid var(--pg-border)' }) }}>Get Started</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section id="leaderboard" style={{ padding:'100px 24px', background:'var(--pg-surface)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>🏆 Leaderboard</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>The <span className="pg-gradient-text">Top Creators</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>Compete, rise, and earn recognition in the Personagram creator community.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
            <div className="reveal" style={{ background:'var(--pg-bg)', border:'1px solid var(--pg-border)', borderRadius:32, padding:28, boxShadow:'0 2px 8px rgba(108,99,255,0.08)' }}>
              <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.95rem', fontWeight:700, marginBottom:20 }}>🏆 Top Creators This Month</div>
              {[
                { rank:'🥇', color:'#F59E0B', avatar:'👨‍💻', grad:'linear-gradient(135deg,#6C63FF,#9B94FF)', name:'@alexdev', role:'Full-Stack & Automation', score:'$8,420' },
                { rank:'🥈', color:'#94A3B8', avatar:'👩‍🎨', grad:'linear-gradient(135deg,#FF6584,#FF8FA3)', name:'@lumina', role:'Creative & Visual', score:'$6,180' },
                { rank:'🥉', color:'#92400E', avatar:'👨‍💼', grad:'linear-gradient(135deg,#3B82F6,#60A5FA)', name:'@jaspervc', role:'Business & Strategy', score:'$5,990' },
                { rank:'4', color:'var(--pg-text-light)', avatar:'👩‍💻', grad:'linear-gradient(135deg,#00BFA6,#00D4B8)', name:'@sarahmkt', role:'Marketing & Copy', score:'$4,720' },
                { rank:'5', color:'var(--pg-text-light)', avatar:'🧑‍🏫', grad:'linear-gradient(135deg,#FF9500,#FFBE59)', name:'@mindfulai', role:'Philosophy & Education', score:'$3,850' },
              ].map((r) => (
                <div key={r.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--pg-border)' }}>
                  <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.8rem', fontWeight:800, width:28, textAlign:'center', color:r.color }}>{r.rank}</div>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:r.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{r.avatar}</div>
                  <div style={{ flex:1 }}>
                    <strong style={{ fontSize:'0.875rem', display:'block', fontWeight:600 }}>{r.name}</strong>
                    <span style={{ fontSize:'0.75rem', color:'var(--pg-text-muted)' }}>{r.role}</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.85rem', fontWeight:700, color:'#6C63FF' }}>{r.score}</div>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ background:'var(--pg-bg)', border:'1px solid var(--pg-border)', borderRadius:32, padding:28, boxShadow:'0 2px 8px rgba(108,99,255,0.08)' }}>
              <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.95rem', fontWeight:700, marginBottom:20 }}>🔥 Trending Prompts</div>
              {[
                { n:'01', name:'Full-Stack Dev Twin', author:'@alexdev', badge:'🤖 Agent', bg:'rgba(108,99,255,0.1)', color:'#6C63FF' },
                { n:'02', name:'Marketing Copy Master', author:'@sarahmkt', badge:'✍️ Pack', bg:'rgba(0,191,166,0.1)', color:'#00BFA6' },
                { n:'03', name:'Startup Advisor GPT', author:'@jaspervc', badge:'📊 Business', bg:'rgba(59,130,246,0.1)', color:'#3B82F6' },
                { n:'04', name:'N8N Workflow Builder', author:'@kaiflows', badge:'⚙️ Auto', bg:'rgba(108,99,255,0.1)', color:'#6C63FF' },
                { n:'05', name:'Visual Storyteller v2', author:'@lumina', badge:'🎨 Creative', bg:'rgba(255,149,0,0.1)', color:'#FF9500' },
              ].map((t) => (
                <div key={t.n} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--pg-border)' }}>
                  <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1.2rem', fontWeight:800, color:'var(--pg-surface2)', width:28 }}>{t.n}</div>
                  <div style={{ flex:1 }}>
                    <strong style={{ fontSize:'0.875rem', display:'block' }}>{t.name}</strong>
                    <span style={{ fontSize:'0.75rem', color:'var(--pg-text-muted)' }}>{t.author}</span>
                  </div>
                  <div style={{ padding:'3px 10px', borderRadius:100, fontSize:'0.7rem', fontWeight:600, fontFamily:'var(--font-sora,Sora,sans-serif)', background:t.bg, color:t.color }}>{t.badge}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>💬 Testimonials</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>Loved by <span className="pg-gradient-text">Creators</span></h2>
            <p style={{ fontSize:'1.1rem', color:'var(--pg-text-muted)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>See what creators are saying about Personagram.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
            {[
              { avatar:'👨‍💼', grad:'linear-gradient(135deg,#6C63FF,#9B94FF)', name:'Alex Chen', role:'Prompt Engineer · @alexdev', text:'Personagram completely changed how I think about monetizing my AI expertise. I went from giving prompts away for free to earning over $8K last month. The marketplace is incredible.' },
              { avatar:'👩‍🎨', grad:'linear-gradient(135deg,#FF6584,#FF8FA3)', name:'Lumina K.', role:'Creative AI Artist · @lumina', text:'The playground feature is a game-changer. Buyers can test my prompts before purchasing, which builds trust and converts so much better than just showing screenshots.' },
              { avatar:'👨‍💼', grad:'linear-gradient(135deg,#3B82F6,#60A5FA)', name:'Jasper V.', role:'Startup Advisor · @jaspervc', text:"I've tried every prompt platform out there. None come close to Personagram's quality of community and creator tools. The leaderboard keeps me competitive and motivated." },
              { avatar:'👩‍💻', grad:'linear-gradient(135deg,#00BFA6,#00D4B8)', name:'Sarah M.', role:'Marketing Director · @sarahmkt', text:'Found the most incredible marketing prompts here that have directly impacted our conversion rates. The quality control on this platform is unlike anywhere else.' },
            ].map((t) => (
              <div key={t.name} className="reveal"
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-3px)'; el.style.boxShadow='0 8px 32px rgba(108,99,255,0.12)'; el.style.borderColor='rgba(108,99,255,0.2)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=''; el.style.borderColor=''; }}
                style={{ background:'var(--pg-surface)', border:'1px solid var(--pg-border)', borderRadius:24, padding:28, transition:'all 0.3s' }}>
                <div className="pg-gradient-text" style={{ fontSize:'2rem', lineHeight:1, marginBottom:16 }}>&ldquo;</div>
                <p style={{ fontSize:'0.925rem', color:'var(--pg-text-muted)', lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>{t.text}</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:t.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontWeight:700, fontSize:'0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--pg-text-muted)' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft:'auto', color:'#F59E0B', fontSize:'0.75rem', letterSpacing:2 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ padding:'100px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(108,99,255,0.06),rgba(0,191,166,0.06))' }} />
        <div className="reveal" style={{ position:'relative', zIndex:1, textAlign:'center', padding:'80px 40px', background:'var(--pg-surface)', border:'1px solid var(--pg-border)', borderRadius:32, maxWidth:700, margin:'0 auto', boxShadow:'0 8px 32px rgba(108,99,255,0.12)', overflow:'hidden' }}>
          <div className="pg-shimmer-bar" style={{ height:3 }} />
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800, marginBottom:16, fontFamily:'var(--font-sora,Sora,sans-serif)' }}>Start Building Your<br /><span className="pg-gradient-text">AI Twin Today</span></h2>
          <p style={{ fontSize:'1rem', color:'var(--pg-text-muted)', marginBottom:36 }}>Join thousands of creators monetizing their AI expertise on Personagram.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1rem', fontWeight:600, textDecoration:'none', background:'linear-gradient(135deg,#6C63FF,#8B84FF)', color:'white', boxShadow:'0 4px 16px rgba(108,99,255,0.35)' }}>🔍 Explore Prompts</a>
            <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'1rem', fontWeight:600, textDecoration:'none', background:'transparent', color:'#6C63FF', border:'1.5px solid #6C63FF' }}>✦ Become a Creator</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'var(--pg-surface)', borderTop:'1px solid var(--pg-border)', padding:'60px 24px 32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:48 }}>
            <div>
              <a href="#" style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font-sora,Sora,sans-serif)', fontWeight:700, fontSize:'1.1rem', color:'var(--pg-text)', textDecoration:'none', marginBottom:12 }}>
                <Image src="/favicon.png" alt="Personagram logo" width={34} height={34} style={{ borderRadius:10 }} />
                Personagram
              </a>
              <p style={{ fontSize:'0.875rem', color:'var(--pg-text-muted)', lineHeight:1.6, maxWidth:280, marginBottom:20 }}>The marketplace and community for powerful AI prompts, personas, and agent workflows.</p>
              <div style={{ display:'flex', gap:8 }}>
                {['𝕏','💬','📘','🐙'].map((s, i) => (
                  <a key={i} href="#" style={{ width:36, height:36, borderRadius:10, background:'var(--pg-bg)', border:'1px solid var(--pg-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, textDecoration:'none', transition:'all 0.2s' }}>{s}</a>
                ))}
              </div>
            </div>
            {[
              { title:'Product', links:['Marketplace','Playground','Leaderboard','Collections','Analytics'] },
              { title:'Company', links:['About','Blog','Careers','Press','Contact'] },
              { title:'Resources', links:['Documentation','Creator Guide','Support','Terms','Privacy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.85rem', fontWeight:700, color:'var(--pg-text)', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.05em' }}>{col.title}</h4>
                <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                  {col.links.map((l) => (
                    <li key={l} style={{ marginBottom:8 }}><a href="#" style={{ textDecoration:'none', color:'var(--pg-text-muted)', fontSize:'0.875rem', transition:'color 0.2s' }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:24, borderTop:'1px solid var(--pg-border)', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:'0.8rem', color:'var(--pg-text-light)' }}>© 2026 Personagram. All rights reserved.</span>
            <span style={{ fontSize:'0.8rem', color:'var(--pg-text-light)' }}>Made with ❤️ for AI creators worldwide</span>
          </div>
        </div>
      </footer>

      {/* STICKY CTA */}
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:999 }}>
        <button
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-3px)'; el.style.boxShadow='0 12px 32px rgba(108,99,255,0.5)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow='0 8px 24px rgba(108,99,255,0.4)'; }}
          style={{ background:'linear-gradient(135deg,#6C63FF,#00BFA6)', color:'white', border:'none', padding:'12px 20px', borderRadius:100, fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', boxShadow:'0 8px 24px rgba(108,99,255,0.4)', transition:'all 0.3s', display:'flex', alignItems:'center', gap:8 }}>
          ✦ Start Creating Free
        </button>
      </div>

    </div>
  );
}
