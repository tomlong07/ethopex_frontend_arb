export interface paymentDataType {
  plk: string
  records_total: number
  results: paymentType[]
}

export interface paymentType {
  id: number
  time: string
  amount: number
  method: string
}
