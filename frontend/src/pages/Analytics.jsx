import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, FunnelChart, Funnel, LabelList
} from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'

const SOURCE_COLORS = {
  cold: '#6366f1', linkedin: '#0ea5e9', alumni: '#10b981',
  referral: '#f59e0b', recruiter: '#ec4899',
}
const FUNNEL_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
      <p className="text-slate-400 text-[11px] mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-slate-500 text-[11px] mt-1">{sub}</p>}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-slate-400 font-medium mb-1 text-sm">No data yet</p>
      <p className="text-slate-500 text-xs max-w-xs">Add job applications and your analytics will appear here.</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-2.5 text-xs">
        <p className="text-slate-800 font-medium mb-1 capitalize">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.fill || p.color }} className="mb-0.5">{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const { data, loading } = useAnalytics()
  if (loading) return <div className="flex items-center justify-center py-24"><p className="text-slate-500 text-sm">Loading analytics...</p></div>
  if (!data || data.summary.total === 0) return <EmptyState />

  const { summary, by_source, overall_funnel } = data
  const responseRate = summary.total > 0 ? Math.round(summary.got_screening / summary.total * 100) : 0
  const interviewRate = summary.total > 0 ? Math.round(summary.got_interview / summary.total * 100) : 0
  const offerRate = summary.total > 0 ? Math.round(summary.got_offer / summary.total * 100) : 0
  const sortedSources = [...by_source].sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Applications" value={summary.total} color="text-slate-800" />
        <StatCard label="Response Rate" value={`${responseRate}%`} sub={`${summary.got_screening} responses`} color="text-blue-500" />
        <StatCard label="Interview Rate" value={`${interviewRate}%`} sub={`${summary.got_interview} interviews`} color="text-indigo-500" />
        <StatCard label="Offer Rate" value={`${offerRate}%`} sub={`${summary.got_offer} offers`} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <h3 className="text-slate-800 font-medium text-sm mb-0.5">Conversion Funnel</h3>
          <p className="text-slate-500 text-[11px] mb-5">Applications reaching each stage</p>
          <ResponsiveContainer width="100%" height={240}>
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel dataKey="count" data={overall_funnel} isAnimationActive label={{ fill: '#94a3b8', fontSize: 11 }}>
                {overall_funnel.map((_, i) => <Cell key={i} fill={FUNNEL_COLORS[i]} />)}
                <LabelList position="center" fill="#fff" fontSize={12} fontWeight={600} formatter={v => v} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2">
            {overall_funnel.map((s, i) => (
              <div key={s.stage} className="text-center">
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ background: FUNNEL_COLORS[i] }} />
                <p className="text-slate-500 text-[11px]">{s.stage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <h3 className="text-slate-800 font-medium text-sm mb-0.5">By Source</h3>
          <p className="text-slate-500 text-[11px] mb-5">Where your opportunities come from</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sortedSources} barSize={28}>
              <XAxis dataKey="source" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v.charAt(0).toUpperCase() + v.slice(1)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                {sortedSources.map(e => <Cell key={e.source} fill={SOURCE_COLORS[e.source] || '#6366f1'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {sortedSources.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <h3 className="text-slate-800 font-medium text-sm mb-0.5">Source Performance</h3>
          <p className="text-slate-500 text-[11px] mb-5">Which sources are worth your time</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Source', 'Total', 'Screen', 'Interview', 'Offer', 'Rejected', 'Int. Rate', 'Offer Rate'].map(h => (
                    <th key={h} className="text-left text-[11px] text-slate-500 font-medium pb-3 pr-5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedSources.map(row => (
                  <tr key={row.source} className="border-b border-slate-50">
                    <td className="py-2.5 pr-5"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: SOURCE_COLORS[row.source] || '#6366f1' }} /><span className="text-slate-800 font-medium capitalize text-sm">{row.source}</span></div></td>
                    <td className="py-2.5 pr-5 text-slate-600">{row.total}</td>
                    <td className="py-2.5 pr-5 text-blue-500">{row.screening}</td>
                    <td className="py-2.5 pr-5 text-indigo-500">{row.interview}</td>
                    <td className="py-2.5 pr-5 text-emerald-500">{row.offer}</td>
                    <td className="py-2.5 pr-5 text-red-500">{row.rejected}</td>
                    <td className="py-2.5 pr-5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.interview_rate > 30 ? 'bg-emerald-50 text-emerald-600' : row.interview_rate > 10 ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-400'}`}>{row.interview_rate}%</span></td>
                    <td className="py-2.5 pr-5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.conversion_rate > 20 ? 'bg-emerald-50 text-emerald-600' : row.conversion_rate > 5 ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-400'}`}>{row.conversion_rate}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-indigo-600 text-xs leading-relaxed">
              <span className="font-medium">Insight: </span>
              {sortedSources.length > 0 && (() => {
                const best = [...sortedSources].sort((a, b) => b.interview_rate - a.interview_rate)[0]
                return best.interview_rate > 0
                  ? `Your best source is "${best.source}" with a ${best.interview_rate}% interview rate.`
                  : 'Add more applications to unlock source insights.'
              })()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
