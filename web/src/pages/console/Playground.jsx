/* EASTCREA v4 — API Playground */
import { useState, useEffect, useRef } from 'react'
import { getModels } from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const DEFAULT_SYS = '你是一名善于整理信息与总结结构的团队助手。'

export default function Playground() {
  const [models, setModels] = useState([])
  const [config, setConfig] = useState({ model: 'gpt-4o', temperature: 0.7, system: DEFAULT_SYS, input: '' })
  const [response, setResponse] = useState('')
  const [reqJson, setReqJson] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('response')

  useEffect(() => {
    getModels()
      .then(r => {
        if (r.data && Array.isArray(r.data)) {
          setModels(r.data.map(m => typeof m === 'string' ? m : m.id).filter(Boolean))
        }
      })
      .catch(() => {})
  }, [])

  const set = (k) => (e) => setConfig(c => ({ ...c, [k]: e.target.value }))

  const handleSend = async () => {
    if (!config.input.trim()) return
    setLoading(true)
    setActiveTab('response')

    const messages = []
    if (config.system) messages.push({ role: 'system', content: config.system })
    messages.push({ role: 'user', content: config.input })

    const req = {
      model: config.model,
      temperature: parseFloat(config.temperature),
      messages,
    }
    setReqJson(JSON.stringify(req, null, 2))

    try {
      const token = document.cookie.match(/token=([^;]+)/)?.[1] || ''
      const res = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(req),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        setResponse(`// Error: ${res.status}\n${JSON.stringify(errBody, null, 2)}`)
        return
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2)
      setResponse(`// Response from ${config.model}\n// Temperature: ${config.temperature}\n\n${content}`)
    } catch (err) {
      setResponse(`// Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConsoleLayout kicker="Console / 操练场" subtitle="配置模型参数，构造请求体，直接预览 API 调用响应">
      <div className="playground-layout">
        <article className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-header">
            <div>
              <span className="mini-label">Configuration</span>
              <h2 className="panel-title">模型配置</h2>
            </div>
          </div>
          <div className="form-stack">
            <div className="field">
              <label>模型</label>
              <select value={config.model} onChange={set('model')}>
                {models.length > 0
                  ? models.map(m => <option key={m} value={m}>{m}</option>)
                  : ['gpt-4o', 'gpt-4o-mini', 'claude-3-7-sonnet', 'gemini-2.5-pro', 'deepseek-v3'].map(m => <option key={m} value={m}>{m}</option>)
                }
              </select>
            </div>

            <div className="field">
              <label>
                Temperature &nbsp;
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--blue)' }}>{config.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={set('temperature')}
              />
              <span className="field-note">控制输出随机度。0 = 确定性，2 = 高创意</span>
            </div>

            <div className="field">
              <label>系统提示词（System Prompt）</label>
              <textarea rows="3" value={config.system} onChange={set('system')} />
            </div>

            <div className="field">
              <label>用户输入（User Message）</label>
              <textarea
                rows="4"
                value={config.input}
                onChange={set('input')}
                placeholder="在这里输入你的问题或请求…"
              />
            </div>

            <button className="button primary" onClick={handleSend} disabled={loading}>
              {loading ? <span className="loading-spinner" /> : '发送请求'}
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="mini-label">Response</span>
              <h2 className="panel-title">响应结果</h2>
            </div>
            <div className="seg-control">
              <span className={activeTab === 'response' ? 'active' : ''} onClick={() => setActiveTab('response')}>响应内容</span>
              <span className={activeTab === 'json' ? 'active' : ''} onClick={() => setActiveTab('json')}>请求体</span>
            </div>
          </div>

          {activeTab === 'response' && (
            <div className="code-panel">
              {loading ? '正在发送请求…' : (response || '// 点击"发送请求"查看响应')}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="code-panel">
              {reqJson || '// 发送请求后显示请求体'}
            </div>
          )}
        </article>
      </div>
    </ConsoleLayout>
  )
}
