import type { Screen, Member, Contribution } from '../types'
import { formatKES } from '../format'

type Props = {
  goTo: (screen: Screen) => void
  members: Member[]
  contributions: Contribution[]
  goal: number
  goalLabel: string
  currentUserId: string
}

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return letters || '?'
}

export default function Dashboard({
  goTo,
  members,
  contributions,
  goal,
  goalLabel,
  currentUserId,
}: Props) {
  const confirmed = contributions.filter((c) => c.status === 'confirmed')
  const total = confirmed.reduce((sum, c) => sum + c.amount, 0)
  const percent = Math.min(100, Math.round((total / goal) * 100))

  const myPending = contributions
    .filter((c) => c.status === 'pending' && c.memberId === currentUserId)
    .reduce((sum, c) => sum + c.amount, 0)

  const rows = members
    .map((m) => ({
      ...m,
      paid: confirmed
        .filter((c) => c.memberId === m.id)
        .reduce((sum, c) => sum + c.amount, 0),
    }))
    .sort((a, b) => b.paid - a.paid || a.name.localeCompare(b.name))

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-green sm:text-4xl">
        Group dashboard
      </h1>

      <section className="mt-6 rounded-3xl bg-brand-green p-6 text-white sm:p-8">
        <p className="text-sm font-bold tracking-widest text-orange-200 uppercase">
          Goal: {goalLabel}
        </p>
        <p className="mt-2 text-5xl font-bold sm:text-6xl">{formatKES(total)}</p>
        <p className="mt-1 text-white/80">saved together</p>

        <div
          className="mt-6 h-5 w-full overflow-hidden rounded-full bg-white/20"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-brand-orange transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-white/80">
          {percent}% of {formatKES(goal)}
        </p>
      </section>

      {myPending > 0 && (
        <p className="mt-4 rounded-2xl bg-orange-50 p-4 font-bold text-brand-orange">
          Waiting for the treasurer to confirm: {formatKES(myPending)}
        </p>
      )}

      {total === 0 && (
        <p className="mt-4 text-neutral-600">
          No confirmed contributions yet. Add the first one.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => goTo('contribute')}
          className="rounded-2xl bg-brand-orange px-8 py-4 text-lg font-bold text-white hover:opacity-90"
        >
          Add contribution
        </button>
        <button
          onClick={() => goTo('history')}
          className="rounded-2xl bg-sage px-8 py-4 text-lg font-bold text-brand-green hover:opacity-90"
        >
          View history
        </button>
      </div>

      <h2 className="mt-10 text-2xl font-bold text-brand-green">
        Members ({members.length})
      </h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-4 rounded-2xl bg-sage p-4"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green font-bold text-white">
              {initials(row.name)}
            </span>
            <span className="flex-1 font-bold text-neutral-800">
              {row.name}
              {row.id === currentUserId && (
                <span className="ml-2 text-sm font-normal text-neutral-500">
                  (you)
                </span>
              )}
            </span>
            <span className="font-bold text-brand-orange">
              {formatKES(row.paid)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}