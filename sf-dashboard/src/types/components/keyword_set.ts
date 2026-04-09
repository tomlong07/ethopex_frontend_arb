export interface keywordSetType {
  id?: number
  name: string
  status: string
  keywords: KeyWordElement[]
  keyword_ab_test: boolean
  limit_keyword?: number
  limit_page_view?: number
  campaigns?: campaignType[]
  copyIdCampaign: string
  rpi?: string
  demand_source?: string,
  country : string,
  auto_optimize : boolean
}

export interface KeyWordElement {
  image?: string
  keyword: string
  status?: string
  created_at?: string
  page_view?: number
  conversion?: number
  rpm?: number
  rpc?: number
}

interface campaignType {
  id: number
  name: string
  status: string
}

export interface PayloadCampaignsUsedType {
  filter: {
    traffic_source: string[]
    demand_source: string[]
    status: string
    ai_status: string[]
    delivery_status: string | null
    keyword_status: string[]
    publisher: string[]
    linked_account: string[]
    account_supply: string[]
    labels: string[]
    created_by: number | null
    bidding: string[]
    start_date: string
    end_date: string
    filter_by: string
    search: string
  }
  page: number
  size: number
  customFilter: Record<string, any>
  sort: {
    field: string
    dir: 'asc' | 'desc'
  }[]
}
