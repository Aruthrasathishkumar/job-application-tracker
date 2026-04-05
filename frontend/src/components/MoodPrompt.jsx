import { useState } from 'react'

const MOODS = [
  { score: 1, emoji: '\uD83D\uDE1E', label: 'Rough', hover: 'hover:bg-red-50 hover:border-red-200', active: 'bg-red-50 border-red-200 ring-2 ring-red-100' },
  { score: 2, emoji: '\uD83D\uDE15', label: 'Low', hover: 'hover:bg-orange-50 hover:border-orange-200', active: 'bg-orange-50 border-orange-200 ring-2 ring-orange-100' },
  { score: 3, emoji: '\uD83D\uDE10', label: 'Okay', hover: 'hover:bg-yellow-50 hover:border-yellow-200', active: 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100' },
  { score: 4, emoji: '\uD83D\uDE0A', label: 'Good', hover: 'hover:bg-emerald-50 hover:border-emerald-200', active: 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100' },
  { score: 5, emoji: '\uD83D\uDE80', label: 'Great', hover: 'hover:bg-indigo-50 hover:border-indigo-200', active: 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' },
]

export function MoodCheckIn({ onLog, loggedToday, todayScore }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(loggedToday)

  const handleSelect = async (score) => {
    setSelected(score)
    await onLog(score, null, 'daily_checkin')
    setSubmitted(true)
  }

  if (submitted || loggedToday) {
    return (
      <div className="bg-white/80 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
        <span className="text-lg">{MOODS.find(m => m.score === (selected || todayScore))?.emoji || '\u2705'}</span>
        <div>
          <p className="text-slate-700 text-sm font-semibold">Mood logged for today</p>
          <p className="text-slate-400 text-xs">Come back tomorrow for your next check-in</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50/50 to-violet-50/50 border border-indigo-100/50 rounded-xl px-5 py-4">
      <p className="text-slate-700 text-sm font-semibold mb-0.5">How&apos;s the job search going today?</p>
      <p className="text-slate-400 text-xs mb-3">Takes 2 seconds - helps track burnout risk</p>
      <div className="flex gap-2">
        {MOODS.map(m => (
          <button key={m.score} onClick={() => handleSelect(m.score)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border border-slate-100 bg-white transition-all duration-200 ${m.hover} shadow-sm hover:shadow-md hover:-translate-y-0.5`}>
            <span className="text-lg">{m.emoji}</span>
            <span className="text-slate-400 text-[10px] font-medium">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function MoodPopup({ jobName, onLog, onSkip }) {
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selected) return
    await onLog(selected, note)
    setSubmitted(true)
    setTimeout(onSkip, 800)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-2xl animate-fade-in">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-slate-800 font-semibold">Logged</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-slate-200/50">
        <p className="text-slate-800 font-semibold mb-1">Status updated for {jobName}</p>
        <p className="text-slate-400 text-sm mb-4">How are you feeling right now?</p>
        <div className="flex gap-2 mb-4">
          {MOODS.map(m => (
            <button key={m.score} onClick={() => setSelected(m.score)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all duration-200 ${
                selected === m.score ? m.active : 'border-slate-100 bg-white hover:bg-slate-50'
              }`}>
              <span className="text-lg">{m.emoji}</span>
            </button>
          ))}
        </div>
        {selected && (
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note..."
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 mb-4 shadow-sm" />
        )}
        <div className="flex gap-2">
          <button onClick={onSkip} className="flex-1 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-medium transition-all">Skip</button>
          <button onClick={handleSubmit} disabled={!selected} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/20">Log mood</button>
        </div>
      </div>
    </div>
  )
}
