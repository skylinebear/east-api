/* EASTCREA v4 — Console Layout (sidebar + main) */
import { Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Layout from './Layout.jsx'

export default function ConsoleLayout({ children, subtitle, kicker, actions }) {
  const { user, loading } = useAuth()
  const { pathname } = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span className="loading-spinner dark" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const isAdmin = user.role >= 10

  const workspaceLinks = [
    { href: '/console', label: '数据看板' },
    { href: '/pricing', label: '模型广场' },
    { href: '/console/playground', label: '操练场' },
    { href: '/console/chat', label: '聊天' },
  ]

  const accountLinks = [
    { href: '/console/token', label: '令牌管理' },
    { href: '/console/log', label: '使用日志' },
    ...(isAdmin ? [{ href: '/console/midjourney', label: '绘图日志' }] : []),
    { href: '/console/task', label: '任务日志' },
    { href: '/console/topup', label: '钱包管理' },
    { href: '/console/personal', label: '个人设置' },
  ]

  const adminLinks = isAdmin ? [
    { href: '/console/channel', label: '渠道管理' },
    { href: '/console/subscription', label: '订阅管理' },
    { href: '/console/models', label: '模型管理' },
    { href: '/console/redemption', label: '兑换码管理' },
    { href: '/console/user', label: '用户管理' },
    { href: '/console/setting', label: '系统设置' },
  ] : []

  const isActive = (href) => {
    if (href === '/console') return pathname === '/console'
    return pathname.startsWith(href)
  }

  // Extract page title from kicker (format: "Console / 页面名")
  const pageTitle = kicker ? kicker.split(' / ').pop() : '控制台'

  return (
    <Layout>
      <main className="console-wrap">
        <aside className="console-sidebar">
          <div className="sidebar-card">
            <div className="menu-section">
              <div className="menu-section-title">工作区</div>
              <div className="menu-list">
                {workspaceLinks.map(l => (
                  <Link key={l.href} className={`menu-link${isActive(l.href) ? ' active' : ''}`} to={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="menu-section">
              <div className="menu-section-title">账户中心</div>
              <div className="menu-list">
                {accountLinks.map(l => (
                  <Link key={l.href} className={`menu-link${isActive(l.href) ? ' active' : ''}`} to={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {adminLinks.length > 0 && (
              <div className="menu-section">
                <div className="menu-section-title">管理后台</div>
                <div className="menu-list">
                  {adminLinks.map(l => (
                    <Link key={l.href} className={`menu-link${isActive(l.href) ? ' active' : ''}`} to={l.href}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <section className="console-main">
          <div className="topbar-card">
            <div className="crumbs">
              {kicker && <span className="mini-label">{kicker}</span>}
              <h1 className="page-title">{pageTitle}</h1>
              {subtitle && <span className="workspace-title">{subtitle}</span>}
            </div>
            <div className="button-row">
              {actions}
              {pathname !== '/console' && (
                <Link className="button tiny" to="/console">返回概览</Link>
              )}
              {isAdmin && pathname !== '/console/setting' && (
                <Link className="button tiny primary" to="/console/setting">运营设置</Link>
              )}
            </div>
          </div>

          <div className="console-content">
            {children}
          </div>
        </section>
      </main>
    </Layout>
  )
}
