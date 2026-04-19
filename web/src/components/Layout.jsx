/* East API — Public Layout (header + footer) */
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="11" rx="2" />
      <path d="M8 19.5h8" />
      <path d="M12 15.5v4" />
    </svg>
  )
}

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="user-menu-wrap" ref={ref}>
      <button
        className="header-button user-pill"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="avatar-dot" />
        <strong>{user.username}</strong>
      </button>

      {open && (
        <div className="user-menu" role="menu">
          <button onClick={() => go('/console/personal')}>个人设置</button>
          <button onClick={() => go('/console/token')}>令牌管理</button>
          <button onClick={() => go('/console/topup')}>钱包管理</button>
          <div className="user-menu-divider" />
          <button className="warn" onClick={handleLogout}>退出登录</button>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }) {
  const { user, logout, brandName, brandLogo } = useAuth()
  const { pathname } = useLocation()

  const nav = [
    { href: '/', label: '首页' },
    { href: '/console', label: '控制台' },
    { href: '/pricing', label: '模型广场' },
    { href: '/docs', label: '文档' },
    { href: '/about', label: '关于' },
  ]

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="header-brand" to="/">
          <img src={brandLogo} alt={`${brandName} 标识`} />
          <strong>{brandName}</strong>
        </Link>

        <div className="header-main">
          <nav className="header-nav" aria-label="primary">
            {nav.map(n => (
              <Link
                key={n.href}
                to={n.href}
                className={pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href)) ? 'active' : ''}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="utility-pills">
                <span className="header-icon" aria-label="通知">
                  <BellIcon />
                </span>
                <UserMenu user={user} logout={logout} />
              </div>
            ) : (
              <>
                <div className="utility-pills">
                  <span className="utility-pill">CN</span>
                  <span className="header-icon">
                    <MonitorIcon />
                  </span>
                </div>
                <Link className="header-button" to="/login">登录</Link>
                <Link className="header-button primary" to="/register">注册</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div>
          <strong>{brandName}</strong>
          更体面的团队智能工作前台。
        </div>
        <div>
          <strong>Links</strong>
          <Link to="/about">关于我们</Link>
          {' · '}
          <Link to="/pricing">模型广场</Link>
          {' · '}
          <Link to="/docs">文档</Link>
        </div>
        <div>
          <Link to="/user-agreement">用户协议</Link>
          {' \u00a0·\u00a0 '}
          <Link to="/privacy-policy">隐私政策</Link>
          {' \u00a0·\u00a0 '}
          <Link to="/about">关于我们</Link>
        </div>
      </footer>
    </div>
  )
}
