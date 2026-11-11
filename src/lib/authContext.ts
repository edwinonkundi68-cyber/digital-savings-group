import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthResult = { error?: string; needsConfirmation?: boolean }

export type AuthContextValue = {
  session: Session | null
  loading: boolean
  fullName: string
  signUp: (input: {
    fullName: string
    phone: string
    email: string
    password: string
  }) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}