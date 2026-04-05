import { useState, useEffect } from 'react'
import client from '../api/client'

export function useAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/analytics/sources')
      .then(res => setData(res.data))
      .catch(err => console.error('Analytics fetch failed', err))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}