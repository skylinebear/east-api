/* EASTCREA v4 — About Page */
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

export default function About() {
  return (
    <Layout>
      <main className="public-main">
        <article className="unified-page">

          {/* 页面标题 */}
          <header className="unified-page-header">
            <span className="mini-label">About EASTCREA</span>
            <h1>关于我们</h1>
            <p>
              EASTCREA 是一个统一的 AI 模型聚合与分发网关，致力于为团队提供更体面、
              更高效的 AI 基础设施。
            </p>
          </header>

          {/* 使命 + 产品定位 */}
          <div className="unified-section-split">
            <div className="unified-cell">
              <span className="mini-label">Mission</span>
              <h2>使命</h2>
              <p>
                让 AI 能力的接入、管理和分发变得简单、透明、可控。
                好的 AI 基础设施应该像水电一样自然地融入工作流。
              </p>
            </div>
            <div className="unified-cell">
              <span className="mini-label">Product</span>
              <h2>产品定位</h2>
              <p>
                面向技术团队的 AI 模型聚合网关，将各类大语言模型统一转换为
                OpenAI 兼容接口，简化多模型管理复杂度。
              </p>
            </div>
          </div>

          {/* 核心能力 */}
          <section className="unified-section">
            <h2>核心能力</h2>
            <div className="kpi-list">
              <div className="mini-stat"><span>统一接入</span><strong>一个端点，接入所有主流 AI 模型</strong></div>
              <div className="mini-stat"><span>精细权限</span><strong>令牌级别的模型权限与额度控制</strong></div>
              <div className="mini-stat"><span>完整日志</span><strong>每次请求的模型、耗时与成本均可追踪</strong></div>
              <div className="mini-stat"><span>负载均衡</span><strong>多渠道自动路由，保障稳定可用</strong></div>
            </div>
          </section>

          {/* 联系方式 */}
          <section className="unified-section">
            <span className="mini-label">Contact</span>
            <h2>联系方式</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
              如有合作、技术支持或其他问题，欢迎通过以下方式与我们联系。
            </p>
            <div className="button-row">
              <Link className="button primary" to="/console">进入控制台</Link>
              <Link className="button" to="/docs">查阅文档</Link>
              <Link className="button" to="/pricing">模型广场</Link>
            </div>
          </section>

        </article>
      </main>
    </Layout>
  )
}
