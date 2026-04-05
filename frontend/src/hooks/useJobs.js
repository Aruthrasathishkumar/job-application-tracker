import { useState, useEffect } from 'react'
import client from '../api/client'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    try {
      const res = await client.get('/jobs')
      setJobs(res.data)
    } catch (err) {
      console.error('Failed to fetch jobs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const addJob = async (jobData) => {
    const res = await client.post('/jobs', jobData)
    setJobs(prev => [res.data, ...prev])
    return res.data
  }

  const updateJob = async (jobId, updates) => {
    const res = await client.patch(`/jobs/${jobId}`, updates)
    setJobs(prev => prev.map(j => j.id === jobId ? res.data : j))
    return res.data
  }

  const deleteJob = async (jobId) => {
    await client.delete(`/jobs/${jobId}`)
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  return { jobs, loading, addJob, updateJob, deleteJob, refetch: fetchJobs }
}