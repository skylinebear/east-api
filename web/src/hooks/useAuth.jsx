/* EASTCREA v4 — Auth Hook */
import { useState, useEffect, createContext, useContext } from 'react'
import { getSelf, logout as apiLogout, getStatus } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSelf().then(r => {
        if (r.success) {
          setUser(r.data)
          localStorage.setItem('user', JSON.stringify(r.data))
        }
      }).catch(() => {}),
      getStatus().then(r => { if (r.success) setStatus(r.data) }).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await apiLogout().catch(() => {})
    setUser(null)
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const refresh = () =>
    getSelf()
      .then(r => {
        if (r.success) {
          setUser(r.data)
          localStorage.setItem('user', JSON.stringify(r.data))
        }
      })
      .catch(() => {
        setUser(null)
        localStorage.removeItem('user')
      })

  return (
    <AuthContext.Provider value={{ user, setUser, status, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
