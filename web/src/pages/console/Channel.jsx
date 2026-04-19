/* EASTCREA v4 — Channel Management (Admin) */
import { useState, useEffect, useCallback } from 'react'
import {
  getChannels, createChannel, updateChannel, deleteChannel,
  testChannel, testAllChannels, updateChannelBalance, copyChannel,
} from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'
import Modal from '../../components/Modal.jsx'
import ActionMenu from '../../components/ActionMenu.jsx'

const STATUS = {
  1: { label: '启用', cls: 'success' },
  2: { label: '停用', cls: 'warn' },
  3: { label: '错误', cls: 'warn' },
}

const CHANNEL_TYPES = [
  { value: 0,  label: 'OpenAI' },
  { value: 1,  label: 'Azure OpenAI' },
  { value: 4,  label: 'OpenAI 兼容（自定义）' },
  { value: 14, label: 'Anthropic Claude' },
  { value: 26, label: 'AWS Bedrock (Claude)' },
  { value: 11, label: 'Google Gemini' },
  { value: 13, label: 'Google Vertex AI' },
  { value: 28, label: 'DeepSeek' },
  { value: 24, label: 'Tongyi Qianwen (阿里通义)' },
  { value: 17, label: 'Moonshot (Kimi)' },
  { value: 9,  label: 'Zhipu AI (智谱 GLM)' },
  { value: 38, label: 'Tencent Hunyuan (腾讯混元)' },
  { value: 15, label: 'Baidu Wenxin (百度文心)' },
  { value: 37, label: 'Baichuan AI (百川)' },
  { value: 31, label: 'MiniMax' },
  { value: 30, label: 'Bytedance Doubao (字节豆包)' },
  { value: 46, label: 'Lingyiwanwu (零一万物)' },
  { value: 25, label: 'Stepfun (阶跃星辰)' },
  { value: 32, label: '360 AI' },
  { value: 18, label: 'iFlytek SparkDesk (讯飞星火)' },
  { value: 22, label: 'Mistral AI' },
  { value: 23, label: 'Groq' },
  { value: 34, label: 'Cohere' },
  { value: 29, label: 'Together AI' },
  { value: 36, label: 'Novita AI' },
  { value: 35, label: 'Stability AI' },
  { value: 39, label: 'Ollama (本地部署)' },
  { value: 40, label: 'Replicate' },
  { value: 41, label: 'SiliconFlow (硅基流动)' },
  { value: 42, label: 'Midjourney Proxy' },
  { value: 43, label: 'Suno' },
  { value: 44, label: 'Kling (快手可灵)' },
  { value: 45, label: 'Runway' },
  { value: 27, label: 'Coze' },
]

const typeName = (type) =>
  CHANNEL_TYPES.find(t => t.value === type)?.label || `类型 ${type}`


const DEFAULT_FORM = {
  name: '', type: 0, key: '', base_url: '', models: '',
  group: 'default', priority: 0, weight: 0,
}

