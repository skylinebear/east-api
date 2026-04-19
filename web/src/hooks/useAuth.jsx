/* East API — Brand-aware Auth Hook */
import { useState, useEffect, createContext, useContext } from 'react'
import { getSelf, logout as apiLogout, getStatus } from '../api.js'

const AuthContext = createContext(null)
const DEFAULT_BRAND_NAME = 'EASTCREA'
const DEFAULT_BRAND_LOGO = '/logo.png'

const resolveBrandName = (status) => status?.system_name?.trim() || DEFAULT_BRAND_NAME
const resolveBrandLogo = (status) => status?.logo?.trim() || DEFAULT_BRAND_LOGO

function upsertHeadLink(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

function applyBranding(status) {
  if (typeof document === 'undefined') return

  const brandName = resolveBrandName(status)
  const brandLogo = resolveBrandLogo(status)

  document.title = brandName
  upsertHeadLink('icon', brandLogo)
  upsertHeadLink('shortcut icon', brandLogo)
  upsertHeadLink('apple-touch-icon', brandLogo)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const brandName = resolveBrandName(status)
  const brandLogo = resolveBrandLogo(status)

  const refreshSelf = () =>
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

  const refreshStatus = () =>
    getStatus()
      .then(r => {
        if (r.success) setStatus(r.data)
      })
      .catch(() => {})

  useEffect(() => {
    Promise.all([refreshSelf(), refreshStatus()]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    applyBranding(status)
  }, [status])

  const logout = async () => {
    await apiLogout().catch(() => {})
    setUser(null)
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const refresh = () => Promise.all([refreshSelf(), refreshStatus()])

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      status,
      brandName,
      brandLogo,
      loading,
      logout,
      refresh,
      refreshStatus,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
