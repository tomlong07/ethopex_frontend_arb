import api_v2 from '@/core/api_v2'

export const ctr_report_campaign = {
  Load: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report-campaign/load',
        data: payload,
      })) || {}
    )
  },

  ListCountry: async () => {
    return (
      (await api_v2.request({
        url: 'report-campaign/list-country',
      })) || {}
    )
  },

  ListDevice: async () => {
    return (
      (await api_v2.request({
        url: 'report-campaign/list-device',
      })) || {}
    )
  },

  ListLandingPage: async () => {
    return (
      (await api_v2.request({
        url: 'report-campaign/list-landing-page',
      })) || {}
    )
  },

  ListRegion: async () => {
    return (
      (await api_v2.request({
        url: 'report-campaign/list-region',
      })) || {}
    )
  },

  ListTrafficSource: async () => {
    return (
      (await api_v2.request({
        url: 'report-campaign/list-source',
      })) || {}
    )
  },

  ListPublisher: async () => {
    return (
      (await api_v2.request({
        url: 'filter/publisher-v2',
      })) || {}
    )
  },
}
