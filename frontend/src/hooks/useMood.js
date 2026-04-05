import { useState, useEffect } from 'react'
import client from '../api/client'

export function useMood() {
  const [trend, setTrend] = useState(null)
  const [loggedToday, setLoggedToday] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTrend = async () => {
    try {
      const [trendRes, todayRes] = await Promise.all([
        client.get('/mood/trend'),
        client.get('/mood/today')
      ])
      setTrend(trendRes.data)
      setLoggedToday(todayRes.data.logged_today)
    } catch (err) {
      console.error('Mood fetch failed', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrend() }, [])

  const logMood = async (score, jobId = null, triggerEvent = 'manual', note = '') => {
    const res = await client.post('/mood', {
      score,
      job_id: jobId,
      trigger_event: triggerEvent,
      note
    })
    await fetchTrend()
    setLoggedToday(true)
    return res.data
  }

  return { trend, loggedToday, loading, logMood, refetch: fetchTrend }
}