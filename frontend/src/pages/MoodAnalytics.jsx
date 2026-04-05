import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { useMood } from '../hooks/useMood'

const SCORE_LABELS = { 1: 'Rough', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great' }
const SCORE_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#3b82f6' }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0].value
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-2.5 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-slate-800 font-medium">{score}/5 - {SCORE_LABELS[Math.round(score)] || 'Mixed'}</p>
      </div>
    )
  }
  return null
}

function MoodDot({ score }) {
  const BG_COLORS = { 1: 'bg-red-50', 2: 'bg-orange-50', 3: 'bg-yellow-50', 4: 'bg-green-50', 5: 'bg-blue-50' }
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${BG_COLORS[score] || 'bg-slate-50'}`}
      style={{ color: SCORE_COLORS[score] }}>
      {score}
    </div>
  )
}

export default function MoodAnalytics() {
  const { trend, loading } = useMood()

  if (loading) return <div className="flex items-center justify-center py-16"><p className="text-slate-500 text-sm">Loading mood data...</p></div>

  if (!trend || trend.total_logs === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">{'\uD83D\uDE0A'}</div>
        <p className="text-slate-400 font-medium mb-1 text-sm">No mood data yet</p>
        <p className="text-slate-500 text-xs max-w-xs">Use the daily check-in on the Board tab to start tracking.</p>
      </div>
    )
  }

  const { daily_average, seven_day_average, burnout_warning, burnout_message, logs } = trend

  return (
    <div className="space-y-5">
      {burnout_message && (
        <div className={`border rounded-xl p-4 ${burnout_warning ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{burnout_warning ? '\u26A0\uFE0F' : '\uD83D\uDC9B'}</span>
            <div>
              <p className={`font-medium text-sm mb-0.5 ${burnout_warning ? 'text-red-600' : 'text-yellow-600'}`}>
                {burnout_warning ? 'Burnout Risk Detected' : 'Mood Check'}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">{burnout_message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
          <p className="text-slate-400 text-[11px] mb-1.5">7-day average</p>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-slate-800">{seven_day_average ?? '\u2014'}</span>
            <span className="text-slate-500 text-xs">/ 5</span>
          </div>
          <p className="text-slate-500 text-[11px] mt-1">{seven_day_average ? SCORE_LABELS[Math.round(seven_day_average)] || 'Mixed' : 'No data'}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
          <p className="text-slate-400 text-[11px] mb-1.5">Total check-ins</p>
          <p className="text-xl font-bold text-slate-800">{trend.total_logs}</p>
          <p className="text-slate-500 text-[11px] mt-1">entries logged</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
          <p className="text-slate-400 text-[11px] mb-1.5">Burnout risk</p>
          <p className={`text-xl font-bold ${burnout_warning ? 'text-red-500' : 'text-emerald-500'}`}>
            {burnout_warning ? 'High' : seven_day_average < 3.2 ? 'Medium' : 'Low'}
          </p>
          <p className="text-slate-500 text-[11px] mt-1">based on 7-day avg</p>
        </div>
      </div>

      {daily_average.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <h3 className="text-slate-800 font-medium text-sm mb-0.5">Mood Timeline</h3>
          <p className="text-slate-500 text-[11px] mb-5">Daily average over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={daily_average}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(5)} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => SCORE_LABELS[v]} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4} />
              <Area type="monotone" dataKey="avg_score" name="Mood" stroke="#6366f1" strokeWidth={2} fill="url(#moodGrad)" dot={{ fill: '#6366f1', r: 3.5 }} activeDot={{ r: 5, fill: '#6366f1' }} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-slate-400 text-[11px] mt-2 text-center">Red dashed line = burnout threshold (2.5)</p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <h3 className="text-slate-800 font-medium text-sm mb-4">Recent Entries</h3>
          <div className="space-y-2">
            {[...logs].reverse().map(log => (
              <div key={log.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                <MoodDot score={log.score} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-800 text-sm font-medium">{SCORE_LABELS[log.score]}</p>
                    {log.trigger_event && <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{log.trigger_event.replace('_', ' ')}</span>}
                  </div>
                  {log.note && <p className="text-slate-400 text-xs mt-0.5">{log.note}</p>}
                </div>
                <p className="text-slate-400 text-[11px]">{new Date(log.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
