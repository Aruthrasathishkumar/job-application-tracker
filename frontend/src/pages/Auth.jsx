import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Auth({ onSuccess, onBack }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email address'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return }
    if (!password) { setError('Please enter your password'); return }
    if (!isLogin && password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      if (isLogin) await login(email, password)
      else await register(email, password)
      onSuccess()
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.detail || 'Unable to connect. Please check that the server is running.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex">
      {/* LEFT — Visual panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-center justify-center p-12">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-200/50 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-200/40 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="7" cy="7" r="2.5" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
                <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">Careerlens</span>
          </div>

          {/* Product preview card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-500/8 border border-white/80 p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-3 leading-tight">
              Intelligence for your job search.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Track applications, detect burnout, prepare for interviews, and negotiate better offers.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Source funnel analytics', color: 'from-indigo-500 to-blue-500' },
                { label: 'Burnout detection', color: 'from-violet-500 to-purple-500' },
                { label: 'Interview memory bank', color: 'from-amber-500 to-orange-500' },
                { label: 'Salary negotiation data', color: 'from-emerald-500 to-teal-500' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center shadow-sm`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-sm text-slate-600">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {['Free forever', 'Private data', '4 modules'].map((t, i) => (
              <span key={i} className="bg-white/60 text-slate-500 text-xs px-3 py-1.5 rounded-full border border-slate-200/50">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 py-8">
        {onBack && (
          <button onClick={onBack}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 transition-colors self-start group">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        )}

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="7" cy="7" r="2.5" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
                <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">Careerlens</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-400 text-sm mb-7">
            {isLogin ? 'Sign in to your dashboard' : 'Start tracking smarter today'}
          </p>

          {/* Tab switcher */}
          <div className="relative flex bg-slate-100 rounded-xl p-1 mb-7">
            <div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
              style={{ left: isLogin ? '4px' : 'calc(50%)' }} />
            <button onClick={() => setIsLogin(true)}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${isLogin ? 'text-slate-800' : 'text-slate-400'}`}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${!isLogin ? 'text-slate-800' : 'text-slate-400'}`}>
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
                placeholder="••••••••" />
              {!isLogin && <p className="text-slate-400 text-[11px] mt-1.5">Minimum 6 characters</p>}
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.2"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <p className="text-slate-400 text-[11px] text-center mt-6">
            Your data stays on your machine. No tracking. No selling.
          </p>
        </div>
      </div>
    </div>
  )
}
