import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Screen } from '../types'
import { formatKES } from '../format'
import { useAuth } from '../lib/authContext'

type Props = {
  goTo: (screen: Screen) => void
  memberCount: number
  total: number
}

type Mode = 'signup' | 'login'

type Errors = {
  name?: string
  phone?: string
  email?: string
  password?: string
  form?: string
}

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

export default function Join({ goTo, memberCount, total }: Props) {
  const { signUp, signIn } = useAuth()
  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const isSignup = mode === 'signup'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setNotice('')
    const newErrors: Errors = {}

    if (isSignup) {
      if (name.trim().length < 2) newErrors.name = 'Please enter your name'
      if (!/^(07|01)\d{8}$/.test(phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Enter a valid number, e.g. 0712 345 678'
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address'
    }
    if (isSignup) {
      const strong =
        password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
      if (!strong) {
        newErrors.password = 'At least 8 characters, with a letter and a number'
      }
    } else if (password.length === 0) {
      newErrors.password = 'Enter your password'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setBusy(true)
    const result = isSignup
      ? await signUp({
          fullName: name.trim(),
          phone: phone.replace(/\s/g, ''),
          email: email.trim(),
          password,
        })
      : await signIn(email.trim(), password)
    setBusy(false)

    if (result.error) {
      setErrors({ form: result.error })
      return
    }
    if (result.needsConfirmation) {
      setNotice('Check your email to confirm your account, then log in.')
      setMode('login')
      return
    }
    goTo('dashboard')
  }

  const inputClass = (hasError: boolean) =>
    'w-full rounded-2xl border-2 bg-white px-4 py-4 text-lg focus:outline-none ' +
    (hasError
      ? 'border-red-500'
      : 'border-neutral-200 focus:border-brand-green')

  const fieldError = (msg?: string) =>
    msg ? <p className="mt-1 text-sm font-bold text-red-600">{msg}</p> : null

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
            <p className="text-3xl font-bold text-brand-orange">{memberCount}</p>
            <p className="text-sm text-neutral-600">members</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 text-center">
            <p className="text-3xl font-bold text-brand-orange">
              {formatKES(total)}
            </p>
            <p className="text-sm text-neutral-600">saved together</p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl bg-sage p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-brand-green">
          {isSignup ? 'Join the group' : 'Log in'}
        </h2>

        {notice && (
          <p className="mt-4 rounded-xl bg-white p-3 text-sm font-bold text-brand-green">
            {notice}
          </p>
        )}

        {isSignup && (
          <>
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
            {fieldError(errors.name)}

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
            {fieldError(errors.phone)}
          </>
        )}

        <label
          htmlFor="email"
          className={'block font-bold text-brand-green ' + (isSignup ? 'mt-5' : 'mt-6')}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className={inputClass(!!errors.email)}
        />
        {fieldError(errors.email)}

        <label htmlFor="password" className="mt-5 block font-bold text-brand-green">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          className={inputClass(!!errors.password)}
        />
        {fieldError(errors.password)}

        {errors.form && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full rounded-2xl bg-brand-green py-4 text-xl font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Please wait...' : isSignup ? 'Join the group' : 'Log in'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? 'login' : 'signup')
            setErrors({})
            setNotice('')
          }}
          className="mt-4 w-full text-center font-bold text-brand-green underline"
        >
          {isSignup ? 'Already a member? Log in' : 'New here? Join the group'}
        </button>
      </form>
    </div>
  )
}