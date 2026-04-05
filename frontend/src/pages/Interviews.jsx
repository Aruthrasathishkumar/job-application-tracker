import { useState, useEffect } from 'react'
import client from '../api/client'

function AddNoteModal({ jobs, onSave, onClose }) {
  const [form, setForm] = useState({
    job_id: jobs[0]?.id || '', round: '', interviewer_name: '', interview_date: '',
    questions_asked: '', my_answers: '', went_well: '', weak_spots: '',
  })
  const [saving, setSaving] = useState(false)
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    if (!form.job_id) return
    setSaving(true)
    try { await onSave(form); onClose() } finally { setSaving(false) }
  }

  const inp = "w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm placeholder-slate-400"

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">Add interview notes</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg transition-colors">&#10005;</button>
        </div>
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Job *</label><select value={form.job_id} onChange={e => set('job_id', e.target.value)} className={inp}>{jobs.map(j => <option key={j.id} value={j.id}>{j.company} - {j.role}</option>)}</select></div>
            <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Round</label><input value={form.round} onChange={e => set('round', e.target.value)} className={inp} placeholder="Phone, Technical, Onsite..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Interviewer</label><input value={form.interviewer_name} onChange={e => set('interviewer_name', e.target.value)} className={inp} placeholder="Name" /></div>
            <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Date</label><input type="date" value={form.interview_date} onChange={e => set('interview_date', e.target.value)} className={inp} /></div>
          </div>
          <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Questions asked</label><textarea value={form.questions_asked} onChange={e => set('questions_asked', e.target.value)} className={`${inp} resize-none`} rows={4} placeholder="What questions were you asked?" /></div>
          <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Your answers / notes</label><textarea value={form.my_answers} onChange={e => set('my_answers', e.target.value)} className={`${inp} resize-none`} rows={4} placeholder="How did you respond?" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">What went well</label><textarea value={form.went_well} onChange={e => set('went_well', e.target.value)} className={`${inp} resize-none`} rows={3} placeholder="Strengths..." /></div>
            <div><label className="text-[11px] text-slate-500 mb-1 block font-medium">Weak spots</label><textarea value={form.weak_spots} onChange={e => set('weak_spots', e.target.value)} className={`${inp} resize-none`} rows={3} placeholder="Areas to improve..." /></div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-500 hover:text-slate-700 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.job_id} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">{saving ? 'Saving...' : 'Save Notes'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NoteCard({ note, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl shadow-sm hover:shadow-md p-5 transition-all">
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-slate-800 font-medium text-sm">{note.company}</h3>
            <span className="text-slate-400 text-xs">{note.role}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {note.round && <span className="text-[11px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full">{note.round}</span>}
            {note.interviewer_name && <span className="text-[11px] text-slate-500">with {note.interviewer_name}</span>}
            {note.interview_date && <span className="text-[11px] text-slate-400">{new Date(note.interview_date).toLocaleDateString()}</span>}
          </div>
        </div>
        <button onClick={() => onDelete(note.id)} className="text-slate-300 hover:text-red-400 transition-colors text-sm">&#10005;</button>
      </div>
      {note.questions_asked && (
        <div className="mb-2.5">
          <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-medium">Questions</p>
          <p className={`text-slate-500 text-sm leading-relaxed whitespace-pre-line ${!expanded ? 'line-clamp-3' : ''}`}>{note.questions_asked}</p>
        </div>
      )}
      {expanded && (
        <>
          {note.my_answers && (
            <div className="mb-2.5">
              <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-medium">Your notes</p>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{note.my_answers}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {note.went_well && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <p className="text-[10px] text-emerald-600 mb-1 font-medium">Went well</p>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{note.went_well}</p>
              </div>
            )}
            {note.weak_spots && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-[10px] text-red-500 mb-1 font-medium">Improve</p>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{note.weak_spots}</p>
              </div>
            )}
          </div>
        </>
      )}
      <button onClick={() => setExpanded(!expanded)} className="mt-2.5 text-xs text-indigo-500 hover:text-indigo-400 transition-colors">
        {expanded ? '\u2191 Show less' : '\u2193 Show full notes'}
      </button>
    </div>
  )
}

export default function Interviews({ jobs }) {
  const [notes, setNotes] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchNotes = async () => {
    try { const res = await client.get('/interviews'); setNotes(res.data); setFiltered(res.data) }
    catch (err) { console.error('Failed to fetch interviews', err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchNotes() }, [])

  useEffect(() => {
    if (!search.trim()) { setFiltered(notes); return }
    const q = search.toLowerCase()
    setFiltered(notes.filter(n => {
      const text = [n.company, n.role, n.round, n.interviewer_name, n.questions_asked, n.my_answers, n.weak_spots, n.went_well].filter(Boolean).join(' ').toLowerCase()
      return text.includes(q)
    }))
  }, [search, notes])

  const handleSave = async (formData) => {
    const payload = { ...formData }
    if (!payload.interview_date) delete payload.interview_date
    await client.post('/interviews', payload)
    await fetchNotes()
  }

  const handleDelete = async (noteId) => {
    await client.delete(`/interviews/${noteId}`)
    setNotes(prev => prev.filter(n => n.id !== noteId))
  }

  if (loading) return <div className="flex items-center justify-center py-16"><p className="text-slate-400 text-sm">Loading...</p></div>

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions, companies, notes..."
            className="w-full bg-white border border-slate-200 rounded-xl shadow-sm pl-9 pr-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder-slate-400" />
        </div>
        <button onClick={() => setShowModal(true)} disabled={jobs.length === 0}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm">
          + Add Notes
        </button>
      </div>

      {jobs.length === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
          <p className="text-amber-600 text-sm">Add job applications first - then attach interview notes to them.</p>
        </div>
      )}

      {notes.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>{notes.length} {notes.length === 1 ? 'entry' : 'entries'}</span>
          {search && <span className="text-indigo-500">{filtered.length} matching &quot;{search}&quot;</span>}
        </div>
      )}

      {filtered.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">{'\uD83D\uDCDD'}</div>
          <p className="text-slate-500 font-medium mb-1 text-sm">{search ? 'No notes match your search' : 'No interview notes yet'}</p>
          <p className="text-slate-400 text-xs max-w-xs">{search ? 'Try different keywords.' : 'After an interview, add your notes here.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">{filtered.map(note => <NoteCard key={note.id} note={note} onDelete={handleDelete} />)}</div>
      )}

      {showModal && <AddNoteModal jobs={jobs} onSave={handleSave} onClose={() => setShowModal(false)} />}
    </div>
  )
}
