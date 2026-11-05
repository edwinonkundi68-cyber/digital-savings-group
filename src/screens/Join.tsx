import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Screen } from '../types'

type Props = { goTo: (screen: Screen) => void }

type Errors = { name?: string; phone?: string }

function StallIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#1F4D3A" />
      <rect x="24" y="30" width="52" height="14" rx="3" fill="#fff" />
      <circle cx="33" cy="44" r="9" fill="#fff" />
      <circle cx="50" cy="44" r="9" fill="#fff" />
      <circle cx="67" cy="44" r="9" fill="#fff" />
      <rect x="29" y="48" width="42" height="24" rx="2" fill="#fff" />
      <rect x="42" y="54" width="16" height="18" fill="#1F4D3A" />
    </svg>
  )
}

export default function Join({ goTo }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors: Errors = {}

    if (name.trim().length < 2) {
      newErrors.name = 'Please enter your name'
    }
    if (!/^(07|01)\d{8}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid number, e.g. 0712 345 678'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      goTo('dashboard')
    }
  }

  const inputClass = (hasError: boolean) =>
    'w-full rounded-2xl border-2 bg-white px-4 py-4 text-lg focus:outline-none ' +
    (hasError
      ? 'border-red-500'
      : 'border-neutral-200 focus:border-brand-green')

  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <section className="text-center md:text-left">
        <div className="flex justify-center md:justify-start">
          <StallIcon />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-brand-green sm:text-5xl">
          Digital Savings Group
        </h1>
        <p className="mt-2 text-2xl font-bold text-brand-orange">
          Soko la Mama Mboga
        </p>
        <p className="mt-3 text-lg text-neutral-600">
          Save together. See every shilling.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-orange-50 p-4 text-center">
            <p className="text-3xl font-bold text-brand-orange">12</p>
            <p className="text-sm text-neutral-600">members</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 text-center">
            <p className="text-3xl font-bold text-brand-orange">KES 8,400</p>
            <p className="text-sm text-neutral-600">saved together</p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl bg-sage p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-brand-green">Join the group</h2>

        <label htmlFor="name" className="mt-6 block font-bold text-brand-green">
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mama Wanjiku"
          autoComplete="name"
          className={inputClass(!!errors.name)}
        />
        {errors.name && (
          <p className="mt-1 text-sm font-bold text-red-600">{errors.name}</p>
        )}

        <label htmlFor="phone" className="mt-5 block font-bold text-brand-green">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XX XXX XXX"
          autoComplete="tel"
          className={inputClass(!!errors.phone)}
        />
        {errors.phone && (
          <p className="mt-1 text-sm font-bold text-red-600">{errors.phone}</p>
        )}

        <button
          type="submit"
          className="mt-8 w-full rounded-2xl bg-brand-green py-4 text-xl font-bold text-white hover:opacity-90"
        >
          Join the group
        </button>
      </form>
    </div>
  )
}