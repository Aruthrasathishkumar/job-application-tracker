import axios from 'axios'

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = 'Unable to connect to server. Please check that the backend is running.'
    } else if (error.response.status === 0) {
      error.friendlyMessage = 'Request blocked by CORS. Check backend configuration.'
    } else {
      error.friendlyMessage = error.response.data?.detail || `Request failed (${error.response.status})`
    }
    return Promise.reject(error)
  }
)

export default client
