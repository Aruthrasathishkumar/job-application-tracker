import { useState, useEffect } from 'react'
import client from '../api/client'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
      client.defaults.headers.Authorization = `Bearer ${token}`
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
    setUser({ id: res.data.user_id, email: res.data.email })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return { user, loading, login, register, logout }
}