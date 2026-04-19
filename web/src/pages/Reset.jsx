/* East API — Reset Password */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail, resetPassword } from '../api.js'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Reset() {
  const { brandName, brandLogo } = useAuth()
  const [step, setStep] = useState(1) // 1: send email, 2: reset
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({ email: '', token: '', new_password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    if (!email) { setError('请输入邮箱'); return }
    setLoading(true)
    setError('')
    try {
      const res = await sendPasswordResetEmail(email)
      if (res.success) {
        setSuccess('重置邮件已发送，请查收邮箱中的链接')
        setStep(2)
        setForm(f => ({ ...f, email }))
      } else {
        setError(res.message || '发送失败')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!form.token || !form.new_password) { setError('请填写验证码和新密码'); return }
    if (form.new_password.length < 8) { setError('密码至少 8 位'); return }
    setLoading(true)
    setError('')
    try {
      const res = await resetPassword(form)
      if (res.success) {
        setSuccess('密码重置成功，请重新登录')
        setStep(3)
      } else {
        setError(res.message || '重置失败')
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
              <h1>重置密码</h1>
            </div>
          </div>

          {error && <div className="notice warn" style={{ marginTop: 16 }}>{error}</div>}
          {success && <div className="notice success" style={{ marginTop: 16 }}>{success}</div>}

          {step === 1 && (
            <>
              <p>输入您在 {brandName} 的账户邮箱，我们将发送重置链接。</p>
              <form className="auth-form" onSubmit={handleSend}>
                <div className="field">
                  <label>账户邮箱</label>
                  <input type="email" placeholder="请输入邮箱" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button className="button primary" type="submit" disabled={loading}>
                  {loading ? <span className="loading-spinner" /> : '发送重置邮件'}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <p>请输入邮件中的验证码并设置新的登录密码。</p>
              <form className="auth-form" onSubmit={handleReset}>
                <div className="field">
                  <label>验证码</label>
                  <input placeholder="邮件中的验证码" value={form.token} onChange={e => setForm(f => ({ ...f, token: e.target.value }))} />
                </div>
                <div className="field">
                  <label>新密码</label>
                  <input type="password" placeholder="至少 8 位" value={form.new_password} onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))} />
                </div>
                <button className="button primary" type="submit" disabled={loading}>
                  {loading ? <span className="loading-spinner" /> : '重置密码'}
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <p style={{ marginTop: 20 }}>密码重置成功，请 <Link to="/login" style={{ color: 'var(--blue)' }}>重新登录</Link>。</p>
          )}

          <div className="auth-links">
            <Link to="/login">返回登录</Link>
            <Link to="/register">注册账户</Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
