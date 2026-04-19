/* EASTCREA v4 — App Router */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'

// Public pages
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Reset from './pages/Reset.jsx'
import Setup from './pages/Setup.jsx'
import Pricing from './pages/Pricing.jsx'
import About from './pages/About.jsx'
import Docs from './pages/Docs.jsx'
import NotFound from './pages/NotFound.jsx'
import { UserAgreement, PrivacyPolicy } from './pages/Legal.jsx'

// Console pages
import Dashboard from './pages/console/Dashboard.jsx'
import Token from './pages/console/Token.jsx'
import Log from './pages/console/Log.jsx'
import Personal from './pages/console/Personal.jsx'
import Topup from './pages/console/Topup.jsx'
import Playground from './pages/console/Playground.jsx'
import Chat from './pages/console/Chat.jsx'
import MidJourney from './pages/console/MidJourney.jsx'
import Task from './pages/console/Task.jsx'
import Subscription from './pages/console/Subscription.jsx'

// Admin pages
import Channel from './pages/console/Channel.jsx'
import User from './pages/console/User.jsx'
import Setting from './pages/console/Setting.jsx'
import Models from './pages/console/Models.jsx'
import Redemption from './pages/console/Redemption.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/user-agreement" element={<UserAgreement />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Console – User */}
          <Route path="/console" element={<Dashboard />} />
          <Route path="/console/token" element={<Token />} />
          <Route path="/console/log" element={<Log />} />
          <Route path="/console/personal" element={<Personal />} />
          <Route path="/console/topup" element={<Topup />} />
          <Route path="/console/playground" element={<Playground />} />
          <Route path="/console/chat" element={<Chat />} />
          <Route path="/console/midjourney" element={<MidJourney />} />
          <Route path="/console/task" element={<Task />} />
          <Route path="/console/subscription" element={<Subscription />} />

          {/* Console – Admin */}
          <Route path="/console/channel" element={<Channel />} />
          <Route path="/console/user" element={<User />} />
          <Route path="/console/setting" element={<Setting />} />
          <Route path="/console/models" element={<Models />} />
          <Route path="/console/redemption" element={<Redemption />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
