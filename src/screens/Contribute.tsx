import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Screen, Member, Contribution } from '../types'
import { formatKES } from '../format'
import { supabase } from '../lib/supabase'

type Props = {
  goTo: (screen: Screen) => void
  members: Member[]
  contributions: Contribution[]
  currentUserId: string
  isTreasurer: boolean
  reload: () => void
}

type FormErrors = { amount?: string; code?: string; form?: string }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Contribute({
  goTo,
  members,
  contributions,
  currentUserId,
  isTreasurer,
  reload,
}: Props) {
  const [amount, setAmount] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [confirmError, setConfirmError] = useState('')

  const nameOf = (id: string) =>
    members.find((m) => m.id === id)?.name ?? 'Member'

  const mine = contributions
    .filter((c) => c.memberId === currentUserId)
    .slice(0, 5)
  const waiting = contributions.filter((c) => c.status === 'pending')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSuccess('')
    const newErrors: FormErrors = {}

    const value = Number(amount)
    if (!Number.isInteger(value) || value < 1 || value > 500000) {
      newErrors.amount = 'Enter a whole amount between KES 1 and 500,000'
    }
    const cleanCode = code.trim().toUpperCase()
    if (!/^[A-Z0-9]{10}$/.test(cleanCode)) {
      newErrors.code = 'The M-Pesa code has 10 letters and numbers'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setBusy(true)
    const { error } = await supabase.from('contributions').insert({
      member_id: currentUserId,
      amount: value,
      mpesa_code: cleanCode,
    })
    setBusy(false)

    if (error) {
      setErrors({
        form:
          error.code === '23505'
            ? 'This M-Pesa code has already been recorded.'
            : 'Could not record the payment: ' + error.message,
      })
      return
    }

    setAmount('')
    setCode('')
    setSuccess(
      `Asante! ${formatKES(value)} is recorded and waiting for the treasurer to confirm.`,
    )
    reload()
  }

  async function handleConfirm(id: number) {
    setConfirmError('')
    setConfirmingId(id)
    const { data, error } = await supabase
      .from('contributions')
      .update({
        status: 'confirmed',
        confirmed_by: currentUserId,
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'pending')
      .select('id')
    setConfirmingId(null)

    if (error) {
      setConfirmError('Could not confirm: ' + error.message)
      return
    }
    if (!data || data.length === 0) {
      setConfirmError(
        'Could not confirm. It may already be confirmed, or you may not be the treasurer.',
      )
      return
    }
    reload()
  }

  const inputClass = (hasError: boolean) =>
    'w-full rounded-2xl border-2 bg-white px-4 py-4 text-lg focus:outline-none ' +
    (hasError
      ? 'border-red-500'
      : 'border-neutral-200 focus:border-brand-green')

  const steps = [
    'Send your money by M-Pesa to your group, as you do now.',
    'Enter the amount and the code from your M-Pesa message below.',
    'The treasurer checks it and confirms. Then it joins the group total.',
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-green sm:text-4xl">
        Add contribution
      </h1>

      <ol className="mt-6 space-y-3">
        {steps.map((text, i) => (
          <li
            key={text}
            className="flex items-center gap-4 rounded-2xl bg-sage p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green font-bold text-white">
              {i + 1}
            </span>
            <span className="text-neutral-800">{text}</span>
          </li>
        ))}
      </ol>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 rounded-3xl bg-sage p-6 sm:p-8"
      >
        <label htmlFor="amount" className="block font-bold text-brand-green">
          Amount (KES)
        </label>
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 200"
          className={inputClass(!!errors.amount)}
        />
        {errors.amount && (
          <p className="mt-1 text-sm font-bold text-red-600">{errors.amount}</p>
        )}

        <label htmlFor="code" className="mt-5 block font-bold text-brand-green">
          M-Pesa code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. QJK4Z5X7ML"
          maxLength={10}
          autoCapitalize="characters"
          className={inputClass(!!errors.code) + ' uppercase'}
        />
        {errors.code && (
          <p className="mt-1 text-sm font-bold text-red-600">{errors.code}</p>
        )}

        {errors.form && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {errors.form}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-xl bg-white p-3 font-bold text-brand-green">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full rounded-2xl bg-brand-orange py-4 text-xl font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Please wait...' : 'Record my payment'}
        </button>
      </form>

      {isTreasurer && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-brand-green">
            Waiting for your confirmation ({waiting.length})
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Compare each code with your own M-Pesa message before you confirm.
          </p>
          {confirmError && (
            <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
              {confirmError}
            </p>
          )}
          {waiting.length === 0 ? (
            <p className="mt-4 text-neutral-600">Nothing is waiting.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {waiting.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-2xl bg-orange-50 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <p className="font-bold text-neutral-800">
                      {nameOf(c.memberId)}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {c.mpesaCode} · {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-brand-orange">
                    {formatKES(c.amount)}
                  </p>
                  <button
                    onClick={() => handleConfirm(c.id)}
                    disabled={confirmingId === c.id}
                    className="rounded-2xl bg-brand-green px-6 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
                  >
                    {confirmingId === c.id ? 'Confirming...' : 'Confirm'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-brand-green">My recent payments</h2>
        {mine.length === 0 ? (
          <p className="mt-4 text-neutral-600">You have not recorded a payment yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {mine.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-2xl bg-sage p-4"
              >
                <div className="flex-1">
                  <p className="font-bold text-neutral-800">{formatKES(c.amount)}</p>
                  <p className="text-sm text-neutral-600">
                    {c.mpesaCode ?? 'No code'} · {formatDate(c.createdAt)}
                  </p>
                </div>
                <span
                  className={
                    'rounded-full px-3 py-1 text-sm font-bold ' +
                    (c.status === 'confirmed'
                      ? 'bg-brand-green text-white'
                      : 'bg-orange-100 text-brand-orange')
                  }
                >
                  {c.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => goTo('dashboard')}
          className="mt-6 rounded-2xl bg-sage px-8 py-4 text-lg font-bold text-brand-green hover:opacity-90"
        >
          Back to dashboard
        </button>
      </section>
    </div>
  )
}