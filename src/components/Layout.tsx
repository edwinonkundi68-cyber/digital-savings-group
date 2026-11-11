import type { ReactNode } from 'react'
import type { Screen } from '../types'
import { useAuth } from '../lib/authContext'

type LayoutProps = {
  screen: Screen
  goTo: (screen: Screen) => void
  children: ReactNode
}

const links: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'contribute', label: 'Contribute' },
  { id: 'history', label: 'History' },
]

export default function Layout({ screen, goTo, children }: LayoutProps) {
  const { session, fullName, signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    goTo('join')
  }

  return (
    <div className="flex min-h-screen flex-col bg-sage text-neutral-900">
      <header className="bg-brand-green text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left text-xl font-bold">
            Digital Savings Group
            <span className="block text-sm font-normal text-orange-200">
              Soko la Mama Mboga
            </span>
          </div>

          {session && (
            <nav className="flex items-center gap-2 overflow-x-auto">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => goTo(link.id)}
                  className={
                    'rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap ' +
                    (screen === link.id
                      ? 'bg-white text-brand-green'
                      : 'text-white hover:bg-white/10')
                  }
                >
                  {link.label}
                </button>
              ))}
              <span className="hidden px-2 text-sm text-orange-200 md:inline">
                {fullName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/40 px-4 py-2 text-sm font-bold whitespace-nowrap hover:bg-white/10"
              >
                Log out
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">{children}</div>
      </main>

      <footer className="py-6 text-center text-sm text-neutral-500">
        Digital Savings Group · prototype demo
      </footer>
    </div>
  )
}