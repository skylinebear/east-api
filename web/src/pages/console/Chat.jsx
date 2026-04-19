/* EASTCREA v4 — Chat Interface */
import { useState, useRef, useEffect } from 'react'
import { getModels } from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

const WELCOME = '你好！我是 EASTCREA 助手，有什么可以帮助您？'

export default function Chat() {
  const [sessions, setSessions] = useState([
    { id: 1, title: '新建会话', model: 'gpt-4o', messages: [{ role: 'assistant', content: WELCOME }] }
  ])
  const [activeId, setActiveId] = useState(1)
  const [input, setInput] = useState('')
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef(null)

  useEffect(() => {
    getModels()
      .then(r => {
        if (r.data && Array.isArray(r.data)) {
          const list = r.data.map(m => typeof m === 'string' ? m : m.id).filter(Boolean)
          setModels(list)
          if (list.length > 0) setSelectedModel(list[0])
        }
      })
      .catch(() => {})
  }, [])

  const active = sessions.find(s => s.id === activeId)

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }

  useEffect(scrollToBottom, [active?.messages?.length])

  const newSession = () => {
    const id = Date.now()
    const s = { id, title: '新建会话', model: selectedModel, messages: [{ role: 'assistant', content: WELCOME }] }
    setSessions(prev => [s, ...prev])
    setActiveId(id)
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    // Add user message
    setSessions(prev => prev.map(s =>
      s.id === activeId
        ? {
            ...s,
            title: s.messages.length === 1 ? text.slice(0, 20) : s.title,
            messages: [...s.messages, { role: 'user', content: text }]
          }
        : s
    ))

    setLoading(true)

    try {
      const msgs = active.messages.filter(m => m.role !== 'system')
      msgs.push({ role: 'user', content: text })

      const res = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, messages: msgs, stream: false }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || '（无响应）'

      setSessions(prev => prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: 'assistant', content: reply }] }
          : s
      ))
    } catch (err) {
      setSessions(prev => prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: 'assistant', content: `请求失败：${err.message}` }] }
          : s
      ))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <ConsoleLayout kicker="Console / 聊天" subtitle="使用 AI 模型进行多轮对话。">
      <div className="chat-shell">
        {/* Session List */}
        <div className="chat-sessions">
          <div className="chat-sessions-header">
            <h3>会话列表</h3>
            <button className="button tiny" style={{ width: '100%' }} onClick={newSession}>
              + 新建会话
            </button>
          </div>
          <div className="chat-session-list">
            {sessions.map(s => (
              <div
                key={s.id}
                className={`chat-session-item${s.id === activeId ? ' active' : ''}`}
                onClick={() => setActiveId(s.id)}
              >
                <strong>{s.title}</strong>
                <span>{s.model} · {new Date().toLocaleDateString('zh-CN')}</span>
              </div>
            ))}
          </div>
          <div className="chat-sessions-footer">
            <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
              共 {sessions.length} 个会话
            </span>
          </div>
        </div>

        {/* Chat Main */}
        <div className="chat-main">
          <div className="chat-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <strong style={{ fontSize: 15 }}>{active?.title}</strong>
              <span className="badge blue">进行中</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                style={{ border: '1px solid var(--line)', borderRadius: 999, background: 'rgba(255,255,255,0.5)', padding: '6px 12px', fontSize: 14 }}
              >
                {models.length > 0
                  ? models.map(m => <option key={m} value={m}>{m}</option>)
                  : ['gpt-4o', 'gpt-4o-mini', 'claude-3-7-sonnet'].map(m => <option key={m} value={m}>{m}</option>)
                }
              </select>
            </div>
          </div>

          <div className="chat-messages" ref={messagesRef}>
            {active?.messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <span className="chat-msg-role">{m.role === 'user' ? '你' : '助手'}</span>
                <div className="chat-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <span className="chat-msg-role">助手</span>
                <div className="chat-bubble" style={{ opacity: 0.6 }}>
                  <span className="loading-spinner dark" />
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-bar">
            <textarea
              placeholder="输入消息，按 Enter 发送，Shift+Enter 换行…"
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="chat-send-btn" onClick={send} disabled={loading || !input.trim()}>
              发送
            </button>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  )
}
