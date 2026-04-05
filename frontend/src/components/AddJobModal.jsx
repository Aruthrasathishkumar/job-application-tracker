import { useState } from 'react'

const STATUS_OPTIONS = ['applied', 'screening', 'interview', 'offer', 'rejected']
const SOURCE_OPTIONS = ['cold', 'linkedin', 'alumni', 'referral', 'recruiter']

export default function AddJobModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ company: '', role: '', status: 'applied', source: 'cold', salary_min: '', salary_max: '', offer_received: '', jd_url: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async () => {
    if (!form.company || !form.role) { setError('Company and role are required'); return }
    setLoading(true); setError('')
    try {
      await onAdd({ ...form, salary_min: form.salary_min ? parseInt(form.salary_min) : null, salary_max: form.salary_max ? parseInt(form.salary_max) : null, offer_received: form.offer_received ? parseInt(form.offer_received) : null })
      onClose()
    } catch (err) { setError(err.friendlyMessage || err.response?.data?.detail || 'Failed to add job') }
    finally { setLoading(false) }
  }

  const inp = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">Add application</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 text-lg transition-colors">&#10005;</button>
        </div>
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Company *</label><input value={form.company} onChange={e => set('company', e.target.value)} className={inp} placeholder="Google" /></div>
            <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Role *</label><input value={form.role} onChange={e => set('role', e.target.value)} className={inp} placeholder="Software Engineer" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Status</label><select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
            <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Source</label><select value={form.source} onChange={e => set('source', e.target.value)} className={inp}>{SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Salary Min ($)</label><input type="number" value={form.salary_min} onChange={e => set('salary_min', e.target.value)} className={inp} placeholder="80000" /></div>
            <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Salary Max ($)</label><input type="number" value={form.salary_max} onChange={e => set('salary_max', e.target.value)} className={inp} placeholder="120000" /></div>
          </div>
          <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Offer Received ($)</label><input type="number" value={form.offer_received||''} onChange={e => set('offer_received', e.target.value)} className={inp} placeholder="Leave blank until offer stage" /></div>
          <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Job URL</label><input value={form.jd_url} onChange={e => set('jd_url', e.target.value)} className={inp} placeholder="https://..." /></div>
          <div><label className="text-[11px] text-slate-500 mb-1 block font-semibold">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} className={`${inp} resize-none`} placeholder="Referral from John, strong team culture..." /></div>
          {error && <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5"><p className="text-red-600 text-sm">{error}</p></div>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-medium transition-all">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/20">{loading ? 'Adding...' : 'Add Job'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
