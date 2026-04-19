/* EASTCREA v4 — Personal Settings */
import { useState } from 'react'
import { updateSelf } from '../../api.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const ROLES = { 1: '普通用户', 10: '管理员', 100: '超级管理员' }

export default function Personal() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({
    display_name: user?.display_name || user?.username || '',
    email: user?.email || '',
    original_password: '',
    password: '',
    password2: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.password2) { setError('两次密码不一致'); return }
    if (form.password && form.password.length < 8) { setError('密码至少 8 位'); return }
    if (form.password && !form.original_password) { setError('修改密码时请输入当前密码'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = { display_name: form.display_name }
      if (form.password) {
        payload.original_password = form.original_password
        payload.password = form.password
      }
      const res = await updateSelf(payload)
      if (res.success) {
        setSuccess('资料更新成功')
        setForm(f => ({ ...f, original_password: '', password: '', password2: '' }))
        refresh()
      } else {
        setError(res.message || '更新失败')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ConsoleLayout
      kicker="Console / 个人设置"
      subtitle="账户、绑定、安全与偏好设置"
      actions={
        <button className="button tiny primary" onClick={handleSave} disabled={saving}>
          {saving ? <span className="loading-spinner" /> : '保存更改'}
        </button>
      }
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span className="mini-label">Profile</span>
          <h3>用户名</h3>
          <span className="stat-value" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{user?.display_name || user?.username}</span>
          <p>{ROLES[user?.role] || '普通用户'}</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Balance</span>
          <h3>当前余额</h3>
          <span className="stat-value">${((user?.quota || 0) / 500000).toFixed(2)}</span>
          <p>可用额度</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Binding</span>
          <h3>邮箱绑定</h3>
          <span className="stat-value" style={{ fontSize: 20, letterSpacing: '-0.01em' }}>
            {user?.email ? '已绑定' : '未绑定'}
          </span>
          <p>{user?.email || '尚未绑定邮箱'}</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Security</span>
          <h3>账户状态</h3>
          <span className="stat-value" style={{ fontSize: 22 }}>
            {user?.status === 1 ? '正常' : '已禁用'}
          </span>
          <p>当前会话有效</p>
        </article>
      </section>

      <section className="split-2">
        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Account</span>
              <h2 className="panel-title">编辑账户信息</h2>
            </div>
          </div>
          {error && <div className="notice warn">{error}</div>}
          {success && <div className="notice success">{success}</div>}
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="field">
                <label>显示名称</label>
                <input value={form.display_name} onChange={set('display_name')} placeholder={user?.username} />
              </div>
              <div className="field">
                <label>联系邮箱</label>
                <input type="email" value={form.email} readOnly placeholder="请通过绑定流程修改邮箱" />
                <span className="field-note">当前后端版本不支持在此页面直接修改邮箱</span>
              </div>
              <div className="field">
                <label>当前密码</label>
                <input type="password" value={form.original_password} onChange={set('original_password')} placeholder="修改密码时必填" autoComplete="current-password" />
              </div>
              <div className="field">
                <label>新密码（留空不修改）</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="至少 8 位" autoComplete="new-password" />
              </div>
              <div className="field">
                <label>确认新密码</label>
                <input type="password" value={form.password2} onChange={set('password2')} placeholder="再次输入密码" autoComplete="new-password" />
              </div>
            </div>
            <div className="button-row" style={{ marginTop: 16 }}>
              <button className="button primary" type="submit" disabled={saving}>
                {saving ? <span className="loading-spinner" /> : '保存更改'}
              </button>
            </div>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Info</span>
              <h2 className="panel-title">账户详情</h2>
            </div>
          </div>
          <div className="kpi-list">
            <div className="mini-stat"><span>用户名</span><strong>{user?.username}</strong></div>
            <div className="mini-stat"><span>用户 ID</span><strong>{user?.id}</strong></div>
            <div className="mini-stat"><span>角色</span><strong>{ROLES[user?.role] || '普通用户'}</strong></div>
            <div className="mini-stat"><span>分组</span><strong>{user?.group || 'default'}</strong></div>
            <div className="mini-stat"><span>当前余额</span><strong>${(user?.quota / 500000).toFixed(4)}</strong></div>
            <div className="mini-stat"><span>历史消耗</span><strong>${(user?.used_quota / 500000).toFixed(4)}</strong></div>
            <div className="mini-stat"><span>请求次数</span><strong>{user?.request_count || 0}</strong></div>
            <div className="mini-stat"><span>账户状态</span><strong>{user?.status === 1 ? '正常' : '已禁用'}</strong></div>
          </div>
        </article>
      </section>
    </ConsoleLayout>
  )
}
