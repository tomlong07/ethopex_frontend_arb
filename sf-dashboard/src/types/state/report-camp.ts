export interface sortType {
  field: string
  dir: string
}
export interface reportChartType {
  title: string
  xAxis: any[]
  series: {}
  comparison: {} | null
}
export interface reportPayload {
  end_date: string
  start_date: string
  sort: sortType
  time_interval: string
  timezone: string
  currency: string
  filter: any
  group_by: string[]
  page: number
}
