import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Member, Contribution } from '../types'

export type GroupData = {
  members: Member[]
  contributions: Contribution[]
  goal: number
  goalLabel: string
  isTreasurer: boolean
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: GroupData }

type DirectoryRow = { id: string; full_name: string }
type ContributionRow = {
  id: number
  member_id: string
  amount: number
  status: string
  created_at: string
  mpesa_code: string | null
}

async function fetchGroupData(): Promise<State> {
  const [settings, directory, contribs, treasurer] = await Promise.all([
    supabase
      .from('group_settings')
      .select('goal_amount, goal_label')
      .eq('id', 1)
      .single(),
    supabase.rpc('get_member_directory'),
    supabase
      .from('contributions')
      .select('id, member_id, amount, status, created_at, mpesa_code')
      .order('created_at', { ascending: false }),
    supabase.rpc('is_treasurer'),
  ])

  const failure =
    settings.error ?? directory.error ?? contribs.error ?? treasurer.error
  if (failure) return { status: 'error', message: failure.message }
  if (!settings.data) {
    return { status: 'error', message: 'Group settings were not found' }
  }

  return {
    status: 'ready',
    data: {
      goal: settings.data.goal_amount as number,
      goalLabel: settings.data.goal_label as string,
      isTreasurer: treasurer.data === true,
      members: ((directory.data ?? []) as DirectoryRow[]).map((m) => ({
        id: m.id,
        name: m.full_name || 'Member',
      })),
      contributions: ((contribs.data ?? []) as ContributionRow[]).map((c) => ({
        id: c.id,
        memberId: c.member_id,
        amount: c.amount,
        status: c.status as Contribution['status'],
        createdAt: c.created_at,
        mpesaCode: c.mpesa_code,
      })),
    },
  }
}

export function useGroupData() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchGroupData().then((next) => {
      if (!cancelled) setState(next)
    })
    return () => {
      cancelled = true
    }
  }, [version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { state, reload }
}