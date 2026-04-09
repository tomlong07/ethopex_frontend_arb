import { ONOFF } from '@/enum/campaign'

export interface CampaignKeyword {
  name: string
  status: 'on' | 'off'
  domain: string
  keyword_campaigns: KeywordCampaign[]
}
export interface KeywordCampaign {
  keyword: string
  campaign: number | null
  keyword_prelander: string
  domain_prelander: string | null
  status_prelander: ONOFF
}
