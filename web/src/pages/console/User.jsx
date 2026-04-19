/* EASTCREA v4 — User Management (Admin) */
import { useState, useEffect, useCallback } from 'react'
import { getUsers, createUser, updateUser, deleteUser, manageUser } from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'
import Modal from '../../components/Modal.jsx'
import ActionMenu from '../../components/ActionMenu.jsx'

const STATUS = { 1: { label: '正常', cls: 'success' }, 2: { label: '已禁用', cls: 'warn' } }
const ROLES  = { 1: '普通用户', 10: '管理员', 100: '超级管理员' }

const DEFAULT_EDIT   = { display_name: '', password: '', quota: 0, group: 'default', role: 1 }
const DEFAULT_CREATE = { username: '', password: '', display_name: '', quota: 0, group: 'default', role: 1 }

export default function User() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode]           = useState('edit')   // 'edit' | 'create'
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm]           = useState(DEFAULT_EDIT)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const load = useCallback(() => {
    setLoading(true)
    getUsers({ p: page, page_size: 20 })
      .then(r => { if (r.success) setUsers(r.data?.items || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const filtered = users.filter(u =>
    !search ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setMode('create')
    setForm(DEFAULT_CREATE)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setMode('edit')
    setEditingUser(u)
    setForm({
      display_name: u.display_name || u.username || '',
      password: '',
      quota: (u.quota / 500000).toFixed(4),
      group: u.group || 'default',
      role: u.role || 1,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (mode === 'create') {
        if (!form.username?.trim() || !form.password?.trim()) {
          setError('用户名和密码为必填项'); setSaving(false); return
        }
        const r = await createUser({
          username: form.username,
          password: form.password,
          display_name: form.display_name,
          role: Number(form.role),
        })
        if (!r.success) { setError(r.message || '创建失败'); return }
      } else {
        if (!editingUser) return
        const payload = {
          display_name: form.display_name,
          group: form.group,
          role: Number(form.role),
          quota: Math.round(parseFloat(form.quota) * 500000),
        }
        if (form.password) payload.password = form.password
        const r = await updateUser(editingUser.id, payload)
        if (!r.success) { setError(r.message || '更新失败'); return }
      }
      setModalOpen(false); load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (u) => {
    await manageUser({ id: u.id, action: u.status === 1 ? 'disable' : 'enable' }).catch(() => {})
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除此用户？此操作不可恢复。')) return
    await deleteUser(id).catch(() => {}); load()
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <ConsoleLayout
      kicker="Console / 用户管理"
      subtitle="管理平台用户账户、分组、角色与额度"
      actions={
        <button className="button tiny primary" onClick={openCreate}>新增用户</button>
      }
    >
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Users · {users.length} 位</span>
            <h2 className="panel-title">用户列表</h2>
          </div>
          <input
            className="searchbox"
            placeholder="搜索用户名 / 显示名"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-card center"><h3>暂无用户</h3></div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>状态</th>
                  <th>余额</th>
                  <th>已消耗</th>
                  <th>请求次数</th>
                  <th>分组</th>
                  <th>角色</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const st = STATUS[u.status] || { label: '未知', cls: '' }
                  return (
                    <tr key={u.id}>
                      <td style={{ fontSize: 13 }}>{u.id}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <strong>{u.username}</strong>
                        {u.display_name && u.display_name !== u.username && (
                          <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}> ({u.display_name})</span>
                        )}
                      </td>
                      <td><span className={`badge ${st.cls}`} style={{ whiteSpace: 'nowrap' }}>{st.label}</span></td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>${(u.quota / 500000).toFixed(4)}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>${(u.used_quota / 500000).toFixed(4)}</td>
                      <td>{u.request_count || 0}</td>
                      <td style={{ fontSize: 13 }}>{u.group || 'default'}</td>
                      <td><span className="badge" style={{ whiteSpace: 'nowrap' }}>{ROLES[u.role] || '普通用户'}</span></td>
                      <td>
                        <ActionMenu items={[
                          { label: '编辑', onClick: () => openEdit(u) },
                          { label: u.status === 1 ? '禁用' : '启用', onClick: () => handleToggle(u) },
                          { label: '删除', onClick: () => handleDelete(u.id), danger: true },
                        ]} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="button-row">
          {page > 0 && <button className="button tiny" onClick={() => setPage(p => p - 1)}>上一页</button>}
          {users.length >= 20 && <button className="button tiny" onClick={() => setPage(p => p + 1)}>下一页</button>}
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={mode === 'create' ? '新增用户' : `编辑用户：${editingUser?.username}`}
        footer={
          <>
            <button className="button" onClick={() => setModalOpen(false)}>取消</button>
            <button className="button primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="loading-spinner" /> : (mode === 'create' ? '创建' : '保存')}
            </button>
          </>
        }
      >
        {error && <div className="notice warn" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="form-stack">
          {mode === 'create' && (
            <div className="field">
              <label>用户名</label>
              <input placeholder="login_name" value={form.username || ''} onChange={set('username')} />
            </div>
          )}
          <div className="field">
            <label>显示名称</label>
            <input value={form.display_name} onChange={set('display_name')} />
          </div>
          <div className="field">
            <label>
              {mode === 'create' ? '密码' : '新密码'}
              {mode === 'edit' && <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 6 }}>（留空不修改）</span>}
            </label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="至少 8 位" autoComplete="new-password" />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>角色</label>
              <select value={form.role} onChange={set('role')}>
                <option value={1}>普通用户</option>
                <option value={10}>管理员</option>
                <option value={100}>超级管理员</option>
              </select>
            </div>
            {mode === 'edit' && (
              <div className="field">
                <label>分组</label>
                <input value={form.group} onChange={set('group')} />
              </div>
            )}
          </div>
          {mode === 'edit' && (
            <div className="field">
              <label>额度（USD）</label>
              <input type="number" step="0.0001" value={form.quota} onChange={set('quota')} />
              <span className="field-note">1 USD = 500,000 单位额度</span>
            </div>
          )}
        </div>
      </Modal>
    </ConsoleLayout>
  )
}
