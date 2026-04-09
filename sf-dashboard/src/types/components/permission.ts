export interface permissionType {
  id: number
  name: string
  description: string
  traffic_source: string[]
  demand_source: string[]
  account_traffic: number[]
  account_demand: number[]
  role_inheritance: number[]
  permission: { [key: string]: string[] }
}
