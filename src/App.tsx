import { useState } from 'react'
import Layout from './components/Layout'
import Join from './screens/Join'
import Dashboard from './screens/Dashboard'
import Contribute from './screens/Contribute'
import History from './screens/History'
import type { Screen } from './types'
import {
  GROUP_GOAL,
  GOAL_LABEL,
  initialMembers,
  initialContributions,
} from './data/group'

export default function App() {
  const [screen, setScreen] = useState<Screen>('join')
  const [contributions] = useState(initialContributions)
  const members = initialMembers

  return (
    <Layout screen={screen} goTo={setScreen}>
      {screen === 'join' && (
        <Join goTo={setScreen} />
      )}
      {screen === 'dashboard' && (
        <Dashboard
          goTo={setScreen}
          members={members}
          contributions={contributions}
          goal={GROUP_GOAL}
          goalLabel={GOAL_LABEL}
        />
      )}
      {screen === 'contribute' && <Contribute goTo={setScreen} />}
      {screen === 'history' && <History goTo={setScreen} />}
    </Layout>
  )
}