/* EASTCREA v4 — Home Page */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStatus } from '../api.js'
import { useAuth } from '../hooks/useAuth.jsx'
import Layout from '../components/Layout.jsx'

const PROVIDERS = [
  { name: 'OpenAI', cls: 'alt' },
  { name: 'Claude', cls: 'alt' },
  { name: 'GEMINI', cls: 'mono' },
  { name: 'GROK', cls: 'mono' },
  { name: 'Qwen', cls: 'alt' },
  { name: 'DeepSeek', cls: 'alt' },
  { name: 'Mistral', cls: 'mono' },
  { name: 'Llama', cls: 'mono' },
  { name: 'Cohere', cls: 'alt' },
  { name: 'MiniMax', cls: 'mono' },
  { name: 'Runway', cls: 'alt' },
  { name: 'Kling', cls: 'alt' },
  { name: 'Midjourney', cls: 'mono' },
  { name: 'Suno', cls: 'mono' },
  { name: 'Flux', cls: 'alt' },
  { name: 'Recraft', cls: 'alt' },
  { name: 'ElevenLabs', cls: 'mono' },
  { name: '30+', cls: 'alt' },
]

export default function Home() {
  const { user, status } = useAuth()
  const [apiBase, setApiBase] = useState('https://api.eastcrea.com')

  useEffect(() => {
    if (status?.server_address) setApiBase(status.server_address)
  }, [status])

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(apiBase + '/v1')
    } catch { /* ignore */ }
  }

  const notice = status?.announcements?.map?.(a => Object.values(a)[0]).join('') || ''

  return (
    <Layout>
      <main className="public-main">
        {notice && (
          <div className="notice">
            {notice}
          </div>
        )}

        {/* Hero */}
        <section className="hero-card hero-home">
          <h1>真实才是性价比</h1>
          <p className="lead">
            更好的次序，更清晰的协作，更稳定的体验，只需将团队的智能接入入口切换为：
          </p>

          <div className="endpoint-bar">
            <span className="endpoint-base">{apiBase}</span>
            <span className="endpoint-route">/v1</span>
            <button className="copy-button" onClick={copyEndpoint} title="复制端点地址">copy</button>
          </div>

          <div className="button-row center" style={{ marginTop: 28 }}>
            {user ? (
              <Link className="button primary" to="/console">进入控制台</Link>
            ) : (
              <>
                <Link className="button primary" to="/register">开始接入</Link>
                <Link className="button" to="/docs">查看文档</Link>
              </>
            )}
          </div>
        </section>

        {/* Providers */}
        <section className="support-block">
          <p className="support-copy">支持众多主流模型与创作服务</p>
          <div className="providers-grid">
            {PROVIDERS.map((p, i) => (
              <div key={i} className={`provider-tile${p.cls ? ' ' + p.cls : ''}`}>{p.name}</div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}
