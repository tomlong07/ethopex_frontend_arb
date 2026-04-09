import api_v2 from '@/core/api_v2'

export const ctr_filter = {
  FilterSection: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'filter/section',
        params: payload.params,
      })) || {}
    )
  },

  FilterPublisher: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'filter/publisher',
        params: payload.params,
      })) || {}
    )
  },

  FilterManager: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'filter/manager',
        params: payload.params,
      })) || {}
    )
  },

  FilterCampaign: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'filter/campaign',
        params: payload.params,
      })) || {}
    )
  },

  FilterLabel: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/filter/label',
        params: payload.params,
      })) || {}
    )
  },
}
