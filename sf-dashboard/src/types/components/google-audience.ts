export interface googleAudienceData {
  name: string
  type: string
  traffic_source?: string
  account_id?: number

  segment: string
  lookalike: string[]
  customAudience: string[]
  yourData: string[]
  demographics: string[]
}
