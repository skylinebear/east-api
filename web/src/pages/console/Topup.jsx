/* EASTCREA v4 — Wallet & Topup */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRedemption } from '../../api.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

export default function Topup() {
  const { user, status, refresh } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const handleRedeem = async (e) => {
    e.preventDefault()
    if (!code.trim()) { setMsg('请输入兑换码'); setIsError(true); return }
    setLoading(true)
    setMsg('')
    try {
      const res = await useRedemption(code.trim())
      if (res.success) {
        setMsg('兑换成功！余额已更新。')
        setIsError(false)
        setCode('')
        refresh()
      } else {
        setMsg(res.message || '兑换失败，请检查兑换码是否有效')
        setIsError(true)
      }
    } catch (err) {
      setMsg(err.message)
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  const topUpLink = status?.top_up_link

  return (
    <ConsoleLayout
      kicker="Console / 钱包管理"
      subtitle="账户余额、充值方式与消耗记录"
      actions={
        <Link className="button tiny" to="/console/log">消耗记录</Link>
      }
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span className="mini-label">Balance</span>
          <h3>当前余额</h3>
          <span className="stat-value">${((user?.quota || 0) / 500000).toFixed(4)}</span>
          <p>可用余额实时更新</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">History</span>
          <h3>历史消耗</h3>
          <span className="stat-value">${((user?.used_quota || 0) / 500000).toFixed(4)}</span>
          <p>累计消耗总额</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Requests</span>
          <h3>请求次数</h3>
          <span className="stat-value">{user?.request_count || 0}</span>
          <p>当前周期累计请求</p>
        </article>
        <article className="stat-card">
          <span className="mini-label">Group</span>
          <h3>当前分组</h3>
          <span className="stat-value" style={{ fontSize: 24 }}>{user?.group || 'default'}</span>
          <p>影响可访问的模型范围</p>
        </article>
      </section>

      <section className="split-2">
        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Redemption</span>
              <h2 className="panel-title">兑换码充值</h2>
            </div>
          </div>
          <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>输入兑换码可直接为账户增加余额</p>

          {msg && <div className={`notice ${isError ? 'warn' : 'success'}`}>{msg}</div>}

          <form onSubmit={handleRedeem}>
            <div className="field">
              <label>兑换码</label>
              <input
                placeholder="请输入兑换码"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
            <div className="button-row" style={{ marginTop: 12 }}>
              <button className="button primary" type="submit" disabled={loading}>
                {loading ? <span className="loading-spinner" /> : '立即兑换'}
              </button>
            </div>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Top Up</span>
              <h2 className="panel-title">在线充值</h2>
            </div>
          </div>
          <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>充值后额度即时到账</p>

          {topUpLink ? (
            <div className="button-row">
              <a className="button primary" href={topUpLink} target="_blank" rel="noopener noreferrer">
                前往充值页面
              </a>
            </div>
          ) : (
            <div className="notice">
              暂未配置在线充值入口，请联系管理员或使用兑换码充值。
            </div>
          )}

          <div className="kpi-list" style={{ marginTop: 16 }}>
            <div className="mini-stat"><span>充值方式</span><strong>兑换码 / 在线</strong></div>
            <div className="mini-stat"><span>额度单位</span><strong>1 USD = 500,000 配额</strong></div>
          </div>
        </article>
      </section>
    </ConsoleLayout>
  )
}
