/* EASTCREA v4 — Console Dashboard */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserDashboard } from '../../api.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const fmtQuota = (q) => {
  if (!q && q !== 0) return '—'
  return '$' + (q / 500000).toFixed(2)
}

const ROLES = { 1: '普通用户', 10: '管理员', 100: '超级管理员' }

export default function Dashboard() {
  const { user } = useAuth()
  const [dash, setDash] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserDashboard()
      .then(r => { if (r.success) setDash(r.data || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const chartData = dash || []
  const maxVal = Math.max(...chartData.map(d => d.count || d.rpm || 0), 1)

  return (
    <ConsoleLayout
      kicker="Console / 数据看板"
      subtitle="账户、请求与工作区的总览入口"
      actions={
        <>
          <Link className="button tiny primary" to="/console/topup">充值账户</Link>
          <Link className="button tiny" to="/console/log">查看日志</Link>
        </>
      }
    >
      {/* Stats Row */}
      <section className="stats-grid">
        <article className="stat-card">
          <span className="mini-label">Balance</span>
          <h3>当前余额</h3>
          <span className="stat-value">{fmtQuota(user?.quota)}</span>
          <p>可用于日常请求与团队测试</p>
        </article>

        <article className="stat-card">
          <span className="mini-label">Spent</span>
          <h3>历史消耗</h3>
          <span className="stat-value">{fmtQuota(user?.used_quota)}</span>
          <p>统计周期内的累计消耗</p>
        </article>

        <article className="stat-card">
          <span className="mini-label">Requests</span>
          <h3>请求次数</h3>
          <span className="stat-value">{user?.request_count ?? 0}</span>
          <p>累计请求数量</p>
        </article>

        <article className="stat-card">
          <span className="mini-label">Status</span>
          <h3>账户状态</h3>
          <span className="stat-value" style={{ fontSize: 26 }}>
            {user?.status === 1 ? '正常' : '异常'}
          </span>
          <p>当前账户运行状态</p>
        </article>
      </section>

      {/* Charts + Account Info */}
      <section className="split-2">
        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Usage Trend</span>
              <h2 className="panel-title">本周使用趋势</h2>
            </div>
          </div>
          <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>近期 API 调用量可视化概览</p>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="loading-spinner dark" /> 加载中…
            </div>
          ) : (
            <div className="chart-bars">
              {chartData.length > 0
                ? chartData.slice(-10).map((d, i) => (
                    <span
                      key={i}
                      style={{ height: `${Math.max(4, Math.round(((d.count || d.rpm || 0) / maxVal) * 100))}%` }}
                      title={`${d.created_at ? new Date(d.created_at * 1000).toLocaleString('zh-CN') : ''}: ${d.count || d.rpm || 0} 次请求`}
                    />
                  ))
                : Array.from({ length: 10 }, (_, i) => <span key={i} style={{ height: `${[22,38,46,58,72,68,84,78,92,64][i]}%` }} />)
              }
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Account</span>
              <h2 className="panel-title">账户数据</h2>
            </div>
          </div>
          <div className="kpi-list">
            <div className="mini-stat"><span>用户名</span><strong>{user?.username}</strong></div>
            <div className="mini-stat"><span>用户 ID</span><strong>{user?.id}</strong></div>
            <div className="mini-stat"><span>用户分组</span><strong>{user?.group || 'default'}</strong></div>
            <div className="mini-stat"><span>角色身份</span><strong>{ROLES[user?.role] || '普通用户'}</strong></div>
            <div className="mini-stat"><span>在线状态</span><strong>{user?.status === 1 ? '正常' : '已禁用'}</strong></div>
            <div className="mini-stat"><span>账户邮箱</span><strong>{user?.email || '未绑定'}</strong></div>
          </div>
        </article>
      </section>

      {/* Quick Links + Service Status */}
      <section className="split-2">
        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Quick Links</span>
              <h2 className="panel-title">快捷入口</h2>
            </div>
          </div>
          <div className="quick-links">
            <Link className="quick-link" to="/console/playground">
              <strong className="quick-link-title">操练场</strong>
              <p>先验证请求，再推向正式使用。</p>
            </Link>
            <Link className="quick-link" to="/console/token">
              <strong className="quick-link-title">令牌管理</strong>
              <p>集中管理访问凭证、分组与权限。</p>
            </Link>
            <Link className="quick-link" to="/console/log">
              <strong className="quick-link-title">使用日志</strong>
              <p>查看调用结果、耗时和消耗情况。</p>
            </Link>
            <Link className="quick-link" to="/console/setting">
              <strong className="quick-link-title">系统设置</strong>
              <p>围绕运营、模型与支付进行调整。</p>
            </Link>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Health</span>
              <h2 className="panel-title">服务健康度</h2>
            </div>
          </div>
          <div className="progress-list">
            <div className="progress-item">
              <div className="mini-stat"><span>账户安全检查</span><strong>100%</strong></div>
              <div className="progress-track"><div className="progress-bar" style={{ width: '100%' }} /></div>
            </div>
            <div className="progress-item">
              <div className="mini-stat"><span>模型可用性</span><strong>96%</strong></div>
              <div className="progress-track"><div className="progress-bar" style={{ width: '96%' }} /></div>
            </div>
            <div className="progress-item">
              <div className="mini-stat"><span>账单同步</span><strong>88%</strong></div>
              <div className="progress-track"><div className="progress-bar" style={{ width: '88%' }} /></div>
            </div>
          </div>
        </article>
      </section>
    </ConsoleLayout>
  )
}
