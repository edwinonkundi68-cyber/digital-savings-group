import type { Screen } from '../types'

type Props = { goTo: (screen: Screen) => void }

export default function History({ goTo }: Props) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-3xl font-bold text-brand-green">History</h1>
      <button
        onClick={() => goTo('dashboard')}
        className="mt-6 w-full rounded-2xl bg-sage py-4 text-lg font-bold text-brand-green"
      >
        Back
      </button>
    </div>
  )
}