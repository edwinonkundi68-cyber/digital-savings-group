import { useState } from 'react'
import Layout from './components/Layout'
import Join from './screens/Join'
import Dashboard from './screens/Dashboard'
import Contribute from './screens/Contribute'
import History from './screens/History'
import type { Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('join')

  return (
    <Layout screen={screen} goTo={setScreen}>
      {screen === 'join' && <Join goTo={setScreen} />}
      {screen === 'dashboard' && <Dashboard goTo={setScreen} />}
      {screen === 'contribute' && <Contribute goTo={setScreen} />}
      {screen === 'history' && <History goTo={setScreen} />}
    </Layout>
  )
}