export default function Channel() {
  const [channels, setChannels]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState('all')
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingId, setEditingId]     = useState(null)
  const [form, setForm]               = useState(DEFAULT_FORM)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [testMsg, setTestMsg]         = useState({})
  const [balMsg, setBalMsg]           = useState({})
  const [page, setPage]               = useState(0)
  const [testingAll, setTestingAll]   = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getChannels({ p: page, page_size: 20 })
      .then(r => { if (r.success) setChannels(r.data?.items || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const filtered = channels.filter(c => {
    if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) && !c.group?.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && String(c.type) !== typeFilter) return false
    return true
  })

  const openCreate = () => { setEditingId(null); setForm(DEFAULT_FORM); setError(''); setModalOpen(true) }

  const openEdit = (c) => {
    setEditingId(c.id)
    setForm({
      name: c.name || '', type: c.type || 0, key: '',
      base_url: c.base_url || '',
      models: Array.isArray(c.models) ? c.models.join(',') : (c.models || ''),
      group: c.group || 'default',
      priority: c.priority || 0,
      weight: c.weight || 0,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || (!form.key.trim() && !editingId)) {
      setError('请填写渠道名称和密钥'); return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        type: Number(form.type),
        priority: Number(form.priority),
        weight: Number(form.weight),
        models: form.models ? form.models.split(',').map(m => m.trim()).filter(Boolean) : [],
      }
      if (!payload.key && editingId) delete payload.key
      const r = editingId ? await updateChannel(editingId, payload) : await createChannel(payload)
      if (!r.success) { setError(r.message || '保存失败'); return }
      setModalOpen(false); load()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleTest = async (id) => {
    setTestMsg(m => ({ ...m, [id]: '测试中…' }))
    try {
      const r = await testChannel(id)
      setTestMsg(m => ({ ...m, [id]: r.success ? `✓ ${r.data || '正常'}` : `✗ ${r.message}` }))
    } catch (err) { setTestMsg(m => ({ ...m, [id]: `✗ ${err.message}` })) }
  }

  const handleTestAll = async () => {
    setTestingAll(true)
    try { await testAllChannels() } catch { /* ignore */ }
    setTimeout(() => { setTestingAll(false); load() }, 1200)
  }

  const handleBalance = async (id) => {
    setBalMsg(m => ({ ...m, [id]: '查询中…' }))
    try {
      const r = await updateChannelBalance(id)
      const bal = r.data?.balance ?? r.balance ?? r.data ?? '—'
      setBalMsg(m => ({ ...m, [id]: `${bal}` }))
    } catch (err) { setBalMsg(m => ({ ...m, [id]: `✗ ${err.message}` })) }
  }

  const handleCopy = async (id) => {
    try { await copyChannel(id); load() }
    catch (err) { alert(`复制失败: ${err.message}`) }
  }

  const handleToggle = async (c) => {
    const newStatus = c.status === 1 ? 2 : 1
    await updateChannel(c.id, { ...c, status: newStatus }).catch(() => {})
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('确认删除此渠道？')) return
    await deleteChannel(id).catch(() => {}); load()
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const typeCounts = channels.reduce((acc, c) => {
    const key = String(c.type); acc[key] = (acc[key] || 0) + 1; return acc
  }, {})
  const usedTypes = Object.keys(typeCounts)

  return (
    <ConsoleLayout
      kicker="Console / 渠道管理"
      subtitle="管理 AI 供应商渠道、密钥与模型分配"
      actions={
        <>
          <button className="button tiny" onClick={handleTestAll} disabled={testingAll}>
            {testingAll ? '测试中…' : '全部测试'}
          </button>
          <button className="button tiny primary" onClick={openCreate}>新增渠道</button>
        </>
      }
    >
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Channels · {channels.length} 条</span>
            <h2 className="panel-title">渠道列表</h2>
          </div>
          <input className="searchbox" placeholder="搜索名称、分组" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {usedTypes.length > 0 && (
          <div className="chips-row">
            <span className={`toolbar-chip${typeFilter === 'all' ? ' active' : ''}`} onClick={() => setTypeFilter('all')}>
              全部 {channels.length}
            </span>
            {usedTypes.map(t => (
              <span key={t} className={`toolbar-chip${typeFilter === t ? ' active' : ''}`} onClick={() => setTypeFilter(t)}>
                {typeName(Number(t))} · {typeCounts[t]}
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无渠道</h3>
            <p>添加 AI 供应商渠道以开始使用。</p>
            <button className="button primary" onClick={openCreate}>新增渠道</button>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>名称</th><th>类型</th><th>状态</th>
                  <th>模型数</th><th>优先级/权重</th><th>分组</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const st = STATUS[c.status] || { label: '未知', cls: '' }
                  const info = balMsg[c.id] || testMsg[c.id] || (c.balance !== undefined ? `余额 ${c.balance}` : null)
                  return (
                    <tr key={c.id}>
                      <td style={{ fontSize: 13 }}>{c.id}</td>
                      <td>
                        <strong>{c.name}</strong>
                        {info && <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>{info}</div>}
                      </td>
                      <td style={{ fontSize: 12 }}>{typeName(c.type)}</td>
                      <td><span className={`badge ${st.cls}`} style={{ whiteSpace: 'nowrap' }}>{st.label}</span></td>
                      <td>{c.models?.length || 0}</td>
                      <td style={{ fontSize: 13 }}>{c.priority || 0}/{c.weight || 0}</td>
                      <td style={{ fontSize: 13 }}>{c.group || 'default'}</td>
                      <td>
                        <ActionMenu items={[
                          { label: '测试连接', onClick: () => handleTest(c.id) },
                          { label: '查询余额', onClick: () => handleBalance(c.id) },
                          { label: '编辑', onClick: () => openEdit(c) },
                          { label: '复制', onClick: () => handleCopy(c.id) },
                          { label: c.status === 1 ? '停用' : '启用', onClick: () => handleToggle(c) },
                          { label: '删除', onClick: () => handleDelete(c.id), danger: true },
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
          {channels.length >= 20 && <button className="button tiny" onClick={() => setPage(p => p + 1)}>下一页</button>}
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '编辑渠道' : '新增渠道'}
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
            <label>渠道名称</label>
            <input placeholder="给这个渠道起个名字" value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label>渠道类型</label>
            <select value={form.type} onChange={set('type')}>
              {CHANNEL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>
              API Key
              {editingId && <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 6 }}>（留空不修改）</span>}
            </label>
            <input placeholder="sk-..." value={form.key} onChange={set('key')} type="password" autoComplete="new-password" />
          </div>
          <div className="field">
            <label>
              API Base URL
              <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 6 }}>（留空使用默认）</span>
            </label>
            <input placeholder="https://api.openai.com" value={form.base_url} onChange={set('base_url')} />
          </div>
          <div className="field">
            <label>
              可用模型
              <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 6 }}>（逗号分隔，留空表示全部）</span>
            </label>
            <textarea rows="3" placeholder="gpt-4o, gpt-4o-mini, claude-3-7-sonnet..." value={form.models} onChange={set('models')} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>分组</label>
              <input placeholder="default" value={form.group} onChange={set('group')} />
            </div>
            <div className="field">
              <label>优先级</label>
              <input type="number" value={form.priority} onChange={set('priority')} />
            </div>
          </div>
          <div className="field">
            <label>权重</label>
            <input type="number" value={form.weight} onChange={set('weight')} />
            <span className="field-note">同优先级渠道按权重进行负载均衡</span>
          </div>
        </div>
      </Modal>
    </ConsoleLayout>
  )
}
