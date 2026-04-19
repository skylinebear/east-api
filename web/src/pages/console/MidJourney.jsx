/* EASTCREA v4 — MidJourney Log */
import { useState, useEffect, useCallback } from 'react'
import { getMjTasks } from '../../api.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const STATUS_MAP = {
  SUCCESS: { label: '成功', cls: 'success' },
  FAILURE: { label: '失败', cls: 'warn' },
  IN_PROGRESS: { label: '进行中', cls: 'blue' },
  NOT_START: { label: '等待中', cls: '' },
}

const fmtTime = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function MidJourney() {
  const { user } = useAuth()
  const isAdmin = user?.role >= 10
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const load = useCallback(() => {
    setLoading(true)
    getMjTasks({ p: page, page_size: 20 }, isAdmin)
      .then(r => { if (r.success) setTasks(r.data?.items || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAdmin, page])

  useEffect(() => { load() }, [load])

  return (
    <ConsoleLayout kicker="Console / 绘图日志" subtitle="查看 Midjourney 绘图任务提交记录与结果">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="mini-label">MJ Tasks · {tasks.length} 条</span>
            <h2 className="panel-title">绘图任务列表</h2>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-card center">
            <h3>暂无绘图任务</h3>
            <p>通过 Midjourney API 提交绘图任务后，记录将显示在此处。</p>
          </div>
        ) : (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>任务 ID</th>
                  <th>状态</th>
                  <th>提示词</th>
                  <th>提交时间</th>
                  <th>完成时间</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => {
                  const st = STATUS_MAP[t.status] || { label: t.status || '—', cls: '' }
                  return (
                    <tr key={t.id || i}>
                      <td><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{t.mj_id || t.id || '—'}</span></td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td style={{ maxWidth: 300, fontSize: 13, color: 'var(--ink-soft)' }}>{(t.prompt || '—').slice(0, 80)}{t.prompt?.length > 80 ? '…' : ''}</td>
                      <td style={{ fontSize: 13 }}>{fmtTime(t.submit_time)}</td>
                      <td style={{ fontSize: 13 }}>{fmtTime(t.finish_time)}</td>
                    </tr>
                  )
                })}
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
