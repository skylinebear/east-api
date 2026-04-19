/* EASTCREA v4 — Redemption Management (Admin) */
import { useState, useEffect, useCallback } from 'react'
import { getRedemptions, createRedemption, deleteRedemption } from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'
import Modal from '../../components/Modal.jsx'

const STATUS = { 1: { label: '未使用', cls: 'success' }, 2: { label: '已使用', cls: '' }, 3: { label: '已停用', cls: 'warn' } }

export default function Redemption() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', quota: 100, count: 1 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copyMsg, setCopyMsg] = useState({})

  const load = useCallback(() => {
    setLoading(true)
    getRedemptions({ p: page, page_size: 20 })
      .then(r => { if (r.success) setItems(r.data?.items || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!form.name.trim()) { setError('请输入名称'); return }
    setSaving(true)
    setError('')
    try {
      const r = await createRedemption({ name: form.name, quota: Math.round(parseFloat(form.quota) * 500000), count: Number(form.count) })
      if (!r.success) { setError(r.message || '创建失败'); return }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除此兑换码？')) return
    await deleteRedemption(id).catch(() => {})
    load()
  }

  const copyKey = async (item) => {
    try {
      await navigator.clipboard.writeText(item.key || '')
      setCopyMsg(m => ({ ...m, [item.id]: 'copied' }))
      setTimeout(() => setCopyMsg(m => ({ ...m, [item.id]: '' })), 1400)
    } catch { /* ignore */ }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <ConsoleLayout
      kicker="Console / 兑换码管理"
      subtitle="创建和管理账户充值兑换码"
      actions={
        <button className="button tiny primary" onClick={() => { setForm({ name: '', quota: 100, count: 1 }); setError(''); setModalOpen(true) }}>
          创建兑换码
        </button>
      }
    >
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Redemptions · {items.length} 条</span>
            <h2 className="panel-title">兑换码列表</h2>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : items.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无兑换码</h3>
            <p>点击"创建兑换码"生成新的充值码。</p>
            <button className="button primary" onClick={() => setModalOpen(true)}>创建兑换码</button>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>名称</th>
                  <th>状态</th>
                  <th>面值</th>
                  <th>兑换码</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const st = STATUS[item.status] || { label: '未知', cls: '' }
                  return (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>${(item.quota / 500000).toFixed(2)}</td>
                      <td>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                          {item.key ? item.key.slice(0, 16) + '…' : '—'}
                        </span>
                        {' '}
                        {item.key && (
                          <button className="button tiny" style={{ minHeight: 28, padding: '0 10px', fontSize: 12 }} onClick={() => copyKey(item)}>
                            {copyMsg[item.id] || '复制'}
                          </button>
                        )}
                      </td>
                      <td>
                        <button className="button tiny warn" onClick={() => handleDelete(item.id)}>删除</button>
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
          {items.length >= 20 && <button className="button tiny" onClick={() => setPage(p => p + 1)}>下一页</button>}
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="创建兑换码"
        footer={
          <>
            <button className="button" onClick={() => setModalOpen(false)}>取消</button>
            <button className="button primary" onClick={handleCreate} disabled={saving}>
              {saving ? <span className="loading-spinner" /> : '创建'}
            </button>
          </>
        }
      >
        {error && <div className="notice warn" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="form-stack">
          <div className="field">
            <label>名称</label>
            <input placeholder="请输入兑换码名称" value={form.name} onChange={set('name')} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>面值（USD）</label>
              <input type="number" step="0.01" min="0" value={form.quota} onChange={set('quota')} />
            </div>
            <div className="field">
              <label>生成数量</label>
              <input type="number" min="1" max="100" value={form.count} onChange={set('count')} />
            </div>
          </div>
        </div>
      </Modal>
    </ConsoleLayout>
  )
}
