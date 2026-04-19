/* EASTCREA v4 — Usage Log */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getLogs, getSelfLogs } from '../../api.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const TYPE_FILTERS = [
  { key: 'all', label: '全部' },
  { key: '1',   label: '文本' },
  { key: '4',   label: '图像' },
  { key: '3',   label: '嵌入' },
]

const fmtTime = (ts) => {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function Log() {
  const { user } = useAuth()
  const isAdmin = user?.role >= 10

  const [logs, setLogs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(0)
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch]         = useState('')
  const [userFilter, setUserFilter] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params = { p: page, page_size: 20 }
    if (typeFilter !== 'all') params.type = typeFilter
    if (isAdmin && userFilter) params.username = userFilter

    const req = isAdmin ? getLogs(params) : getSelfLogs(params)
    req
      .then(r => { if (r.success) setLogs(r.data?.items || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, typeFilter, userFilter, isAdmin])

  useEffect(() => { load() }, [load])

  const filtered = logs.filter(l =>
    !search ||
    l.model_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.token_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.username?.toLowerCase().includes(search.toLowerCase())
  )

  const totalConsumed = logs.reduce((s, l) => s + (l.quota || 0), 0)
  const totalOut      = logs.reduce((s, l) => s + (l.completion_tokens || 0), 0)
  const avgLatency    = logs.length
    ? (logs.reduce((s, l) => s + (l.duration || 0), 0) / logs.length / 1000).toFixed(2)
    : '—'

  return (
    <ConsoleLayout
      kicker={`Console / ${isAdmin ? '全站日志' : '使用日志'}`}
      subtitle={isAdmin ? '查看全站所有用户的 API 调用记录' : '查看本账户 API 调用记录、耗时和消耗详情'}
      actions={<Link className="button tiny" to="/console/token">查看令牌</Link>}
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span className="mini-label">Consumed</span>
          <h3>消耗额度</h3>
          <span className="stat-value">${(totalConsumed / 500000).toFixed(4)}</span>
          <p>当前筛选范围内累计消耗</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Requests</span>
          <h3>请求次数</h3>
          <span className="stat-value">{logs.length}</span>
          <p>当前页记录数量</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Output Tokens</span>
          <h3>输出 Tokens</h3>
          <span className="stat-value">{totalOut.toLocaleString()}</span>
          <p>当前页补全 Token 合计</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Latency</span>
          <h3>平均响应时间</h3>
          <span className="stat-value">{avgLatency}s</span>
          <p>当前页平均耗时</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">{isAdmin ? 'All Users · Log' : 'Usage Table'}</span>
            <h2 className="panel-title">请求明细</h2>
          </div>
        </div>

        <div className="toolbar-bar">
          <div className="toolbar-group">
            {TYPE_FILTERS.map(f => (
              <span
                key={f.key}
                className={`toolbar-chip${typeFilter === f.key ? ' active' : ''}`}
                onClick={() => { setTypeFilter(f.key); setPage(0) }}
              >
                {f.label}
              </span>
            ))}
          </div>
          <div className="toolbar-group">
            {isAdmin && (
              <input
                className="searchbox"
                style={{ minWidth: 140 }}
                placeholder="按用户名筛选"
                value={userFilter}
                onChange={e => { setUserFilter(e.target.value); setPage(0) }}
              />
            )}
            <input
              className="searchbox"
              placeholder="搜索模型、令牌名称"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无日志</h3>
            <p>使用 API 令牌发起请求后，日志将显示在此处。</p>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  {isAdmin && <th>用户</th>}
                  <th>模型</th>
                  <th>令牌</th>
                  {isAdmin && <th>渠道</th>}
                  <th>提示词 T</th>
                  <th>补全 T</th>
                  <th>消耗额度</th>
                  <th>耗时</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id || i}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{fmtTime(l.created_at)}</td>
                    {isAdmin && <td style={{ fontSize: 13 }}>{l.username || '—'}</td>}
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{l.model_name || '—'}</span></td>
                    <td style={{ fontSize: 13 }}>{l.token_name || '—'}</td>
                    {isAdmin && <td style={{ fontSize: 13 }}>{l.channel_id ? `#${l.channel_id}` : '—'}</td>}
                    <td>{l.prompt_tokens || 0}</td>
                    <td>{l.completion_tokens || 0}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>${(l.quota / 500000).toFixed(6)}</td>
                    <td style={{ fontSize: 13 }}>{l.duration ? (l.duration / 1000).toFixed(2) + 's' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="button-row">
          {page > 0 && <button className="button tiny" onClick={() => setPage(p => p - 1)}>上一页</button>}
          {logs.length >= 20 && <button className="button tiny" onClick={() => setPage(p => p + 1)}>下一页</button>}
        </div>
      </section>
    </ConsoleLayout>
  )
}
