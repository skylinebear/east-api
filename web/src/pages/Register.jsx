/* East API — Register Page */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, sendEmailVerification } from '../api.js'
import { useAuth } from '../hooks/useAuth.jsx'
import Layout from '../components/Layout.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { status, brandName, brandLogo } = useAuth()
  const [form, setForm] = useState({ username: '', password: '', password2: '', email: '', verification_code: '', invitation_code: '' })
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const emailVerRequired = status?.email_verification

  const handleSendCode = async () => {
    if (!form.email) { setError('请先输入邮箱'); return }
    setSendingCode(true)
    setError('')
    try {
      const res = await sendEmailVerification(form.email)
      if (res.success) setSuccess('验证码已发送，请查收邮件')
      else setError(res.message || '发送失败')
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setError('请填写用户名和密码'); return }
    if (form.password !== form.password2) { setError('两次密码输入不一致'); return }
    if (form.password.length < 8) { setError('密码至少 8 位'); return }
    setLoading(true)
    setError('')
    try {
      const payload = {
        username: form.username,
        password: form.password,
        email: form.email,
        verification_code: form.verification_code,
        invitation_code: form.invitation_code,
      }
      const res = await register(payload)
      if (res.success) {
        navigate('/login')
      } else {
        setError(res.message || '注册失败')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <Layout>
      <main className="public-main auth-shell">
        <section className="auth-card">
          <div className="brand-lockup">
            <img src={brandLogo} alt={`${brandName} 标识`} />
            <div>
              <span className="mini-label">{brandName}</span>
              <h1>创建账户</h1>
            </div>
          </div>
          <p>创建账户，开始使用 {brandName} 工作台。</p>

          {error && <div className="notice warn" style={{ marginTop: 16 }}>{error}</div>}
          {success && <div className="notice success" style={{ marginTop: 16 }}>{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>用户名</label>
              <input placeholder="请输入用户名" value={form.username} onChange={set('username')} autoComplete="username" />
            </div>

            {emailVerRequired && (
              <>
                <div className="field">
                  <label>邮箱</label>
                  <input type="email" placeholder="请输入邮箱" value={form.email} onChange={set('email')} autoComplete="email" />
                </div>
                <div className="field">
                  <label>验证码</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                    <input placeholder="请输入验证码" value={form.verification_code} onChange={set('verification_code')} />
                    <button type="button" className="button tiny" onClick={handleSendCode} disabled={sendingCode}>
                      {sendingCode ? '发送中…' : '获取验证码'}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="field">
              <label>密码</label>
              <input type="password" placeholder="至少 8 位" value={form.password} onChange={set('password')} autoComplete="new-password" />
            </div>

            <div className="field">
              <label>确认密码</label>
              <input type="password" placeholder="再次输入密码" value={form.password2} onChange={set('password2')} autoComplete="new-password" />
            </div>

            <div className="field">
              <label>邀请码（可选）</label>
              <input placeholder="如有邀请码请填写" value={form.invitation_code} onChange={set('invitation_code')} />
            </div>

            <button className="button primary" type="submit" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : '创建账户'}
            </button>
          </form>

          <div className="auth-links">
            <span />
            <Link to="/login">已有账户？ 登录</Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
