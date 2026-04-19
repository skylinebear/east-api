/* EASTCREA v4 — Subscription Management */
import ConsoleLayout from '../../components/ConsoleLayout.jsx'
import { Link } from 'react-router-dom'

export default function Subscription() {
  return (
    <ConsoleLayout
      kicker="Console / 订阅管理"
      subtitle="管理账户订阅计划与账单周期"
      actions={<Link className="button tiny primary" to="/console/topup">钱包充值</Link>}
    >
      <div className="empty-card center">
        <h3>订阅功能</h3>
        <p>订阅功能正在完善中，敬请期待。如需增加账户额度，请前往钱包管理页面充值。</p>
        <Link className="button primary" to="/console/topup">前往充值</Link>
      </div>
    </ConsoleLayout>
  )
}
