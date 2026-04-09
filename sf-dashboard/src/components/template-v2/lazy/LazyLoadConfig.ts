import { LazyLoadInputV2 } from "@/class/template_v2"

export interface LazyLoadConfig {
  inputs: LazyLoadInputV2[]
  fields: string[]
}

export function getLazyLoadConfig(colV2: string): LazyLoadConfig {
  switch (colV2) {
    case 'campaign_j46':
      return {
        inputs: [
          { key: 'campaign_ids', type: 'data_array', base: 'id', response: 'campaign_id' },
          { key: 'start_date', type: 'payload' },
          { key: 'end_date', type: 'payload' }
        ],
        fields: ['profit_rt'], 
      }
    default:
      return { inputs: [], fields: [] }
  }
}

export function hasLazyLoadConfig(colV2: string) {
  const lazyPages = [
    'campaign_j46',
  ]

  return lazyPages.includes(colV2)
}