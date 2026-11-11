import { useState } from 'react'
import Layout from './components/Layout'
import Join from './screens/Join'
import Dashboard from './screens/Dashboard'
import Contribute from './screens/Contribute'
import History from './screens/History'
import type { Screen } from './types'
import AuthProvider from './lib/AuthProvider'
import { useAuth } from './lib/authContext'
import {
  GROUP_GOAL,
  GOAL_LABEL,
  initialMembers,
  initialContributions,
} from './data/group'

function AppContent() {
  const { session, loading } = useAuth()
  const [screen, setScreen] = useState<Screen>('join')
  const [contributions] = useState(initialContributions)
  const members = initialMembers

  const total = contributions.reduce((sum, c) => sum + c.amount, 0)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sage font-bold text-brand-green">
        Loading...
      </div>
    )
  }

  const current: Screen = session
    ? screen === 'join'
      ? 'dashboard'
      : screen
    : 'join'

  return (
    <Layout screen={current} goTo={setScreen}>
      {current === 'join' && (
        <Join goTo={setScreen} memberCount={members.length} total={total} />
      )}
      {current === 'dashboard' && (
        <Dashboard
          goTo={setScreen}
          members={members}
          contributions={contributions}
          goal={GROUP_GOAL}
          goalLabel={GOAL_LABEL}
        />
      )}
      {current === 'contribute' && <Contribute goTo={setScreen} />}
      {current === 'history' && <History goTo={setScreen} />}
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}