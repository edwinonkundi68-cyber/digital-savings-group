export type Screen = 'join' | 'dashboard' | 'contribute' | 'history'

export type Member = {
  id: string
  name: string
}

export type Contribution = {
  id: number
  memberId: string
  amount: number
  status: 'pending' | 'confirmed'
  createdAt: string
}