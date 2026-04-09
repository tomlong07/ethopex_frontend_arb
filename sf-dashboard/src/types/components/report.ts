import { ColumnDefinition } from 'tabulator-tables'

interface reportTotal {
  [key: string]: any
}
interface reportItem {
  [key: string]: any
}

export interface reportDataV2 {
  columns: columnsTypeV2[]
  items: reportItem[]
  plk: string
  recordsTotal: number
  total: reportTotal
}

interface reportSorter {
  dir: string
  field: string
}

export interface reportPayload {
  page: number
  size: number
  search: string
  group_by: string[]
  sort: reportSorter[]
  filter: any
  dateRange?: any
}

export interface reportProfile {
  auto_sync: boolean
  hide_chart: boolean
  id: number
  name: string
  plk: string
  user_id: number
  column_display: string
  group_by: string
  filters: string
  charts: string
  settings?: string
}

interface columnsTypeV2 extends ColumnDefinition {
  gr_by_accepted?: string[]
  title: string
  disabled?: boolean
}
