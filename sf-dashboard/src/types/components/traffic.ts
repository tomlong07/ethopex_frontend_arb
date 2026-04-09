export interface trafficConfigType {
  id: number
  name: string
  show_name: string
  status: string
  demand_accept: number[]
  macro: macroType[]
  optimization_event: macroType[]
}
export interface macroType {
  name: string | null
  value: string
  status: string
}
