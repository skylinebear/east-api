/* EASTCREA v4 — Login Page */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../api.js'
import { useAuth } from '../hooks/useAuth.jsx'
import Layout from '../components/Layout.jsx'

export default function Login() {
  const { setUser } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      if (res.success) {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
        window.location.href = '/console'
      } else {
        setError(res.message || '登录失败，请检查用户名和密码')
      }
    } catch (err) {
      setError(err.message || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <main className="public-main auth-shell">
        <section className="auth-card">
          <div className="brand-lockup">
            <img src="/logo.png" alt="EASTCREA icon" />
            <div>
              <span className="mini-label">EASTCREA</span>
              <h1>登录</h1>
            </div>
          </div>
          <p>使用用户名或邮箱继续进入工作台。</p>

          {error && <div className="notice warn" style={{ marginTop: 16 }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">用户名或邮箱</label>
              <input
                id="username"
                placeholder="请输入用户名或邮箱"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
            </div>

            <button className="button primary" type="submit" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : '继续'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/reset">忘记密码？</Link>
            <Link to="/register">没有账户？ 注册</Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
