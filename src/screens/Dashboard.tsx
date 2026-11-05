import type { Screen } from '../types'

type Props = { goTo: (screen: Screen) => void }

export default function Dashboard({ goTo }: Props) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-3xl font-bold text-brand-green">Dashboard</h1>
      <button
        onClick={() => goTo('contribute')}
        className="mt-6 w-full rounded-2xl bg-brand-orange py-4 text-lg font-bold text-white"
      >
        Add contribution
      </button>
      <button
        onClick={() => goTo('history')}
        className="mt-3 w-full rounded-2xl bg-brand-green py-4 text-lg font-bold text-white"
      >
        History
      </button>
      <button
        onClick={() => goTo('join')}
        className="mt-3 w-full rounded-2xl bg-sage py-4 text-lg font-bold text-brand-green"
      >
        Back
      </button>
    </div>
  )
}