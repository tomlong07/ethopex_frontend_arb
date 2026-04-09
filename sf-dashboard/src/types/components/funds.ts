export interface fundsData {
  user_id?: string
  amount: number
  source: string[]
  note: string
  status?: string
}
export interface fundsPayload {
  publisher: number[]
  page: number
  size: number
  search: string
}
