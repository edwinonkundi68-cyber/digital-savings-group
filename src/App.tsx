import { useState } from 'react'
import Layout from './components/Layout'
import Join from './screens/Join'
import Dashboard from './screens/Dashboard'
import Contribute from './screens/Contribute'
import History from './screens/History'
import type { Screen } from './types'
import AuthProvider from './lib/AuthProvider'
import { useAuth } from './lib/authContext'
import { useGroupData } from './lib/useGroupData'

function MemberArea({ userId }: { userId: string }) {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const { state, reload } = useGroupData()
  const needsData = screen !== 'history'

  return (
    <Layout screen={screen} goTo={setScreen}>
      {needsData && state.status === 'loading' && (
        <p className="font-bold text-brand-green">Loading...</p>
      )}

      {needsData && state.status === 'error' && (
        <div>
          <p className="font-bold text-red-700">
            Could not load the group data: {state.message}
          </p>
          <button
            onClick={reload}
            className="mt-4 rounded-2xl bg-brand-green px-6 py-3 font-bold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {screen === 'dashboard' && state.status === 'ready' && (
        <Dashboard
          goTo={setScreen}
          members={state.data.members}
          contributions={state.data.contributions}
          goal={state.data.goal}
          goalLabel={state.data.goalLabel}
          currentUserId={userId}
        />
      )}

      {screen === 'contribute' && state.status === 'ready' && (
        <Contribute
          goTo={setScreen}
          members={state.data.members}
          contributions={state.data.contributions}
          currentUserId={userId}
          isTreasurer={state.data.isTreasurer}
          reload={reload}
        />
      )}

      {screen === 'history' && <History goTo={setScreen} />}
    </Layout>
  )
}

function AppContent() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sage font-bold text-brand-green">
        Loading...
      </div>
    )
  }

  if (!session) {
    return (
      <Layout screen="join" goTo={() => {}}>
        <Join />
      </Layout>
    )
  }

  return <MemberArea key={session.user.id} userId={session.user.id} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}