import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { AuthContext } from './authContext'
import type { AuthContextValue } from './authContext'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      },
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const value: AuthContextValue = {
    session,
    loading,
    fullName: (session?.user.user_metadata?.full_name as string) ?? '',
    async signUp({ fullName, phone, email, password }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      })
      if (error) return { error: error.message }
      return { needsConfirmation: !data.session }
    },
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return error ? { error: error.message } : {}
    },
    async signOut() {
      await supabase.auth.signOut()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}