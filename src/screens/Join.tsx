import type { Screen } from '../types'

type Props = { goTo: (screen: Screen) => void }

export default function Join({ goTo }: Props) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-3xl font-bold text-brand-green">Join screen</h1>
      <button
        onClick={() => goTo('dashboard')}
        className="mt-6 w-full rounded-2xl bg-brand-green py-4 text-lg font-bold text-white"
      >
        Join the group
      </button>
    </div>
  )
}