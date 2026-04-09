import { ONOFF } from '@/enum/campaign'

export interface domainConfigType {
  id?: number
  name: string
  status: string

  description?: string
  domain_id?: number
  domain_id_backup?: number | null
  traffic_sources_type?: string
  traffic_sources?: string[]
  ad_accounts_type: string
  ad_accounts?: string[]
  labels_type: string
  labels?: number[]
  adsense_accounts?: number[]
  adsense_accounts_backup?: number[]
  // mcc_type: string
  // mcc?: number[]
  campStatus?: string
  search?: string
  logs?: string
  logs_domain_config?: Log[]
  config_ab_test?: ConfigAB[]
  traffics_ab_test?: number | null
  history_domain_config?: HistoryDomainConfig[]
}

interface HistoryDomainConfig {
  campaign_number: number
  creative_number: number
  domain_id: number
  domain_name: string
  created_at: string
}

export interface ConfigAB {
  status: ONOFF
  domain: number | null
  priority: number | null
  account_adsense: number | null
}

export interface Log {
  created_at: string // Timestamp as a string (e.g., "2023-10-01T12:00:00Z")
  log: string // Log message
}
