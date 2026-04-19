/* EASTCREA v4 — API Client */
import axios from 'axios'

const API_BASE = '/api'

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
})

// Request interceptor – inject New-Api-User header required by backend auth middleware
client.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user')
  if (raw) {
    try {
      const u = JSON.parse(raw)
      if (u?.id) config.headers['New-Api-User'] = String(u.id)
    } catch {}
  }
  return config
})

// Response interceptor – normalize errors
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message || '请求失败'
    return Promise.reject(new Error(msg))
  }
)

/* ── Auth ──────────────────────────────── */
export const setupSystem = (data) => client.post('/setup', data)
export const login = (data) => client.post('/user/login', data)
export const register = (data) => client.post('/user/register', data)
export const logout = () => client.get('/user/logout')
export const getSelf = () => client.get('/user/self')
export const updateSelf = (data) => client.put('/user/self', data)
export const changePassword = (data) => client.put('/user/self', data)
export const getStatus = () => client.get('/status')
export const sendEmailVerification = (email) => client.get(`/verification?email=${encodeURIComponent(email)}`)
export const sendPasswordResetEmail = (email) => client.get(`/reset_password?email=${encodeURIComponent(email)}`)
export const resetPassword = (data) => client.post('/user/reset', data)

/* ── Tokens ────────────────────────────── */
export const getTokens = (params) => client.get('/token/', { params })
export const createToken = (data) => client.post('/token/', data)
export const updateToken = (id, data) => client.put('/token/', { ...data, id: Number(id) })
export const deleteToken = (id) => client.delete(`/token/${id}`)
export const getTokenByKey = (key) => client.get(`/token/search?key=${encodeURIComponent(key)}`)

/* ── Logs ──────────────────────────────── */
export const getLogs = (params) => client.get('/log/', { params })
export const getSelfLogs = (params) => client.get('/log/self', { params })

/* ── Models ────────────────────────────── */
export const getModels = () => client.get('/models')
export const getAdminModels = (params) => client.get('/models/', { params })
export const updateModelConfig = (data) => client.put('/models/', data)

/* ── Dashboard ─────────────────────────── */
export const getUserDashboard = (params) => client.get('/data/self', { params })
export const getAdminDashboard = (params) => client.get('/data/', { params })

/* ── Topup ──────────────────────────────── */
export const topUp = (key) => client.post('/user/topup', { key })
export const getTopUpInfo = () => client.get('/user/topup/info')

/* ── Admin – Channels ───────────────────── */
export const getChannels = (params) => client.get('/channel/', { params })
export const createChannel = (data) => client.post('/channel/', data)
export const updateChannel = (id, data) => client.put('/channel/', { ...data, id: Number(id) })
export const deleteChannel = (id) => client.delete(`/channel/${id}`)
export const testChannel = (id) => client.get(`/channel/test/${id}`)
export const testAllChannels = () => client.get('/channel/test')
export const updateChannelBalance = (id) => client.get(`/channel/update_balance/${id}`)
export const copyChannel = (id) => client.post(`/channel/copy/${id}`)

/* ── Admin – Users ──────────────────────── */
export const getUsers = (params) => client.get('/user/', { params })
export const createUser = (data) => client.post('/user/', data)
export const updateUser = (id, data) => client.put('/user/', { ...data, id: Number(id) })
export const deleteUser = (id) => client.delete(`/user/${id}`)
export const manageUser = (data) => client.post('/user/manage', data)

/* ── Admin – Redemption ─────────────────── */
export const getRedemptions = (params) => client.get('/redemption/', { params })
export const createRedemption = (data) => client.post('/redemption/', data)
export const deleteRedemption = (id) => client.delete(`/redemption/${id}`)
export const useRedemption = (key) => client.post('/user/topup', { key })

/* ── Admin – Options ────────────────────── */
export const getOptions = () => client.get('/option/')
export const updateOption = (data) => client.put('/option/', data)

/* ── Admin – Log Cleanup ────────────────── */
export const cleanHistoryLogs = (timestamp) => client.delete(`/log/?target_timestamp=${timestamp}`)

/* ── Admin – Performance ────────────────── */
export const getPerfStats = () => client.get('/performance/stats')
export const getPerfLogs = () => client.get('/performance/logs')
export const clearDiskCache = () => client.delete('/performance/disk_cache')
export const resetPerfStats = () => client.post('/performance/reset_stats')
export const forceGC = () => client.post('/performance/gc')
export const cleanPerfLogs = (mode, value) => client.delete(`/performance/logs?mode=${mode}&value=${value}`)

/* ── Midjourney ────────────────────────── */
export const getMjTasks = (params, admin = false) => client.get(admin ? '/mj/' : '/mj/self', { params })

/* ── Task ──────────────────────────────── */
export const getTasks = (params, admin = false) => client.get(admin ? '/task/' : '/task/self', { params })

/* ── Subscription ──────────────────────── */
export const getSubscription = () => client.get('/subscription/self')

/* ── Helper: quota format ──────────────── */
export const quotaToUSD = (quota, perUnit = 500000) =>
  (quota / perUnit).toFixed(2)

export default client
