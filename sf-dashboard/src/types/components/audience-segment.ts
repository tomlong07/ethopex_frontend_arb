export interface audienceSegmentData {
  name?: string
  type?: string
  segment_type?: string
  traffic_source?: string
  account_id?: number
  keyword?: string
  keyword_search?: string
  location?: string
  language?: string
  segment?: string
  lookalike_segment?: string
  custom_segment?: string[]
}

export class loadingManager {
  loadingCustom: boolean
  loadingLookalike: boolean
  loadingYourData: boolean

  constructor() {
    this.loadingCustom = false
    this.loadingLookalike = false
    this.loadingYourData = false
  }
}
