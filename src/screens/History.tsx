import { useState } from 'react'
import type { Screen, Member, Contribution } from '../types'
import { formatKES } from '../format'

type Props = {
  goTo: (screen: Screen) => void
  members: Member[]
  contributions: Contribution[]
  currentUserId: string
  isTreasurer: boolean
  reload: () => void
}

type Filter = 'all' | 'mine'

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function History({
  goTo,
  members,
  contributions,
  currentUserId,
  isTreasurer,
  reload,
}: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const nameOf = (id: string) =>
    members.find((m) => m.id === id)?.name ?? 'Member'

  const visible =
    filter === 'mine'
      ? contributions.filter((c) => c.memberId === currentUserId)
      : contributions

  const confirmed = contributions.filter((c) => c.status === 'confirmed')
  const confirmedTotal = confirmed.reduce((sum, c) => sum + c.amount, 0)

  const tabClass = (active: boolean) =>
    'rounded-full px-5 py-2 font-bold ' +
    (active ? 'bg-brand-green text-white' : 'bg-sage text-brand-green')

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-green sm:text-4xl">
        Payment history
      </h1>
      <p className="mt-2 text-neutral-600">
        {confirmed.length} confirmed payments, {formatKES(confirmedTotal)} in total.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={() => setFilter('all')} className={tabClass(filter === 'all')}>
          Everyone
        </button>
        <button onClick={() => setFilter('mine')} className={tabClass(filter === 'mine')}>
          Mine
        </button>
        <button
          onClick={reload}
          className="ml-auto rounded-full border-2 border-sage px-5 py-2 font-bold text-brand-green hover:bg-sage"
        >
          Refresh
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-neutral-600">
          {filter === 'mine'
            ? 'You have not recorded a payment yet.'
            : 'No payments yet.'}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((c) => {
            const showCode = c.memberId === currentUserId || isTreasurer
            return (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-2xl bg-sage p-4"
              >
                <div className="flex-1">
                  <p className="font-bold text-neutral-800">
                    {nameOf(c.memberId)}
                    {c.memberId === currentUserId && (
                      <span className="ml-2 text-sm font-normal text-neutral-500">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {formatWhen(c.createdAt)}
                    {showCode && c.mpesaCode ? ` · ${c.mpesaCode}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand-orange">
                    {formatKES(c.amount)}
                  </p>
                  <span
                    className={
                      'mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ' +
                      (c.status === 'confirmed'
                        ? 'bg-brand-green text-white'
                        : 'bg-orange-100 text-brand-orange')
                    }
                  >
                    {c.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-8 rounded-2xl bg-orange-50 p-4 text-sm text-neutral-700">
        Payments can be added and confirmed, but nobody can edit or delete them
        from this website. That is how the record stays trusted.
      </p>

      <button
        onClick={() => goTo('dashboard')}
        className="mt-6 rounded-2xl bg-sage px-8 py-4 text-lg font-bold text-brand-green hover:opacity-90"
      >
        Back to dashboard
      </button>
    </div>
  )
}