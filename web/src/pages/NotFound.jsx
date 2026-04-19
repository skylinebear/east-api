/* East API — 404 Not Found */
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function NotFound() {
  const { brandName, brandLogo } = useAuth()

  return (
    <Layout>
      <main className="public-main status-shell">
        <section className="status-card">
          <div className="brand-lockup">
            <img src={brandLogo} alt={`${brandName} 标识`} />
            <div>
              <span className="mini-label">{brandName}</span>
              <h1>页面不见了</h1>
            </div>
          </div>
          <span className="status-code">404 Not Found</span>
          <p style={{ marginTop: 16 }}>您访问的页面不存在，可能已被移动或删除。</p>
          <div className="button-row" style={{ marginTop: 20 }}>
            <Link className="button primary" to="/">回到首页</Link>
            <Link className="button" to="/console">控制台</Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
