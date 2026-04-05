import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import client from '../api/client'

const fmt = (n) => n ? `$${(n / 1000).toFixed(0)}k` : '\u2014'
const fmtFull = (n) => n ? `$${n.toLocaleString()}` : '\u2014'

function StatCard({ label, value, sub, color = 'text-slate-800' }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
      <p className="text-slate-400 text-[11px] mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-slate-400 text-[11px] mt-1">{sub}</p>}
    </div>
  )
}

function PercentileBar({ value, label, color }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
        <span>{label}</span>
        <span>{value ? `${value}th percentile` : '\u2014'}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value || 0}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Salary() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/salary/analysis')
      .then(res => setData(res.data))
      .catch(err => console.error('Salary fetch failed', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-16"><p className="text-slate-400 text-sm">Loading...</p></div>

  if (!data || !data.has_data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">{'\uD83D\uDCB0'}</div>
        <p className="text-slate-500 font-medium mb-1 text-sm">No salary data yet</p>
        <p className="text-slate-400 text-xs max-w-xs">Add salary ranges when creating applications.</p>
      </div>
    )
  }

  const { summary, job_breakdown, offer_analysis } = data
  const chartData = job_breakdown.map(j => ({
    name: j.company,
    min: j.salary_min ? j.salary_min / 1000 : 0,
    max: j.salary_max ? j.salary_max / 1000 : 0,
    mid: j.midpoint ? j.midpoint / 1000 : 0,
    offer: j.offer_received ? j.offer_received / 1000 : null,
  }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Median target" value={fmt(summary.median_target)} sub="across applications" />
        <StatCard label="Salary range" value={`${fmt(summary.min_target)} - ${fmt(summary.max_target)}`} sub="min to max" color="text-indigo-600" />
        <StatCard label="With salary data" value={summary.total_with_salary} sub="applications tracked" color="text-violet-600" />
        {offer_analysis ? (
          <StatCard label="Best offer" value={fmt(offer_analysis.best_offer)} sub={`${offer_analysis.percentile_of_best}th percentile`} color="text-emerald-600" />
        ) : (
          <StatCard label="Offers" value="0" sub="no offers yet" color="text-slate-400" />
        )}
      </div>

      {offer_analysis && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">{'\uD83C\uDF89'}</span>
            <div>
              <p className="text-emerald-700 font-medium text-sm mb-0.5">You have {offer_analysis.count} offer{offer_analysis.count > 1 ? 's' : ''}!</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Best offer: {fmtFull(offer_analysis.best_offer)} - {offer_analysis.percentile_of_best}th percentile of your targets.
                {offer_analysis.percentile_of_best < 50 ? ' Room to negotiate.' : ' Strong offer.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
        <h3 className="text-slate-800 font-medium text-sm mb-0.5">Salary Ranges</h3>
        <p className="text-slate-400 text-[11px] mb-5">Target midpoints by company</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={24}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}k`} />
            <Tooltip formatter={(v, name) => [`$${v}k`, name]} contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} labelStyle={{ color: '#1e293b' }} />
            <ReferenceLine y={summary.median_target / 1000} stroke="#6366f1" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Median', fill: '#6366f1', fontSize: 10 }} />
            <Bar dataKey="mid" name="Midpoint" radius={[4, 4, 0, 0]}>
              {chartData.map((e, i) => <Cell key={i} fill={e.offer ? '#10b981' : '#6366f1'} opacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="text-[11px] text-slate-400">Target</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[11px] text-slate-400">Has offer</span></div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
        <h3 className="text-slate-800 font-medium text-sm mb-0.5">Negotiation Intelligence</h3>
        <p className="text-slate-400 text-[11px] mb-5">Per-job analysis</p>
        <div className="space-y-3">
          {job_breakdown.map(job => (
            <div key={job.id} className={`border rounded-xl p-4 transition-all ${job.offer_received ? 'border-emerald-100 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-start justify-between gap-4 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-800 font-medium text-sm">{job.company}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${job.status === 'offer' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : job.status === 'interview' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>{job.status}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{job.role}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-slate-600 text-sm font-medium">{job.salary_min && job.salary_max ? `${fmt(job.salary_min)} - ${fmt(job.salary_max)}` : fmt(job.salary_min || job.salary_max)}</p>
                  <p className="text-slate-400 text-[11px]">target</p>
                </div>
              </div>
              {job.percentile !== null && <PercentileBar value={job.percentile} label="Percentile vs targets" color="#6366f1" />}
              {job.offer_received && (
                <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-600 text-sm font-medium">Offer: {fmtFull(job.offer_received)}</span>
                    {job.counter_offer && <span className="text-amber-600 text-sm font-medium">Counter: {fmtFull(job.counter_offer)}</span>}
                  </div>
                  {job.negotiation_note && <p className="text-slate-500 text-xs">{job.negotiation_note}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
