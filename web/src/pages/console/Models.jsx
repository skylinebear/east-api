/* EASTCREA v4 — Model Management (Admin) */
import { useState, useEffect } from 'react'
import { getAdminModels, updateModelConfig } from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'
import Modal from '../../components/Modal.jsx'

export default function Models() {
  const [models, setModels]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [editModel, setEditModel] = useState(null)
  const [form, setForm]           = useState({ model_ratio: '', completion_ratio: '', model_price: '', enable_model_ratio: false })
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')

  const load = () => {
    setLoading(true)
    getAdminModels({ p: 0, page_size: 200 })
      .then(r => {
        if (r.success) {
          const items = r.data?.items || []
          setModels(items)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = models.filter(m =>
    !search || m.id?.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (m) => {
    setEditModel(m)
    setForm({
      model_ratio: m.model_ratio ?? m.ratio ?? '',
      completion_ratio: m.completion_ratio ?? '',
      model_price: m.model_price ?? m.price ?? '',
      enable_model_ratio: m.enable_model_ratio ?? false,
    })
    setSaveMsg('')
  }

  const handleSave = async () => {
    if (!editModel) return
    setSaving(true); setSaveMsg('')
    try {
      const payload = {
        model: editModel.id,
        model_ratio: parseFloat(form.model_ratio) || 0,
        completion_ratio: parseFloat(form.completion_ratio) || 0,
        model_price: parseFloat(form.model_price) || 0,
        enable_model_ratio: form.enable_model_ratio,
      }
      const r = await updateModelConfig(payload)
      if (!r.success) { setSaveMsg(r.message || '保存失败'); return }
      setSaveMsg('已保存')
      setEditModel(null)
      load()
    } catch (err) {
      setSaveMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  return (
    <ConsoleLayout
      kicker="Console / 模型管理"
      subtitle="查看并配置网关可用模型的定价倍率"
    >
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Models · {models.length} 个</span>
            <h2 className="panel-title">模型列表</h2>
          </div>
          <input
            className="searchbox"
            placeholder="搜索模型 ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无模型</h3>
            <p>请先在渠道管理中添加支持的模型。</p>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>模型 ID</th>
                  <th>所有者</th>
                  <th>提示词倍率</th>
                  <th>补全倍率</th>
                  <th>固定价格</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id || i}>
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{m.id}</span></td>
                    <td style={{ fontSize: 13 }}>{m.owned_by || '—'}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                      {m.model_ratio ?? m.ratio ?? '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                      {m.completion_ratio ?? '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                      {m.model_price ?? m.price ?? '—'}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {m.created ? new Date(m.created * 1000).toLocaleDateString('zh-CN') : '—'}
                    </td>
                    <td>
                      <button className="button tiny" onClick={() => openEdit(m)}>配置定价</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 价格配置面板 */}
      {editModel && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Price Config</span>
              <h2 className="panel-title">配置：<span style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>{editModel.id}</span></h2>
            </div>
            <button className="button tiny" onClick={() => setEditModel(null)}>关闭</button>
          </div>
          {saveMsg && (
            <div className={`notice ${saveMsg === '已保存' ? 'success' : 'warn'}`}>{saveMsg}</div>
          )}
          <div className="form-grid">
            <div className="field">
              <label>提示词倍率（Input Ratio）</label>
              <input type="number" step="0.001" value={form.model_ratio} onChange={set('model_ratio')} placeholder="1" />
              <span className="field-note">相对于基础 Token 单价的倍率</span>
            </div>
            <div className="field">
              <label>补全倍率（Completion Ratio）</label>
              <input type="number" step="0.001" value={form.completion_ratio} onChange={set('completion_ratio')} placeholder="1" />
              <span className="field-note">相对于提示词倍率的补全倍数</span>
            </div>
            <div className="field">
              <label>固定按次定价（每次请求）</label>
              <input type="number" step="0.000001" value={form.model_price} onChange={set('model_price')} placeholder="0" />
              <span className="field-note">按次收费时设置，0 表示按 Token 计算</span>
            </div>
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  checked={!!form.enable_model_ratio}
                  onChange={set('enable_model_ratio')}
                  style={{ width: 'auto' }}
                />
                启用模型价格倍率（覆盖全局设置）
              </label>
            </div>
          </div>
          <div className="button-row">
            <button className="button primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="loading-spinner" /> : '保存定价配置'}
            </button>
            <button className="button" onClick={() => setEditModel(null)}>取消</button>
          </div>
        </section>
      )}
    </ConsoleLayout>
  )
}
