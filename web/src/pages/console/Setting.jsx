/* EASTCREA v4 — System Setting (Admin) */
import { useState, useEffect } from 'react'
import {
  getOptions, updateOption,
  cleanHistoryLogs,
  getPerfStats, getPerfLogs, clearDiskCache, resetPerfStats, forceGC, cleanPerfLogs,
} from '../../api.js'
import ConsoleLayout from '../../components/ConsoleLayout.jsx'

/* ── helpers ── */
const toBool = (v) => v === true || v === 'true'

const PANELS = [
  { key: 'ops',       label: '运营设置' },
  { key: 'dashboard', label: '仪表盘设置' },
  { key: 'chat',      label: '聊天设置' },
  { key: 'drawing',   label: '绘图设置' },
  { key: 'model',     label: '模型设置' },
  { key: 'pay',       label: '支付设置' },
  { key: 'perf',      label: '性能设置' },
  { key: 'ratelimit', label: '速率限制' },
  { key: 'ratio',     label: '倍率设置' },
  { key: 'system',    label: '系统设置' },
  { key: 'other',     label: '其他设置' },
]

export default function Setting() {
  const [activePanel, setActivePanel] = useState('ops')
  const [opts, setOpts] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  /* performance page state */
  const [perfStats, setPerfStats] = useState(null)
  const [perfLogs, setPerfLogs] = useState(null)
  const [logCleanMode, setLogCleanMode] = useState('by_count')
  const [logCleanValue, setLogCleanValue] = useState(10)
  const [perfLoading, setPerfLoading] = useState(false)

  /* log cleanup timestamp */
  const [cleanTs, setCleanTs] = useState('')

  useEffect(() => {
    getOptions()
      .then(r => {
        if (r?.success && Array.isArray(r.data)) {
          const obj = {}
          r.data.forEach(item => { obj[item.key] = item.value })
          setOpts(obj)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k) => (e) => {
    const val = e.target
      ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value)
      : e
    setOpts(o => ({ ...o, [k]: val }))
  }

  const flash = (text, err = false) => { setMsg(text); setIsError(err) }

  /* save a list of keys */
  const saveKeys = async (keys) => {
    setSaving(true)
    setMsg('')
    try {
      for (const k of keys) {
        if (opts[k] !== undefined) {
          await updateOption({ key: k, value: String(opts[k] ?? '') })
        }
      }
      flash('保存成功')
    } catch (e) { flash(e.message, true) }
    finally { setSaving(false) }
  }

  const Btn = ({ children, onClick, danger = false, small = false }) => (
    <button
      className={`button${danger ? ' danger' : ' primary'}${small ? ' small' : ''}`}
      onClick={onClick}
      disabled={saving}
    >
      {saving ? <span className="loading-spinner" /> : children}
    </button>
  )

  const Field = ({ label, note, children }) => (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {note && <span className="field-note">{note}</span>}
    </div>
  )

  const Section = ({ title, label, children, saveKeys: sk }) => (
    <article className="panel" style={{ marginBottom: 16 }}>
      {label && <span className="mini-label">{label}</span>}
      <h2 className="panel-title">{title}</h2>
      <div className="form-stack">
        {children}
        {sk && (
          <div className="button-row">
            <Btn onClick={() => saveKeys(sk)}>保存{title}</Btn>
          </div>
        )}
      </div>
    </article>
  )

  const Toggle = ({ k, label, note }) => (
    <Field label={note}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="checkbox"
          checked={toBool(opts[k])}
          onChange={(e) => setOpts(o => ({ ...o, [k]: e.target.checked }))}
          style={{ width: 'auto' }}
        />
        {label}
      </label>
    </Field>
  )

  const TextInput = ({ k, label, placeholder, type = 'text', note }) => (
    <Field label={label} note={note}>
      <input
        type={type}
        value={opts[k] ?? ''}
        placeholder={placeholder || ''}
        onChange={set(k)}
      />
    </Field>
  )

  const TextArea = ({ k, label, rows = 5, placeholder, note }) => (
    <Field label={label} note={note}>
      <textarea
        rows={rows}
        value={opts[k] ?? ''}
        placeholder={placeholder || ''}
        onChange={set(k)}
        style={{ fontFamily: 'var(--mono)', fontSize: 13 }}
      />
    </Field>
  )

  /* ── Performance helpers ─────────────────────────────── */
  const loadPerfStats = async () => {
    setPerfLoading(true)
    try {
      const [s, l] = await Promise.all([getPerfStats(), getPerfLogs()])
      if (s?.success) setPerfStats(s.data)
      if (l?.success) setPerfLogs(l.data)
    } catch {}
    finally { setPerfLoading(false) }
  }

  useEffect(() => {
    if (activePanel === 'perf') loadPerfStats()
  }, [activePanel])

  const fmtBytes = (b) => {
    if (!b) return '0 B'
    const k = 1024, s = ['B','KB','MB','GB']
    const i = Math.floor(Math.log(b) / Math.log(k))
    return (b / Math.pow(k, i)).toFixed(1) + ' ' + s[i]
  }

  /* ── Render ──────────────────────────────────────────── */
  if (loading) {
    return (
      <ConsoleLayout kicker="Console / 系统设置" subtitle="配置平台运营参数、模型行为与支付渠道">
        <div style={{ padding: 40, textAlign: 'center' }}><span className="loading-spinner dark" /></div>
      </ConsoleLayout>
    )
  }

  return (
    <ConsoleLayout kicker="Console / 系统设置" subtitle="配置平台运营参数、模型行为与支付渠道">
      {msg && <div className={`notice ${isError ? 'warn' : 'success'}`} style={{ marginBottom: 12 }}>{msg}</div>}

      <div className="setting-grid">
        <nav className="setting-nav">
          {PANELS.map(p => (
            <button
              key={p.key}
              className={activePanel === p.key ? 'active' : ''}
              onClick={() => setActivePanel(p.key)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div>
          {/* ════════════════ 运营设置 ════════════════ */}
          {activePanel === 'ops' && (<>
            <Section title="通用设置" label="General" saveKeys={[
              'TopUpLink','general_setting.docs_link','RetryTimes','USDExchangeRate','QuotaPerUnit',
              'DisplayTokenStatEnabled','DefaultCollapseSidebar','DemoSiteEnabled','SelfUseModeEnabled',
              'token_setting.max_user_tokens',
            ]}>
              <div className="form-grid">
                <TextInput k="TopUpLink" label="充值链接" placeholder="https://..." />
                <TextInput k="general_setting.docs_link" label="文档地址" placeholder="https://docs.example.com" />
                <TextInput k="RetryTimes" label="失败重试次数" type="number" placeholder="3" />
                <TextInput k="USDExchangeRate" label="USD 汇率（1 USD = X CNY）" type="number" placeholder="7.3" />
                <TextInput k="QuotaPerUnit" label="每美元对应 Token 数" type="number" placeholder="500000"
                  note="系统内部精度，默认 500000，谨慎修改" />
                <TextInput k="token_setting.max_user_tokens" label="每用户最大令牌数" type="number" placeholder="1000" />
              </div>
              <div className="form-grid">
                <Toggle k="DisplayTokenStatEnabled" label="额度查询接口返回令牌额度而非用户额度" />
                <Toggle k="DefaultCollapseSidebar" label="默认折叠侧边栏" />
                <Toggle k="DemoSiteEnabled" label="演示站点模式" />
                <Toggle k="SelfUseModeEnabled" label="自用模式（不限制必须设置模型倍率）" />
              </div>
            </Section>

            <Section title="额度设置" label="Quota" saveKeys={[
              'QuotaForNewUser','PreConsumedQuota','QuotaForInviter','QuotaForInvitee',
              'quota_setting.enable_free_model_pre_consume',
            ]}>
              <div className="form-grid">
                <TextInput k="QuotaForNewUser" label="新用户初始额度 (Token)" type="number" placeholder="0" />
                <TextInput k="PreConsumedQuota" label="请求预扣费额度 (Token)" type="number" placeholder="0"
                  note="请求结束后多退少补" />
                <TextInput k="QuotaForInviter" label="邀请新用户奖励额度 (Token)" type="number" placeholder="2000" />
                <TextInput k="QuotaForInvitee" label="新用户使用邀请码奖励额度 (Token)" type="number" placeholder="1000" />
              </div>
              <Toggle k="quota_setting.enable_free_model_pre_consume"
                label="对免费模型（倍率为 0 或价格为 0）也启用预消耗" />
            </Section>

            <Section title="签到设置" label="Checkin" saveKeys={[
              'checkin_setting.enabled','checkin_setting.min_quota','checkin_setting.max_quota',
            ]}>
              <div className="form-grid">
                <Toggle k="checkin_setting.enabled" label="启用签到功能" />
                <TextInput k="checkin_setting.min_quota" label="签到最小额度" type="number" placeholder="1000" />
                <TextInput k="checkin_setting.max_quota" label="签到最大额度" type="number" placeholder="10000" />
              </div>
            </Section>

            <Section title="屏蔽词过滤" label="Sensitive" saveKeys={[
              'CheckSensitiveEnabled','CheckSensitiveOnPromptEnabled','SensitiveWords',
            ]}>
              <div className="form-grid">
                <Toggle k="CheckSensitiveEnabled" label="启用屏蔽词过滤功能" />
                <Toggle k="CheckSensitiveOnPromptEnabled" label="启用 Prompt 检查" />
              </div>
              <TextArea k="SensitiveWords" label="屏蔽词列表（一行一个）" rows={6} />
            </Section>

            <Section title="日志设置" label="Log" saveKeys={['LogConsumeEnabled']}>
              <Toggle k="LogConsumeEnabled" label="启用额度消费日志记录" />
              <div className="form-grid" style={{ marginTop: 12 }}>
                <Field label="清除历史日志（删除此时间之前的所有日志）">
                  <input type="datetime-local" value={cleanTs} onChange={e => setCleanTs(e.target.value)} />
                </Field>
              </div>
              <div className="button-row">
                <Btn onClick={() => saveKeys(['LogConsumeEnabled'])}>保存日志设置</Btn>
                <button className="button danger" style={{ marginLeft: 8 }} onClick={async () => {
                  if (!cleanTs) { flash('请先选择时间', true); return }
                  const ts = Math.floor(new Date(cleanTs).getTime() / 1000)
                  if (!window.confirm(`确认删除 ${cleanTs} 之前的所有日志？此操作不可恢复`)) return
                  try {
                    setSaving(true)
                    const r = await cleanHistoryLogs(ts)
                    if (r?.success) flash(`已清理 ${r.data} 条日志`)
                    else flash(r?.message || '清理失败', true)
                  } catch (e) { flash(e.message, true) }
                  finally { setSaving(false) }
                }}>清除历史日志</button>
              </div>
            </Section>

            <Section title="监控设置" label="Monitor" saveKeys={[
              'ChannelDisableThreshold','QuotaRemindThreshold',
              'AutomaticDisableChannelEnabled','AutomaticEnableChannelEnabled',
              'monitor_setting.auto_test_channel_enabled','monitor_setting.auto_test_channel_minutes',
              'AutomaticDisableStatusCodes','AutomaticRetryStatusCodes','AutomaticDisableKeywords',
            ]}>
              <div className="form-grid">
                <Toggle k="monitor_setting.auto_test_channel_enabled" label="定时自动测试所有渠道" />
                <TextInput k="monitor_setting.auto_test_channel_minutes" label="自动测试间隔（分钟）" type="number" placeholder="10" />
                <TextInput k="ChannelDisableThreshold" label="渠道最长响应时间（秒）超时则禁用" type="number" placeholder="300" />
                <TextInput k="QuotaRemindThreshold" label="额度提醒阈值（Token）低于此值发邮件提醒" type="number" placeholder="1000" />
              </div>
              <div className="form-grid">
                <Toggle k="AutomaticDisableChannelEnabled" label="失败时自动禁用渠道" />
                <Toggle k="AutomaticEnableChannelEnabled" label="成功时自动启用渠道" />
              </div>
              <div className="form-grid">
                <TextInput k="AutomaticDisableStatusCodes" label="自动禁用状态码（逗号分隔，支持范围如 500-599）"
                  placeholder="401" note="出现这些 HTTP 状态码时自动禁用渠道" />
                <TextInput k="AutomaticRetryStatusCodes" label="自动重试状态码"
                  placeholder="100-199,300-399,500-503" note="504 和 524 始终不重试" />
              </div>
              <TextArea k="AutomaticDisableKeywords" label="自动禁用关键词（一行一个，不区分大小写）" rows={4}
                placeholder="error keyword&#10;another keyword" />
            </Section>
          </>)}

          {/* ════════════════ 仪表盘设置 ════════════════ */}
          {activePanel === 'dashboard' && (<>
            <Section title="数据看板" label="Dashboard" saveKeys={[
              'DataExportEnabled','DataExportDefaultTime','DataExportInterval',
            ]}>
              <div className="form-grid">
                <Toggle k="DataExportEnabled" label="启用数据看板" />
                <Field label="默认时间粒度">
                  <select value={opts.DataExportDefaultTime ?? 'hour'} onChange={set('DataExportDefaultTime')}>
                    <option value="hour">小时</option>
                    <option value="day">天</option>
                  </select>
                </Field>
                <TextInput k="DataExportInterval" label="数据导出间隔（分钟）" type="number" placeholder="5" />
              </div>
            </Section>

            <Section title="系统公告" label="Announcements" saveKeys={[
              'console_setting.announcements_enabled','console_setting.announcements',
            ]}>
              <Toggle k="console_setting.announcements_enabled" label="启用公告" />
              <TextArea k="console_setting.announcements" label="公告内容（支持 Markdown）" rows={6} />
            </Section>

            <Section title="API 信息" label="API Info" saveKeys={[
              'console_setting.api_info_enabled','console_setting.api_info',
            ]}>
              <Toggle k="console_setting.api_info_enabled" label="启用 API 信息展示" />
              <TextArea k="console_setting.api_info" label="API 信息内容（支持 Markdown）" rows={6} />
            </Section>

            <Section title="常见问答" label="FAQ" saveKeys={[
              'console_setting.faq_enabled','console_setting.faq',
            ]}>
              <Toggle k="console_setting.faq_enabled" label="启用 FAQ" />
              <TextArea k="console_setting.faq" label="FAQ 内容（支持 Markdown）" rows={6} />
            </Section>

            <Section title="Uptime Kuma 监控" label="Uptime" saveKeys={[
              'console_setting.uptime_kuma_enabled','console_setting.uptime_kuma_groups',
            ]}>
              <Toggle k="console_setting.uptime_kuma_enabled" label="启用 Uptime Kuma 状态展示" />
              <TextArea k="console_setting.uptime_kuma_groups" label="Uptime Kuma 分组配置（JSON）" rows={5}
                placeholder='[{"name":"API","slug":"api-status","url":"https://..."}]' />
            </Section>
          </>)}

          {/* ════════════════ 聊天设置 ════════════════ */}
          {activePanel === 'chat' && (
            <Section title="聊天入口设置" label="Chat" saveKeys={['Chats','ChatLink']}>
              <TextInput k="ChatLink" label={"聊天功能链接（前台\"立即体验\"按钮跳转）"} placeholder="https://" />
              <TextArea k="Chats" label="聊天入口配置（JSON 数组）" rows={10}
                placeholder='[{"name":"Chat","url":"https://...","description":"..."}]'
                note="配置多个聊天入口，JSON 数组格式" />
            </Section>
          )}

          {/* ════════════════ 绘图设置 ════════════════ */}
          {activePanel === 'drawing' && (
            <Section title="绘图设置" label="Drawing" saveKeys={[
              'DrawingEnabled','MjNotifyEnabled','MjAccountFilterEnabled',
              'MjForwardUrlEnabled','MjModeClearEnabled','MjActionCheckSuccessEnabled',
            ]}>
              <div className="form-grid">
                <Toggle k="DrawingEnabled" label="启用绘图功能" />
                <Toggle k="MjNotifyEnabled" label="启用 Midjourney 通知回调" />
                <Toggle k="MjAccountFilterEnabled" label="启用 Midjourney 账号过滤" />
                <Toggle k="MjForwardUrlEnabled" label="启用 Midjourney 转发 URL" />
                <Toggle k="MjModeClearEnabled" label="清除 Midjourney 模式参数" />
                <Toggle k="MjActionCheckSuccessEnabled" label="启用 Midjourney Action 成功检查" />
              </div>
            </Section>
          )}

          {/* ════════════════ 模型设置 ════════════════ */}
          {activePanel === 'model' && (<>
            <Section title="全局模型设置" label="Global" saveKeys={[
              'global.pass_through_request_enabled',
              'general_setting.ping_interval_enabled','general_setting.ping_interval_seconds',
              'global.thinking_model_blacklist','global.chat_completions_to_responses_policy',
            ]}>
              <div className="form-grid">
                <Toggle k="global.pass_through_request_enabled" label="启用请求透传（Pass-through）" />
                <Toggle k="general_setting.ping_interval_enabled" label="启用 Ping 心跳" />
                <TextInput k="general_setting.ping_interval_seconds" label="Ping 间隔（秒）" type="number" placeholder="60" />
              </div>
              <TextArea k="global.thinking_model_blacklist" label="思维链模型黑名单（JSON 数组）" rows={4}
                placeholder='["o1-mini","o1-preview"]' />
              <TextArea k="global.chat_completions_to_responses_policy" label="Chat Completions → Responses 策略（JSON）" rows={5}
                placeholder='{}' />
            </Section>

            <Section title="Gemini 设置" label="Gemini" saveKeys={[
              'gemini.safety_settings','gemini.version_settings','gemini.supported_imagine_models',
              'gemini.remove_function_response_id_enabled',
              'gemini.thinking_adapter_enabled','gemini.thinking_adapter_budget_tokens_percentage',
            ]}>
              <div className="form-grid">
                <Toggle k="gemini.remove_function_response_id_enabled" label="移除 Function Response ID" />
                <Toggle k="gemini.thinking_adapter_enabled" label="启用 Gemini 思维链适配器" />
                <TextInput k="gemini.thinking_adapter_budget_tokens_percentage"
                  label="思维链 Budget Tokens 比例" type="number" placeholder="0.6" />
              </div>
              <TextArea k="gemini.safety_settings" label="安全设置（JSON）" rows={6}
                placeholder='[{"category":"HARM_CATEGORY_HARASSMENT","threshold":"BLOCK_NONE"}]' />
              <TextArea k="gemini.version_settings" label="版本设置（JSON）" rows={4}
                placeholder='{}' />
              <TextArea k="gemini.supported_imagine_models" label="支持图像生成的模型（JSON 数组）" rows={3}
                placeholder='["gemini-2.0-flash-exp"]' />
            </Section>

            <Section title="Claude 设置" label="Claude" saveKeys={[
              'claude.model_headers_settings','claude.thinking_adapter_enabled',
              'claude.default_max_tokens','claude.thinking_adapter_budget_tokens_percentage',
            ]}>
              <div className="form-grid">
                <Toggle k="claude.thinking_adapter_enabled" label="启用 Claude 思维链适配器" />
                <TextInput k="claude.thinking_adapter_budget_tokens_percentage"
                  label="思维链 Budget Tokens 比例" type="number" placeholder="0.8" />
              </div>
              <TextArea k="claude.model_headers_settings" label="模型请求头设置（JSON）" rows={5}
                placeholder='{}' />
              <TextArea k="claude.default_max_tokens" label="默认 Max Tokens（JSON，按模型配置）" rows={4}
                placeholder='{"claude-opus-4-5":8192}' />
            </Section>

            <Section title="Grok 设置" label="Grok" saveKeys={[
              'grok.violation_deduction_enabled','grok.violation_deduction_amount',
            ]}>
              <div className="form-grid">
                <Toggle k="grok.violation_deduction_enabled" label="启用违规扣费" />
                <TextInput k="grok.violation_deduction_amount" label="违规扣费金额（USD）" type="number" placeholder="0.05" />
              </div>
            </Section>
          </>)}

          {/* ════════════════ 支付设置 ════════════════ */}
          {activePanel === 'pay' && (<>
            <Section title="通用支付设置" label="Payment" saveKeys={[
              'Price','MinTopUp','TopupGroupRatio','CustomCallbackAddress','PayMethods',
              'payment_setting.amount_options','payment_setting.amount_discount',
            ]}>
              <div className="form-grid">
                <TextInput k="Price" label="单位美元售价（用户充值比例）" type="number" placeholder="7.3" />
                <TextInput k="MinTopUp" label="最小充值金额" type="number" placeholder="1" />
                <TextInput k="CustomCallbackAddress" label="自定义回调地址" placeholder="https://..." />
              </div>
              <TextArea k="TopupGroupRatio" label="充值分组倍率（JSON）" rows={4}
                placeholder='{"default":1,"vip":1.2}' />
              <TextArea k="PayMethods" label="支付方式配置（JSON）" rows={3} placeholder='["alipay","wechat"]' />
              <TextArea k="payment_setting.amount_options" label="充值金额选项（JSON 数组）" rows={3}
                placeholder='[10,30,50,100,200,500]' />
              <TextArea k="payment_setting.amount_discount" label="充值折扣配置（JSON）" rows={4}
                placeholder='{"100":0.95,"500":0.9}' />
            </Section>

            <Section title="易支付（Epay）" label="Epay" saveKeys={['PayAddress','EpayId','EpayKey']}>
              <div className="form-grid">
                <TextInput k="PayAddress" label="易支付接口地址" placeholder="https://pay.example.com" />
                <TextInput k="EpayId" label="易支付商户 ID" />
                <TextInput k="EpayKey" label="易支付商户密钥" />
              </div>
            </Section>

            <Section title="Stripe" label="Stripe" saveKeys={[
              'StripeApiSecret','StripeWebhookSecret','StripePriceId',
              'StripeUnitPrice','StripeMinTopUp','StripePromotionCodesEnabled',
            ]}>
              <div className="form-grid">
                <TextInput k="StripeApiSecret" label="Stripe API Secret" placeholder="sk_live_..." />
                <TextInput k="StripeWebhookSecret" label="Stripe Webhook Secret" placeholder="whsec_..." />
                <TextInput k="StripePriceId" label="Stripe Price ID" placeholder="price_..." />
                <TextInput k="StripeUnitPrice" label="Stripe 单位价格" type="number" placeholder="8.0" />
                <TextInput k="StripeMinTopUp" label="Stripe 最小充值额" type="number" placeholder="1" />
              </div>
              <Toggle k="StripePromotionCodesEnabled" label="启用 Stripe 优惠码" />
            </Section>
          </>)}

          {/* ════════════════ 性能设置 ════════════════ */}
          {activePanel === 'perf' && (<>
            <Section title="磁盘缓存设置" label="Disk Cache" saveKeys={[
              'performance_setting.disk_cache_enabled',
              'performance_setting.disk_cache_threshold_mb',
              'performance_setting.disk_cache_max_size_mb',
              'performance_setting.disk_cache_path',
            ]}>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
                启用后，大请求体将临时存储到磁盘而非内存，可显著降低内存占用，建议在 SSD 环境下使用。
              </p>
              <div className="form-grid">
                <Toggle k="performance_setting.disk_cache_enabled" label="启用磁盘缓存" />
                <TextInput k="performance_setting.disk_cache_threshold_mb"
                  label="磁盘缓存阈值 (MB)" type="number" placeholder="10"
                  note="请求体超过此大小时使用磁盘缓存" />
                <TextInput k="performance_setting.disk_cache_max_size_mb"
                  label="磁盘缓存最大总量 (MB)" type="number" placeholder="1024" />
                <TextInput k="performance_setting.disk_cache_path"
                  label="缓存目录（留空用系统临时目录）" placeholder="/var/cache/new-api" />
              </div>
            </Section>

            <Section title="系统性能监控" label="Monitor" saveKeys={[
              'performance_setting.monitor_enabled',
              'performance_setting.monitor_cpu_threshold',
              'performance_setting.monitor_memory_threshold',
              'performance_setting.monitor_disk_threshold',
            ]}>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
                启用后，当系统资源使用率超过阈值时，将拒绝新的 Relay 请求，以保护系统稳定性。
              </p>
              <div className="form-grid">
                <Toggle k="performance_setting.monitor_enabled" label="启用性能监控" />
                <TextInput k="performance_setting.monitor_cpu_threshold"
                  label="CPU 阈值 (%)" type="number" placeholder="90" />
                <TextInput k="performance_setting.monitor_memory_threshold"
                  label="内存阈值 (%)" type="number" placeholder="90" />
                <TextInput k="performance_setting.monitor_disk_threshold"
                  label="磁盘阈值 (%)" type="number" placeholder="95" />
              </div>
            </Section>

            {/* Performance stats display */}
            <article className="panel" style={{ marginBottom: 16 }}>
              <span className="mini-label">Stats</span>
              <h2 className="panel-title">性能统计</h2>
              <div className="button-row" style={{ marginBottom: 12 }}>
                <button className="button primary small" onClick={loadPerfStats} disabled={perfLoading}>
                  {perfLoading ? <span className="loading-spinner" /> : '刷新统计'}
                </button>
                <button className="button small" style={{ marginLeft: 6 }} onClick={async () => {
                  if (!window.confirm('清理不活跃的磁盘缓存文件？')) return
                  try { await clearDiskCache(); flash('磁盘缓存已清理'); loadPerfStats() }
                  catch (e) { flash(e.message, true) }
                }}>清理不活跃缓存</button>
                <button className="button small" style={{ marginLeft: 6 }} onClick={async () => {
                  try { await resetPerfStats(); flash('统计已重置'); loadPerfStats() }
                  catch (e) { flash(e.message, true) }
                }}>重置统计</button>
                <button className="button small" style={{ marginLeft: 6 }} onClick={async () => {
                  try { await forceGC(); flash('GC 已执行'); loadPerfStats() }
                  catch (e) { flash(e.message, true) }
                }}>执行 GC</button>
              </div>
              {perfStats && (
                <div className="stats-grid">
                  <div className="stat-card"><span className="stat-value">{fmtBytes(perfStats.memory_stats?.alloc)}</span><span className="stat-label">已分配内存</span></div>
                  <div className="stat-card"><span className="stat-value">{perfStats.memory_stats?.num_goroutine}</span><span className="stat-label">Goroutine 数</span></div>
                  <div className="stat-card"><span className="stat-value">{perfStats.memory_stats?.num_gc}</span><span className="stat-label">GC 次数</span></div>
                  <div className="stat-card"><span className="stat-value">{fmtBytes(perfStats.cache_stats?.current_disk_usage_bytes)}</span><span className="stat-label">磁盘缓存占用</span></div>
                </div>
              )}
            </article>

            {/* Log cleanup */}
            <article className="panel" style={{ marginBottom: 16 }}>
              <span className="mini-label">Logs</span>
              <h2 className="panel-title">服务器日志管理</h2>
              {perfLogs && (
                <div className="form-stack">
                  {perfLogs.enabled ? (<>
                    <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>
                      日志目录：{perfLogs.log_dir} &nbsp;|&nbsp;
                      文件数：{perfLogs.file_count} &nbsp;|&nbsp;
                      总大小：{fmtBytes(perfLogs.total_size)}
                    </div>
                    <div className="form-grid">
                      <Field label="清理方式">
                        <select value={logCleanMode} onChange={e => setLogCleanMode(e.target.value)}>
                          <option value="by_count">保留最近 N 个文件</option>
                          <option value="by_days">保留最近 N 天</option>
                        </select>
                      </Field>
                      <Field label={logCleanMode === 'by_count' ? '保留文件数' : '保留天数'}>
                        <input type="number" value={logCleanValue} min={1}
                          onChange={e => setLogCleanValue(Number(e.target.value))} />
                      </Field>
                    </div>
                    <div className="button-row">
                      <button className="button danger" onClick={async () => {
                        if (!window.confirm(`确认清理日志？将${logCleanMode === 'by_count' ? `保留最近 ${logCleanValue} 个文件` : `删除 ${logCleanValue} 天前的文件`}`)) return
                        try {
                          const r = await cleanPerfLogs(logCleanMode, logCleanValue)
                          if (r?.success) {
                            const d = r.data
                            flash(`已清理 ${d.deleted_count} 个文件，释放 ${fmtBytes(d.freed_bytes)}`)
                          } else flash(r?.message || '清理失败', true)
                          loadPerfStats()
                        } catch (e) { flash(e.message, true) }
                      }}>清理日志文件</button>
                    </div>
                  </>) : (
                    <p style={{ color: 'var(--ink-3)', fontSize: 13 }}>服务器日志功能未启用（未配置日志目录）</p>
                  )}
                </div>
              )}
            </article>
          </>)}

          {/* ════════════════ 速率限制 ════════════════ */}
          {activePanel === 'ratelimit' && (
            <Section title="请求速率限制" label="Rate Limit" saveKeys={[
              'ModelRequestRateLimitEnabled',
              'ModelRequestRateLimitCount',
              'ModelRequestRateLimitSuccessCount',
              'ModelRequestRateLimitDurationMinutes',
              'ModelRequestRateLimitGroup',
            ]}>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
                控制每个用户在指定时间窗口内的 AI 请求次数上限。
              </p>
              <div className="form-grid">
                <Toggle k="ModelRequestRateLimitEnabled" label="启用请求速率限制" />
                <TextInput k="ModelRequestRateLimitCount"
                  label="时间窗口内最大请求次数（0 = 不限）" type="number" placeholder="0" />
                <TextInput k="ModelRequestRateLimitSuccessCount"
                  label="时间窗口内最大成功次数" type="number" placeholder="1000" />
                <TextInput k="ModelRequestRateLimitDurationMinutes"
                  label="时间窗口（分钟）" type="number" placeholder="1" />
              </div>
              <TextArea k="ModelRequestRateLimitGroup" label="分组速率限制配置（JSON）" rows={6}
                placeholder='{"vip":{"count":10000,"success_count":5000}}'
                note="按分组配置不同的速率限制" />
            </Section>
          )}

          {/* ════════════════ 倍率设置 ════════════════ */}
          {activePanel === 'ratio' && (<>
            <Section title="分组与倍率设置" label="Ratio" saveKeys={[
              'GroupRatio','GroupGroupRatio','AutoGroups','DefaultUseAutoGroup',
              'ExposeRatioEnabled','UserUsableGroups','group_ratio_setting.group_special_usable_group',
            ]}>
              <div className="form-grid">
                <Toggle k="DefaultUseAutoGroup" label="默认使用自动分组" />
                <Toggle k="ExposeRatioEnabled" label="向用户公开模型倍率" />
              </div>
              <TextArea k="GroupRatio" label="分组倍率（JSON，key=组名 value=倍率）" rows={5}
                placeholder='{"default":1,"vip":2}' />
              <TextArea k="GroupGroupRatio" label="分组嵌套倍率（JSON）" rows={4} placeholder='{}' />
              <TextArea k="AutoGroups" label="自动分组列表（JSON 数组）" rows={3}
                placeholder='["default","vip"]' />
              <TextArea k="UserUsableGroups" label="用户可用分组（JSON 数组）" rows={3}
                placeholder='["default"]' />
              <TextArea k="group_ratio_setting.group_special_usable_group"
                label="分组特殊可用组配置（JSON）" rows={4} placeholder='{}' />
            </Section>

            <Section title="模型定价倍率" label="Model Ratio" saveKeys={[
              'ModelRatio','CompletionRatio','ModelPrice',
              'CacheRatio','CreateCacheRatio','ImageRatio','AudioRatio','AudioCompletionRatio',
            ]}>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
                JSON 格式，key 为模型名称，value 为倍率（相对于 GPT-3.5 基准的倍数）。
              </p>
              <TextArea k="ModelRatio" label="模型输入倍率（ModelRatio）" rows={6}
                placeholder='{"gpt-4o":5,"gpt-4o-mini":0.075}' />
              <TextArea k="CompletionRatio" label="模型输出倍率（CompletionRatio）" rows={5}
                placeholder='{"gpt-4o":4}' />
              <TextArea k="ModelPrice" label="固定模型价格（USD，不使用倍率计费）" rows={5}
                placeholder='{"dall-e-3":0.04}' />
              <TextArea k="CacheRatio" label="缓存 Token 倍率（CacheRatio）" rows={4} placeholder='{}' />
              <TextArea k="CreateCacheRatio" label="创建缓存倍率（CreateCacheRatio）" rows={4} placeholder='{}' />
              <TextArea k="ImageRatio" label="图像生成倍率（ImageRatio）" rows={4} placeholder='{}' />
              <TextArea k="AudioRatio" label="音频输入倍率（AudioRatio）" rows={4} placeholder='{}' />
              <TextArea k="AudioCompletionRatio" label="音频输出倍率（AudioCompletionRatio）" rows={4} placeholder='{}' />
            </Section>
          </>)}

          {/* ════════════════ 系统设置 ════════════════ */}
          {activePanel === 'system' && (<>
            <Section title="注册与登录" label="Auth" saveKeys={[
              'PasswordLoginEnabled','PasswordRegisterEnabled','EmailVerificationEnabled',
              'RegisterEnabled','EmailDomainRestrictionEnabled','EmailAliasRestrictionEnabled','EmailDomainWhitelist',
            ]}>
              <div className="form-grid">
                <Toggle k="PasswordLoginEnabled" label="允许密码登录" />
                <Toggle k="PasswordRegisterEnabled" label="允许密码注册" />
                <Toggle k="EmailVerificationEnabled" label="启用邮箱验证" />
                <Toggle k="RegisterEnabled" label="允许新用户注册" />
                <Toggle k="EmailDomainRestrictionEnabled" label="启用邮箱域名白名单" />
                <Toggle k="EmailAliasRestrictionEnabled" label="禁止邮箱别名注册" />
              </div>
              <TextInput k="EmailDomainWhitelist" label="邮箱域名白名单（逗号分隔）"
                placeholder="example.com,school.edu"
                note="启用域名限制后，只允许这些域名的邮箱注册" />
            </Section>

            <Section title="GitHub OAuth" label="GitHub" saveKeys={[
              'GitHubOAuthEnabled','GitHubClientId','GitHubClientSecret',
            ]}>
              <Toggle k="GitHubOAuthEnabled" label="启用 GitHub OAuth 登录" />
              <div className="form-grid">
                <TextInput k="GitHubClientId" label="GitHub Client ID" />
                <TextInput k="GitHubClientSecret" label="GitHub Client Secret" />
              </div>
            </Section>

            <Section title="Discord OAuth" label="Discord" saveKeys={[
              'discord.enabled','discord.client_id','discord.client_secret',
            ]}>
              <Toggle k="discord.enabled" label="启用 Discord OAuth 登录" />
              <div className="form-grid">
                <TextInput k="discord.client_id" label="Discord Client ID" />
                <TextInput k="discord.client_secret" label="Discord Client Secret" />
              </div>
            </Section>

            <Section title="OIDC 登录" label="OIDC" saveKeys={[
              'oidc.enabled','oidc.client_id','oidc.client_secret','oidc.well_known',
              'oidc.authorization_endpoint','oidc.token_endpoint','oidc.user_info_endpoint',
            ]}>
              <Toggle k="oidc.enabled" label="启用 OIDC 登录" />
              <div className="form-grid">
                <TextInput k="oidc.client_id" label="OIDC Client ID" />
                <TextInput k="oidc.client_secret" label="OIDC Client Secret" />
                <TextInput k="oidc.well_known" label="Well-Known URL" placeholder="https://.../.well-known/openid-configuration" />
                <TextInput k="oidc.authorization_endpoint" label="Authorization Endpoint" />
                <TextInput k="oidc.token_endpoint" label="Token Endpoint" />
                <TextInput k="oidc.user_info_endpoint" label="User Info Endpoint" />
              </div>
            </Section>

            <Section title="Telegram 登录" label="Telegram" saveKeys={[
              'TelegramOAuthEnabled','TelegramBotToken','TelegramBotName',
            ]}>
              <Toggle k="TelegramOAuthEnabled" label="启用 Telegram 登录" />
              <div className="form-grid">
                <TextInput k="TelegramBotToken" label="Bot Token" />
                <TextInput k="TelegramBotName" label="Bot 用户名" placeholder="@mybot" />
              </div>
            </Section>

            <Section title="微信登录" label="WeChat" saveKeys={[
              'WeChatAuthEnabled','WeChatServerAddress','WeChatServerToken','WeChatAccountQRCodeImageURL',
            ]}>
              <Toggle k="WeChatAuthEnabled" label="启用微信登录" />
              <div className="form-grid">
                <TextInput k="WeChatServerAddress" label="WeChat Server 地址" placeholder="https://..." />
                <TextInput k="WeChatServerToken" label="WeChat Server Token" />
                <TextInput k="WeChatAccountQRCodeImageURL" label="公众号二维码图片 URL" />
              </div>
            </Section>

            <Section title="SMTP 邮件" label="SMTP" saveKeys={[
              'SMTPServer','SMTPPort','SMTPAccount','SMTPFrom','SMTPToken',
              'SMTPSSLEnabled','SMTPForceAuthLogin',
            ]}>
              <div className="form-grid">
                <TextInput k="SMTPServer" label="SMTP 服务器" placeholder="smtp.example.com" />
                <TextInput k="SMTPPort" label="端口" type="number" placeholder="465" />
                <TextInput k="SMTPAccount" label="账号" placeholder="no-reply@example.com" />
                <TextInput k="SMTPFrom" label="发件人名称" placeholder="EASTCREA" />
                <TextInput k="SMTPToken" label="密码 / Token" />
              </div>
              <div className="form-grid">
                <Toggle k="SMTPSSLEnabled" label="启用 SSL" />
                <Toggle k="SMTPForceAuthLogin" label="强制 AUTH LOGIN" />
              </div>
            </Section>

            <Section title="Turnstile 验证" label="Turnstile" saveKeys={[
              'TurnstileCheckEnabled','TurnstileSiteKey','TurnstileSecretKey',
            ]}>
              <Toggle k="TurnstileCheckEnabled" label="启用 Turnstile 人机验证" />
              <div className="form-grid">
                <TextInput k="TurnstileSiteKey" label="Site Key" />
                <TextInput k="TurnstileSecretKey" label="Secret Key" />
              </div>
            </Section>

            <Section title="Worker 配置" label="Worker" saveKeys={[
              'WorkerUrl','WorkerValidKey','WorkerAllowHttpImageRequestEnabled',
            ]}>
              <div className="form-grid">
                <TextInput k="WorkerUrl" label="Worker URL" placeholder="https://worker.example.com" />
                <TextInput k="WorkerValidKey" label="Worker 验证 Key" />
              </div>
              <Toggle k="WorkerAllowHttpImageRequestEnabled" label="允许 Worker 发起 HTTP 图片请求" />
            </Section>
          </>)}

          {/* ════════════════ 其他设置 ════════════════ */}
          {activePanel === 'other' && (<>
            <Section title="站点信息" label="Site" saveKeys={['SystemName','Logo','Footer','Notice']}>
              <div className="form-grid">
                <TextInput k="SystemName" label="站点名称" placeholder="EASTCREA" />
                <TextInput k="Logo" label="站点 Logo URL" placeholder="https://..." />
              </div>
              <TextInput k="Footer" label="页脚内容（支持 HTML）" placeholder="© 2025 EASTCREA" />
              <TextArea k="Notice" label="首页公告" rows={4} />
            </Section>

            <Section title="首页内容" label="Home" saveKeys={['About','HomePageContent']}>
              <TextArea k="About" label="关于页内容（支持 Markdown）" rows={6} />
              <TextArea k="HomePageContent" label="首页自定义内容（支持 Markdown）" rows={6} />
            </Section>

            <Section title="法律文档" label="Legal" saveKeys={[
              'legal.user_agreement','legal.privacy_policy',
            ]}>
              <TextArea k="legal.user_agreement" label="用户协议（支持 Markdown）" rows={8} />
              <TextArea k="legal.privacy_policy" label="隐私政策（支持 Markdown）" rows={8} />
            </Section>
          </>)}
        </div>
      </div>
    </ConsoleLayout>
  )
}
