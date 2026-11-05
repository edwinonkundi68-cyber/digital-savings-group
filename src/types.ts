export type Screen = 'join' | 'dashboard' | 'contribute' | 'history'

export type Member = {
  id: number
  name: string
}

export type Contribution = {
  id: number
  memberId: number
  amount: number
  date: string
}