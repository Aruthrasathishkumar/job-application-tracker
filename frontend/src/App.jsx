import { useState, useEffect, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { useJobs } from './hooks/useJobs'
import { useMood } from './hooks/useMood'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Analytics from './pages/Analytics'
import MoodAnalytics from './pages/MoodAnalytics'
import Interviews from './pages/Interviews'
import Salary from './pages/Salary'
import KanbanBoard from './components/KanbanBoard'
import AddJobModal from './components/AddJobModal'
import { MoodCheckIn, MoodPopup } from './components/MoodPrompt'
import client from './api/client'

const NAV = [
  { id: 'board', label: 'Board' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'mood', label: 'Mood' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'salary', label: 'Salary' },
]

function Dashboard({ user, logout }) {
  const { jobs, loading, addJob, updateJob, deleteJob } = useJobs()
  const { trend, loggedToday, logMood } = useMood()
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState('board')
  const [moodPopup, setMoodPopup] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)
  const tabRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // Sliding tab indicator
  useEffect(() => {
    const el = tabRefs.current[activeTab]
    if (el) {
      const parent = el.parentElement
      setIndicator({ left: el.offsetLeft - parent.offsetLeft, width: el.offsetWidth })
    }
  }, [activeTab])

  useEffect(() => {
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJob(jobId, { status: newStatus })
      const job = jobs.find(j => j.id === jobId)
      if (job) setMoodPopup({ jobId, jobName: job.company, trigger: newStatus })
    } catch (err) { console.error('Failed to update', err) }
  }

  const handleMoodLog = async (score, note = '') => {
    await logMood(score, moodPopup?.jobId || null, moodPopup?.trigger || 'manual', note)
  }

  const handleExport = async () => {
    const res = await client.get('/jobs/export/csv', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = 'job_applications.csv'; a.click()
  }

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
  }
  const todayScore = trend?.logs?.slice(-1)[0]?.score || null
  const initial = (user.email || '?')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* HEADER */}
      <header className="glass sticky top-0 z-40 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="1" fill="white" opacity="0.9"/><rect x="6" y="1" width="4" height="4" rx="1" fill="white" opacity="0.5"/>
                <rect x="1" y="6" width="4" height="4" rx="1" fill="white" opacity="0.65"/><rect x="6" y="6" width="4" height="4" rx="1" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight hidden sm:inline">Job Tracker</span>
          </div>

          {/* Desktop tabs with sliding indicator */}
          <div className="hidden md:block relative">
            <nav className="relative flex items-center gap-0.5 bg-slate-100/80 rounded-xl p-1">
              {/* Sliding indicator */}
              <div className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
                style={{ left: `${indicator.left}px`, width: `${indicator.width}px` }} />
              {NAV.map(tab => (
                <button key={tab.id}
                  ref={el => tabRefs.current[tab.id] = el}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors duration-200 ${
                    activeTab === tab.id ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  {tab.label}
                  {tab.id === 'mood' && trend?.burnout_warning && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block ml-1 animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={handleExport} title="Export CSV"
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-2 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 shadow-md shadow-indigo-500/20 flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 1v11M1 6.5h11"/></svg>
              <span className="hidden sm:inline">Add Job</span>
            </button>
            <div ref={menuRef} className="relative">
              <button onClick={() => setShowUserMenu(v => !v)}
                className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-shadow">
                {initial}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 py-1 w-44 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); logout() }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1">
          {NAV.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'
              }`}>
              {tab.label}
              {tab.id === 'mood' && trend?.burnout_warning && (
                <span className="ml-1 w-1.5 h-1.5 bg-red-500 rounded-full inline-block"/>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: '📋', gradient: 'from-slate-50 to-white' },
            { label: 'In Progress', value: stats.applied, icon: '🔄', gradient: 'from-blue-50 to-white' },
            { label: 'Interviews', value: stats.interview, icon: '💬', gradient: 'from-violet-50 to-white' },
            { label: 'Offers', value: stats.offer, icon: '🎉', gradient: 'from-emerald-50 to-white' },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border border-slate-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-[11px] font-semibold">{s.label}</p>
                <span className="text-sm">{s.icon}</span>
              </div>
              <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'board' && (
            <div className="space-y-4">
              <MoodCheckIn onLog={(score) => logMood(score, null, 'daily_checkin')} loggedToday={loggedToday} todayScore={todayScore} />
              {loading ? (
                <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <p className="text-slate-500 mb-3 text-sm font-medium">No applications yet</p>
                  <p className="text-slate-400 text-xs mb-5 max-w-xs mx-auto">Add your first job application to start building your intelligence dashboard.</p>
                  <button onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-px">
                    Add your first job
                  </button>
                </div>
              ) : (
                <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} onDelete={deleteJob} />
              )}
            </div>
          )}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'mood' && <MoodAnalytics />}
          {activeTab === 'interviews' && <Interviews jobs={jobs} />}
          {activeTab === 'salary' && <Salary />}
        </div>
      </div>

      {showAddModal && <AddJobModal onAdd={addJob} onClose={() => setShowAddModal(false)} />}
      {moodPopup && <MoodPopup jobName={moodPopup.jobName} onLog={handleMoodLog} onSkip={() => setMoodPopup(null)} />}
    </div>
  )
}

export default function App() {
  const { user, loading, logout } = useAuth()
  const [authed, setAuthed] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => { if (user) setAuthed(true) }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/30">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="4" height="4" rx="1" fill="white" opacity="0.9"/><rect x="6" y="1" width="4" height="4" rx="1" fill="white" opacity="0.5"/>
            <rect x="1" y="6" width="4" height="4" rx="1" fill="white" opacity="0.65"/>
          </svg>
        </div>
      </div>
    )
  }

  if (!authed && !user) {
    if (!showAuth) return <Landing onGetStarted={() => setShowAuth(true)} onLogin={() => setShowAuth(true)} />
    return <Auth onSuccess={() => { setAuthed(true); setShowAuth(false) }} onBack={() => setShowAuth(false)} />
  }

  return <Dashboard user={user} logout={() => { logout(); setAuthed(false); setShowAuth(false) }} />
}
