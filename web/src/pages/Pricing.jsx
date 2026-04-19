/* EASTCREA v4 — Pricing / Model Plaza */
import { useState, useEffect } from 'react'
import { getModels } from '../api.js'
import ConsoleLayout from '../components/ConsoleLayout.jsx'

const PROVIDERS = ['全部供应商', 'OpenAI', 'Anthropic', 'Google', 'Qwen', 'DeepSeek', 'Moonshot']

const MODEL_INFO = {
  'gpt-4o':           { provider: 'OpenAI',    desc: '适合需要稳定综合能力的团队工作流。',     endpoint: '/v1/responses', ratio: '1x',   tags: ['文本', '视觉', '稳定'] },
  'gpt-4o-mini':      { provider: 'OpenAI',    desc: '快速、低成本的轻量模型，适合高频调用。', endpoint: '/v1/responses', ratio: '0.2x', tags: ['文本', '快速'] },
  'gpt-4.1':          { provider: 'OpenAI',    desc: '最新一代 GPT，综合能力全面提升。',       endpoint: '/v1/responses', ratio: '1.2x', tags: ['文本', '视觉'] },
  'claude-3-7-sonnet':{ provider: 'Anthropic', desc: '偏长文本、分析和多步骤写作整理。',       endpoint: '/v1/messages',  ratio: '1.2x', tags: ['文本', '推理'] },
  'claude-3-5-haiku': { provider: 'Anthropic', desc: '快速响应的小模型，适合轻量任务。',       endpoint: '/v1/messages',  ratio: '0.4x', tags: ['文本', '快速'] },
  'gemini-2.5-pro':   { provider: 'Google',    desc: '支持超长上下文与多模态输入。',           endpoint: '/v1/responses', ratio: '1.3x', tags: ['文本', '视觉', '长上下文'] },
  'deepseek-v3':      { provider: 'DeepSeek',  desc: '高性价比中文优化模型。',                 endpoint: '/v1/responses', ratio: '0.3x', tags: ['文本', '中文'] },
  'qwen-max':         { provider: 'Qwen',      desc: '阿里云通义千问旗舰模型。',               endpoint: '/v1/responses', ratio: '0.5x', tags: ['文本', '中文'] },
}

export default function Pricing() {
  const [models, setModels]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [providerFilter, setProvider] = useState('全部供应商')

  useEffect(() => {
    getModels()
      .then(r => {
        if (r.data && Array.isArray(r.data))
          setModels(r.data.map(m => typeof m === 'string' ? { id: m } : m).filter(Boolean))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayModels = models.length > 0 ? models : Object.keys(MODEL_INFO).map(id => ({ id }))

  const filtered = displayModels.filter(m => {
    const info = MODEL_INFO[m.id] || {}
    if (search && !m.id.toLowerCase().includes(search.toLowerCase())) return false
    if (providerFilter !== '全部供应商' && info.provider !== providerFilter) return false
    return true
  })

  const providerCount = [...new Set(displayModels.map(m => (MODEL_INFO[m.id] || {}).provider).filter(Boolean))].length

  return (
    <ConsoleLayout
      kicker="Console / 模型广场"
      subtitle="浏览可用模型、接入端点与定价倍率"
      actions={
        <span className="toolbar-chip" style={{ cursor: 'default' }}>{filtered.length} 个模型</span>
      }
    >
      {/* 统计行 */}
      <section className="stats-grid">
        <article className="stat-card">
          <span className="mini-label">Models</span>
          <h3>可用模型</h3>
          <span className="stat-value">{displayModels.length || '—'}</span>
          <p>当前平台接入总量</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Providers</span>
          <h3>接入供应商</h3>
          <span className="stat-value">{providerCount || '—'}</span>
          <p>覆盖主流 AI 供应商</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Endpoint</span>
          <h3>统一端点</h3>
          <span className="stat-value" style={{ fontSize: 22 }}>/v1</span>
          <p>兼容 OpenAI 接口格式</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Billing</span>
          <h3>计费方式</h3>
          <span className="stat-value" style={{ fontSize: 22 }}>按量</span>
          <p>按实际 Token 用量结算</p>
        </article>
      </section>

      {/* 模型目录 */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Model Catalog</span>
            <h2 className="panel-title">可用模型列表</h2>
          </div>
        </div>

        {/* 筛选工具栏 */}
        <div className="toolbar-bar">
          <div className="toolbar-group">
            {PROVIDERS.map(p => (
              <span
                key={p}
                className={`toolbar-chip${providerFilter === p ? ' active' : ''}`}
                onClick={() => setProvider(p)}
              >
                {p}
              </span>
            ))}
          </div>
          <input
            className="searchbox"
            placeholder="搜索模型名称"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* 模型网格 */}
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-card center">
            <h3>未找到匹配模型</h3>
            <p>请尝试调整搜索条件。</p>
          </div>
        ) : (
          <div className="model-grid">
            {filtered.map(m => {
              const info = MODEL_INFO[m.id] || {
                provider: m.owned_by || '未知',
                desc: '通过统一网关访问。',
                endpoint: '/v1/chat/completions',
                ratio: '1x',
                tags: [],
              }
              return (
                <article key={m.id} className="model-card pricing-model-card">
                  <div className="panel-header">
                    <div>
                      <span className="mini-label">{info.provider}</span>
                      <h3>{m.id}</h3>
                    </div>
                    <span className="badge blue">按量计费</span>
                  </div>
                  <p>{info.desc}</p>
                  <div className="card-meta">
                    <div className="meta-pair">
                      <span>接入端点</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{info.endpoint}</span>
                    </div>
                    <div className="meta-pair">
                      <span>价格倍率</span>
                      <span className="price-tag pricing-price">{info.ratio}</span>
                    </div>
                  </div>
                  {info.tags.length > 0 && (
                    <div className="chips-row">
                      {info.tags.map(t => <span key={t} className="pill">{t}</span>)}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </article>
    </ConsoleLayout>
  )
}
