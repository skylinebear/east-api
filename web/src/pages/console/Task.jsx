/* EASTCREA v4 — Task Log */
import { useState, useEffect, useCallback } from 'react'
import { getTasks } from '../../api.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const fmtTime = (ts) => ts ? new Date(ts * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'

export default function Task() {
  const { user } = useAuth()
  const isAdmin = user?.role >= 10
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const load = useCallback(() => {
    setLoading(true)
    getTasks({ p: page, page_size: 20 }, isAdmin)
      .then(r => { if (r.success) setTasks(r.data?.items || []) })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [isAdmin, page])

  useEffect(() => { load() }, [load])

  return (
    <ConsoleLayout kicker="Console / 任务日志" subtitle="查看异步任务（绘图、语音等）的执行记录与结果">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">Tasks · {tasks.length} 条</span>
            <h2 className="panel-title">任务列表</h2>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无任务</h3>
            <p>提交异步任务后，记录将显示在此处。</p>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr><th>ID</th><th>类型</th><th>状态</th><th>令牌</th><th>创建时间</th></tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => (
                  <tr key={t.id || i}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{t.id || '—'}</td>
                    <td>{t.platform || t.type || '—'}</td>
                    <td><span className="badge">{t.status || '—'}</span></td>
                    <td>{t.token_name || '—'}</td>
                    <td style={{ fontSize: 13 }}>{fmtTime(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="button-row">
          {page > 0 && <button className="button tiny" onClick={() => setPage(p => p - 1)}>上一页</button>}
          {tasks.length >= 20 && <button className="button tiny" onClick={() => setPage(p => p + 1)}>下一页</button>}
        </div>
      </section>
    </ConsoleLayout>
  )
}
