/* East API — Docs Page */
import Layout from '../components/Layout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Docs() {
  const { brandName } = useAuth()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <Layout>
      <main className="public-main">
        <article className="unified-page">

          {/* 页面标题 */}
          <header className="unified-page-header">
            <span className="mini-label">Documentation</span>
            <h1>文档中心</h1>
            <p>了解如何接入 {brandName} API 网关，管理令牌、渠道与模型，快速构建 AI 工作流。</p>
          </header>

          {/* 快速接入 */}
          <section className="unified-section">
            <h2>快速接入</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              将 API 基础地址替换为 {brandName} 端点，使用控制台生成的令牌，即可立即调用所有接入模型。
            </p>
            <div className="code-panel" style={{ fontSize: 13 }}>
              {`const client = new OpenAI({
  apiKey: "sk-...",        // 控制台生成的令牌
  baseURL: "${origin}/v1"  // ${brandName} 统一端点
})

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }]
})`}
            </div>
          </section>

          {/* 核心概念 + 鉴权 */}
          <div className="unified-section-split">
            <div className="unified-cell">
              <h2>核心概念</h2>
              <div className="kpi-list">
                <div className="mini-stat"><span>令牌 Token</span><strong>API 访问凭证</strong></div>
                <div className="mini-stat"><span>渠道 Channel</span><strong>供应商 API 配置</strong></div>
                <div className="mini-stat"><span>分组 Group</span><strong>权限与额度分级</strong></div>
                <div className="mini-stat"><span>额度 Quota</span><strong>1 USD = 500,000 单位</strong></div>
                <div className="mini-stat"><span>模型 Model</span><strong>通过渠道路由的推理服务</strong></div>
              </div>
            </div>
            <div className="unified-cell">
              <h2>鉴权方式</h2>
              <p>所有请求须在 HTTP Header 中携带令牌：</p>
              <div className="code-panel" style={{ fontSize: 12, marginTop: 12 }}>
                {`Authorization: Bearer sk-your-token`}
              </div>
              <div className="kpi-list" style={{ marginTop: 16 }}>
                <div className="mini-stat"><span>令牌格式</span><strong>Bearer sk-***</strong></div>
                <div className="mini-stat"><span>额度结算</span><strong>按实际 Token 用量</strong></div>
                <div className="mini-stat"><span>模型路由</span><strong>自动负载均衡</strong></div>
              </div>
            </div>
          </div>

          {/* 接口参考 */}
          <section className="unified-section">
            <h2>接口参考</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              {brandName} 完全兼容 OpenAI API 格式，无需修改现有代码即可接入：
            </p>
            <div className="table-panel">
              <table>
                <thead>
                  <tr><th>端点</th><th>方法</th><th>说明</th></tr>
                </thead>
                <tbody>
                  {[
                    ['/v1/chat/completions', 'POST', '聊天对话（Chat Completions）'],
                    ['/v1/completions', 'POST', '文本补全（Completions）'],
                    ['/v1/embeddings', 'POST', '文本向量化（Embeddings）'],
                    ['/v1/images/generations', 'POST', '图像生成（DALL·E / 绘图模型）'],
                    ['/v1/models', 'GET', '获取可用模型列表'],
                    ['/v1/responses', 'POST', 'OpenAI Responses API（GPT-4.1+）'],
                    ['/v1/messages', 'POST', 'Claude Messages API'],
                  ].map(([endpoint, method, desc]) => (
                    <tr key={endpoint}>
                      <td><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{endpoint}</span></td>
                      <td><span className="badge blue">{method}</span></td>
                      <td style={{ color: 'var(--ink-soft)' }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </article>
      </main>
    </Layout>
  )
}
