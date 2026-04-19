/* East API — Initial Setup */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setupSystem } from '../api.js'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Setup() {
  const navigate = useNavigate()
  const { brandName, brandLogo } = useAuth()
  const [form, setForm] = useState({ username: '', password: '', password2: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setError('请填写完整信息'); return }
    if (form.password !== form.password2) { setError('两次密码不一致'); return }
    if (form.password.length < 8) { setError('密码至少 8 位'); return }
    setLoading(true)
    setError('')
    try {
      const data = await setupSystem({
        username: form.username,
        password: form.password,
        confirmPassword: form.password2,
        SelfUseModeEnabled: false,
        DemoSiteEnabled: false,
      })
      if (data.success) {
        navigate('/login')
      } else {
        setError(data.message || '初始化失败')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <main className="public-main auth-shell">
        <section className="auth-card">
          <div className="brand-lockup">
            <img src={brandLogo} alt={`${brandName} 标识`} />
            <div>
              <span className="mini-label">{brandName}</span>
              <h1>初始化设置</h1>
            </div>
          </div>
          <p>创建管理员账户，完成 {brandName} 的首次初始化。</p>
          {error && <div className="notice warn" style={{ marginTop: 16 }}>{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>管理员用户名</label>
              <input value={form.username} onChange={set('username')} placeholder="admin" autoComplete="username" />
            </div>
            <div className="field">
              <label>密码</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="至少 8 位" autoComplete="new-password" />
            </div>
            <div className="field">
              <label>确认密码</label>
              <input type="password" value={form.password2} onChange={set('password2')} placeholder="再次输入" autoComplete="new-password" />
            </div>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : '完成初始化'}
            </button>
          </form>
        </section>
      </main>
    </Layout>
  )
}
