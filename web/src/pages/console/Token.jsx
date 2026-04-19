/* EASTCREA v4 — Token Management */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getTokens, createToken, updateToken, deleteToken } from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'
import Modal from '../../components/Modal.jsx'

const STATUS = { 1: { label: '启用', cls: 'success' }, 2: { label: '停用', cls: 'warn' }, 3: { label: '已过期', cls: 'warn' }, 4: { label: '已耗尽', cls: 'warn' } }

const fmtQuota = (q) => q != null ? '$' + (q / 500000).toFixed(2) : '—'

function maskKey(key) {
  if (!key) return '—'
  return key.slice(0, 10) + '···' + key.slice(-4)
}

const DEFAULT_FORM = { name: '', remain_quota: 0, unlimited_quota: false, expired_time: -1, models: '', subnet: '', group: '' }

export default function Token() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copyMsg, setCopyMsg] = useState({})

  const load = useCallback(() => {
    setLoading(true)
    getTokens({ p: page, page_size: 20 })
      .then(r => { if (r.success) setTokens(r.data?.items || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const filtered = tokens.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.group?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditingId(t.id)
    setForm({
      name: t.name || '',
      remain_quota: t.remain_quota || 0,
      unlimited_quota: t.unlimited_quota || false,
      expired_time: t.expired_time ?? -1,
      models: t.models || '',
      subnet: t.subnet || '',
      group: t.group || '',
    })
    setError('')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('请输入令牌名称'); return }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        remain_quota: form.unlimited_quota ? 0 : Number(form.remain_quota) * 500000,
      }
      if (editingId) {
        const r = await updateToken(editingId, payload)
        if (!r.success) { setError(r.message || '更新失败'); return }
      } else {
        const r = await createToken(payload)
        if (!r.success) { setError(r.message || '创建失败'); return }
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (t) => {
    const newStatus = t.status === 1 ? 2 : 1
    await updateToken(t.id, { status: newStatus }).catch(() => {})
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除此令牌？删除后无法恢复。')) return
    await deleteToken(id).catch(() => {})
    load()
  }

  const copyKey = async (t) => {
    try {
      await navigator.clipboard.writeText(t.key || '')
      setCopyMsg(m => ({ ...m, [t.id]: 'copied' }))
      setTimeout(() => setCopyMsg(m => ({ ...m, [t.id]: '' })), 1400)
    } catch { /* ignore */ }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setCheck = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.checked }))

  return (
    <ConsoleLayout
      kicker="Console / 令牌管理"
      subtitle="集中管理访问凭证、额度、分组与权限"
      actions={
        <button className="button tiny primary" onClick={openCreate}>添加令牌</button>
      }
    >
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Tokens · {tokens.length} 条</span>
            <h2 className="panel-title">令牌列表</h2>
          </div>
          <div className="toolbar-group">
            <input
              className="searchbox"
              placeholder="查询名称、分组"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无令牌</h3>
            <p>点击"添加令牌"创建您的第一个 API 访问凭证。</p>
            <button className="button primary" onClick={openCreate}>添加令牌</button>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>名称</th>
                  <th>状态</th>
                  <th>剩余额度 / 总额度</th>
                  <th>分组</th>
                  <th>密钥</th>
                  <th>可用模型</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const st = STATUS[t.status] || { label: '未知', cls: '' }
                  return (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>
                        {t.unlimited_quota ? '无限额度' : `${fmtQuota(t.remain_quota)} / ${fmtQuota(t.remain_quota + (t.used_quota || 0))}`}
                      </td>
                      <td>{t.group || 'default'}</td>
                      <td>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{maskKey(t.key)}</span>
                        {' '}
                        <button
                          className="button tiny"
                          style={{ minHeight: 28, padding: '0 10px', fontSize: 12 }}
                          onClick={() => copyKey(t)}
                        >
                          {copyMsg[t.id] || '复制'}
                        </button>
                      </td>
                      <td style={{ maxWidth: 200 }}>
                        <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                          {t.models ? t.models.split(',').slice(0, 2).join(', ') + (t.models.split(',').length > 2 ? '…' : '') : '全部模型'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="button tiny" onClick={() => openEdit(t)}>编辑</button>
                          <button className="button tiny" onClick={() => handleToggle(t)}>
                            {t.status === 1 ? '停用' : '启用'}
                          </button>
                          <button className="button tiny warn" onClick={() => handleDelete(t.id)}>删除</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '编辑令牌' : '添加令牌'}
        footer={
          <>
            <button className="button" onClick={() => setModalOpen(false)}>取消</button>
            <button className="button primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="loading-spinner" /> : '保存'}
            </button>
          </>
        }
      >
        {error && <div className="notice warn" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="form-stack">
          <div className="field">
            <label>令牌名称</label>
            <input placeholder="请输入令牌名称" value={form.name} onChange={set('name')} />
          </div>

          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={form.unlimited_quota} onChange={setCheck('unlimited_quota')} style={{ width: 'auto' }} />
              无限额度
            </label>
          </div>

          {!form.unlimited_quota && (
            <div className="field">
              <label>额度（USD）</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={form.remain_quota}
                onChange={set('remain_quota')}
              />
              <span className="field-note">将被转换为系统配额单位</span>
            </div>
          )}

          <div className="field">
            <label>可用模型（逗号分隔，留空表示全部）</label>
            <input placeholder="gpt-4o, claude-3-7-sonnet" value={form.models} onChange={set('models')} />
          </div>

          <div className="field">
            <label>分组</label>
            <input placeholder="default" value={form.group} onChange={set('group')} />
          </div>

          <div className="field">
            <label>过期时间（留空表示永不过期）</label>
            <input
              type="datetime-local"
              value={form.expired_time > 0 ? new Date(form.expired_time * 1000).toISOString().slice(0, 16) : ''}
              onChange={e => setForm(f => ({ ...f, expired_time: e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : -1 }))}
            />
          </div>
        </div>
      </Modal>
    </ConsoleLayout>
  )
}
