import type { Member, Contribution } from '../types'

export const GROUP_GOAL = 20000
export const GOAL_LABEL = 'Stock money'

export const initialMembers: Member[] = [
  { id: 1, name: 'Mama Wanjiku' },
  { id: 2, name: 'Mama Achieng' },
  { id: 3, name: 'Mama Njeri' },
  { id: 4, name: 'Mama Atieno' },
  { id: 5, name: 'Mama Wairimu' },
  { id: 6, name: 'Mama Akinyi' },
  { id: 7, name: 'Mama Muthoni' },
  { id: 8, name: 'Mama Nyokabi' },
]

export const initialContributions: Contribution[] = [
  { id: 1, memberId: 1, amount: 1500, date: '2026-10-20' },
  { id: 2, memberId: 2, amount: 1200, date: '2026-10-21' },
  { id: 3, memberId: 3, amount: 1100, date: '2026-10-21' },
  { id: 4, memberId: 4, amount: 1000, date: '2026-10-22' },
  { id: 5, memberId: 5, amount: 900, date: '2026-10-23' },
  { id: 6, memberId: 6, amount: 800, date: '2026-10-23' },
  { id: 7, memberId: 7, amount: 1100, date: '2026-10-24' },
  { id: 8, memberId: 8, amount: 800, date: '2026-10-25' },
]