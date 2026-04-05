import { useState, useEffect } from 'react'

/* ── Shared Logo ── */
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="7" cy="7" r="2.5" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
          <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="text-[15px] font-bold text-slate-800 tracking-tight">Careerlens</span>
    </div>
  )
}

/* ── Hero product mockup ── */
function HeroMockup() {
  const cols = [
    { label: 'Applied', color: '#6366f1', cards: 3 },
    { label: 'Screening', color: '#8b5cf6', cards: 2 },
    { label: 'Interview', color: '#a78bfa', cards: 1 },
    { label: 'Offer', color: '#10b981', cards: 1 },
  ]
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/10 border border-white/60 p-5 animate-fade-in">
      {/* Mini header bar */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="w-3 h-3 rounded-full bg-red-400/70" />
        <div className="w-3 h-3 rounded-full bg-amber-400/70" />
        <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
        <div className="ml-auto flex gap-1">
          {['Board', 'Analytics', 'Mood'].map(t => (
            <span key={t} className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${t === 'Board' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}>{t}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        {cols.map(col => (
          <div key={col.label} className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-[9px] font-semibold text-slate-500 truncate">{col.label}</span>
            </div>
            <div className="space-y-1.5">
              {Array.from({ length: col.cards }).map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <div className="h-1.5 rounded-full bg-slate-200 w-4/5" />
                  <div className="h-1 rounded-full bg-slate-100 w-3/5 mt-1.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Floating insight cards ── */
function FloatingCards() {
  return (
    <>
      <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg shadow-slate-200/60 border border-slate-100 px-4 py-2.5 z-20 animate-float">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9l3.5-4L8 7.5 12 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-700">Interview rate</p>
            <p className="text-emerald-600 text-xs font-bold">+40%</p>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-5 bg-white rounded-xl shadow-lg shadow-slate-200/60 border border-slate-100 px-4 py-2.5 z-20 animate-float-slow">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="#8b5cf6" strokeWidth="1.3"/><path d="M7 5v4M5 7h4" stroke="#8b5cf6" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-700">Burnout risk</p>
            <p className="text-violet-600 text-xs font-bold">Low</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Landing({ onGetStarted, onLogin }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const steps = [
    { n: '01', title: 'Add your applications', desc: 'Track every role, source, and salary expectation in one place.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg> },
    { n: '02', title: 'Move through your pipeline', desc: 'Drag cards as you progress. Track status changes visually.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"><path d="M5 9h14M5 15h14"/><path d="M3 5h18v14H3z" strokeLinejoin="round"/></svg> },
    { n: '03', title: 'Capture interview insights', desc: 'Log questions, answers, and weak spots. Search across all notes.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16v16H4z" strokeLinejoin="round"/><path d="M8 8h8M8 12h5"/></svg> },
    { n: '04', title: 'Analyze and improve', desc: 'See which sources convert, detect burnout, negotiate with data.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg> },
  ]

  const modules = [
    { title: 'Source Intelligence', desc: 'See which application channels actually lead to interviews and offers.', gradient: 'from-indigo-500 to-blue-500', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 16l5-5 3 3 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { title: 'Burnout Detection', desc: 'Daily mood tracking with 7-day rolling average and early warning alerts.', gradient: 'from-violet-500 to-purple-600', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5"/><path d="M10 7v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { title: 'Interview Memory', desc: 'Full-text searchable interview notes. Never walk in underprepared again.', gradient: 'from-amber-500 to-orange-500', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5"/><path d="M7 7h6M7 10h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { title: 'Salary Intelligence', desc: 'Percentile rankings, counter-offer suggestions, and negotiation insights.', gradient: 'from-emerald-500 to-teal-600', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v16M14 6H8a2 2 0 100 4h4a2 2 0 010 4H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">

      {/* ═══ NAV ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-slate-200/50 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">How it works</button>
            <button onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">Modules</button>
          </div>
          <button onClick={onLogin}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-px">
            Get started
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-64 bg-blue-100/40 rounded-full blur-[100px] -z-10 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left copy */}
          <div className="flex-1 max-w-xl text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Job Search Intelligence Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 mb-5">
              Track smarter.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Land faster.
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
              The platform that turns your job search data into actionable intelligence. Know what works, detect burnout, and negotiate better.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button onClick={onGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                Start for free
              </button>
              <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors flex items-center gap-1.5">
                See how it works
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
              {['Free forever', 'Private by default', 'No credit card'].map((t, i) => (
                <span key={i} className="text-xs text-slate-400 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right mockup */}
          <div className="flex-1 w-full max-w-lg relative animate-fade-in">
            <HeroMockup />
            <FloatingCards />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white -z-10" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Four steps to a smarter job search.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-lg hover:shadow-indigo-500/8 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <p className="text-xs font-bold text-indigo-400 mb-2">{s.n}</p>
                <h3 className="text-base font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTELLIGENCE MODULES ═══ */}
      <section id="modules" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 to-white -z-10" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500 mb-3">Intelligence Modules</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">Beyond tracking. Actual insights.</h2>
            <p className="text-slate-500 max-w-md mx-auto">Every module works together to give you a complete picture of your job search.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {modules.map((m, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 flex gap-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}
                  style={{ boxShadow: `0 8px 24px -4px rgba(99,102,241,0.25)` }}>
                  {m.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">{m.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT PREVIEW ═══ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 text-center">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-4">Why it feels different</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
                Your spreadsheet can&apos;t tell you<br className="hidden md:block" /> which source gets you interviews.
              </h2>
              <p className="text-indigo-200 max-w-lg mx-auto mb-8">
                Careerlens gives you real intelligence - source funnels, burnout patterns, interview history search, and salary negotiation data. All in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { n: '4', l: 'Intelligence modules' },
                  { n: '100%', l: 'Private data' },
                  { n: '0', l: 'Spreadsheets' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-black text-white">{s.n}</p>
                    <p className="text-xs text-indigo-200 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 to-white -z-10" />
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Ready to search smarter?
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Join thousands of job seekers using data to land their next role.
          </p>
          <button onClick={onGetStarted}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-10 py-4 rounded-xl text-base transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
            Get started free
          </button>
          <p className="text-slate-400 text-xs mt-5">No credit card required. Data stays on your machine.</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-slate-400 text-xs">Built by a job seeker, for job seekers.</p>
        </div>
        <div className="border-t border-slate-50 py-4 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>&copy; 2026 Careerlens</span>
            <span>Data stays on your machine</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
