export interface ReportLogPaymentFilter {
  start_date: string
  end_date: string
  type: string[]
  user_id: number[]
  account_manager: number[]
}

export interface ReportLogPaymentRequest {
  filter: ReportLogPaymentFilter
  page: number
  size: number
}

type Transaction = {
  type: string
  amount: number
  description: string
}

type MonthlyReport = {
  month: string
  transactions: Transaction[]
}

export type ReportResponse = {
  status: boolean
  data: MonthlyReport[]
}
