// Mỗi điều kiện gồm: loại điều kiện, toán tử, và giá trị
export interface Condition {
  condition_type: ConditionType // Loại điều kiện (impression, placement, etc.)
  condition_operator: string | null // Toán tử so sánh (>, <, =, contains, etc.)
  condition_value: string | null // Giá trị để so sánh
}

export interface LogicOperator {
  conditions: Condition[] // Danh sách các điều kiện trong nhóm
}

// định nghĩa cấu trúc của Google Performance Rule
export interface GooglePerformanceRule {
  id?: number
  name: string
  description: string
  status?: string
  auto_apply: boolean
  is_run_daily?: boolean
  status_apply: 'whitelist' | 'blacklist'
  is_and_or: boolean // Logic giữa các nhóm: true = AND, false = OR
  logic_operators: LogicOperator[] // Danh sách các nhóm điều kiện
}

// Key là mã toán tử, value là tên hiển thị
export interface OperatorOptions {
  [key: string]: string // Ví dụ: { "gt": "Greater than", "eq": "Equal to" }
}

// định nghĩa cấu hình cho từng loại điều kiện
export interface ConditionConfig {
  name: string // Tên hiển thị của loại điều kiện
  operator: OperatorOptions // Các toán tử có thể dùng cho loại điều kiện này
  value: string[] | null // Danh sách giá trị có thể chọn (null nếu cho phép nhập tự do)
}

// ConditionType
export type ConditionType =
  | 'created_at'
  | 'impression'
  | 'placement'
  | 'placement_status'
  | 'query_selector'
  | 'text_content'

// định nghĩa cấu trúc dữ liệu config trả về từ API
export interface ConfigData {
  created_at: ConditionConfig
  impression: ConditionConfig
  placement: ConditionConfig
  placement_status: ConditionConfig
  query_selector: ConditionConfig
  text_content: ConditionConfig
}

// Được transform từ ConfigData để phục vụ cho component select
export interface ConditionOption {
  label: string // Tên hiển thị trong select box
  value: string // Giá trị thực tế (ConditionType)
  operators: OperatorOptions // Các toán tử có thể dùng cho option này
  valueOptions?: string[] // Danh sách giá trị có thể chọn (nếu có)
}

// Response của satify rule trả về( hiển thị trong modal)
export interface SatisfyResponse {
  total: number
  total_pending: number
  total_running: number
  total_success: number
  total_error: number
  total_scanned: number
  items: {
    id: number
    domain: string
    placement_status: string
    log: string
    impression: number
    created_at: string
    updated_at: string
  }[]
}
export interface SatisfyRulePayload {
  page?: number
  limit?: number
  search?: string
  order?: string
}
