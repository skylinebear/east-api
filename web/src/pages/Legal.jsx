/* EASTCREA v4 — Legal Pages */
import Layout from '../components/Layout.jsx'

export function UserAgreement() {
  return (
    <Layout>
      <main className="public-main">
        <article className="legal-card">
          <span className="mini-label">Legal</span>
          <h1>用户协议</h1>
          <div className="legal-body">
            <p>最后更新：2026年4月</p>
            <h2>服务说明</h2>
            <p>欢迎使用 EASTCREA AI 模型聚合网关。在使用本服务前，请仔细阅读以下服务条款。使用本服务即表示您同意这些条款。</p>
            <h2>服务内容</h2>
            <p>EASTCREA 提供以下服务：</p>
            <ul>
              <li>AI 模型 API 聚合与代理服务</li>
              <li>统一的 OpenAI 兼容接口</li>
              <li>令牌管理、额度控制与使用统计</li>
              <li>多模型路由与负载均衡</li>
            </ul>
            <h2>用户责任</h2>
            <ul>
              <li>用户须合法合规地使用本服务，遵守所在地区法律法规</li>
              <li>禁止将本服务用于违法、欺诈、骚扰或其他有害目的</li>
              <li>禁止滥用 API 额度或尝试绕过系统限制</li>
              <li>用户须妥善保管账户凭证，因凭证泄露造成的损失由用户自行承担</li>
              <li>用户对通过本服务发送的内容负完全责任</li>
            </ul>
            <h2>服务限制</h2>
            <p>我们保留因以下原因暂停或终止服务的权利：违反服务条款、滥用行为、异常流量等。</p>
            <h2>服务变更</h2>
            <p>我们保留随时修改服务条款、功能和定价的权利。重大变更将通过站内通知提前告知。</p>
            <h2>免责声明</h2>
            <p>本服务按"现状"提供，不对服务的可用性、准确性或特定用途作出保证。我们不对因使用本服务导致的任何损失负责。</p>
          </div>
          <div className="legal-meta">
            <span>© 2026 EASTCREA</span>
          </div>
        </article>
      </main>
    </Layout>
  )
}

export function PrivacyPolicy() {
  return (
    <Layout>
      <main className="public-main">
        <article className="legal-card">
          <span className="mini-label">Legal</span>
          <h1>隐私政策</h1>
          <div className="legal-body">
            <p>最后更新：2026年4月</p>
            <h2>信息收集</h2>
            <p>我们收集以下类型的信息：</p>
            <ul>
              <li>账户信息：注册时提供的用户名和邮箱地址</li>
              <li>使用数据：API 请求日志、模型调用记录、Token 用量统计</li>
              <li>设备信息：浏览器类型、IP 地址（用于安全验证）</li>
            </ul>
            <h2>信息使用</h2>
            <p>收集的信息用于：</p>
            <ul>
              <li>提供和改进服务</li>
              <li>账单计算与额度管理</li>
              <li>安全保护与风险防控</li>
              <li>服务通知与技术支持</li>
            </ul>
            <h2>信息共享</h2>
            <p>我们不会出售您的个人信息给第三方。仅在以下情况下共享信息：</p>
            <ul>
              <li>获得您明确同意</li>
              <li>法律要求或政府合法请求</li>
              <li>保护平台安全和用户权益</li>
            </ul>
            <h2>数据安全</h2>
            <p>我们采用行业标准的加密传输（HTTPS）和存储措施，定期进行安全审计，保障您的数据安全。</p>
            <h2>Cookie</h2>
            <p>本服务使用 Cookie 保持您的登录状态。您可以在浏览器中禁用 Cookie，但这可能影响服务功能。</p>
            <h2>联系我们</h2>
            <p>如对本隐私政策有任何疑问，请通过平台内渠道联系我们。</p>
          </div>
          <div className="legal-meta">
            <span>© 2026 EASTCREA</span>
          </div>
        </article>
      </main>
    </Layout>
  )
}
