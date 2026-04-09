export interface pixelManagerConfigType {
  name: string
  status: string
  traffic_source: string | null
  pixel_id: string
  pixel_token: string
  pixel_events: pixelEvents[]
  publisher: number | null
  link_test_pixel?: string
}

export interface pixelEvents {
  action: string[]
  properties: string[]
  event: string | null
}

export interface pixelTriggersConfigType {
  name: string
  status: string
  pixel_ids: string[]
  triggers: pixelTrigger[]
  publisher: number | null
}

export interface pixelTrigger {
  field: string | null
  condition: string
  value: string[] | number[]
}

export interface tableInfo {
  data: any[]

  loading: boolean
  page: number
  pageSize: number
  total: number
  search: string
  searchTimeout: ReturnType<typeof setTimeout> | null

  columnDefs: any[]
  rowData: any[]
}
