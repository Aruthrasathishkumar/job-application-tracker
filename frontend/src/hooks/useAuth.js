import { useState, useEffect } from 'react'
import client from '../api/client'

function saveToChrome(token) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ job_tracker_token: token })
  }
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check Google OAuth redirect first
    const urlParams = new URLSearchParams(window.location.search)
    const googleToken = urlParams.get('token')
    const googleEmail = urlParams.get('email')

    if (googleToken && googleEmail) {
      localStorage.setItem('token', googleToken)
      localStorage.setItem('user', JSON.stringify({ email: googleEmail }))
      client.defaults.headers.Authorization = `Bearer ${googleToken}`
      saveToChrome(googleToken)  // ← saves token for extension
      window.history.replaceState({}, '', window.location.pathname)
      setUser({ email: googleEmail })
      setLoading(false)
      return
    }

    // Existing email/password token check
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
      client.defaults.headers.Authorization = `Bearer ${token}`
      saveToChrome(token)  // ← ensures extension always has latest token
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify({
      id: res.data.user_id,
      email: res.data.email
    }))
    client.defaults.headers.Authorization = `Bearer ${res.data.token}`
    saveToChrome(res.data.token)  // ← saves token for extension
    setUser({ id: res.data.user_id, email: res.data.email })
    return res.data
  }

  const register = async (email, password) => {
    const res = await client.post('/auth/register', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify({
      id: res.data.user_id,
      email: res.data.email
    }))
    client.defaults.headers.Authorization = `Bearer ${res.data.token}`
    saveToChrome(res.data.token)  // ← saves token for extension
    setUser({ id: res.data.user_id, email: res.data.email })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    client.defaults.headers.Authorization = null
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove('job_tracker_token')  // ← clears on logout
    }
    setUser(null)
  }

  return { user, loading, login, register, logout }
}