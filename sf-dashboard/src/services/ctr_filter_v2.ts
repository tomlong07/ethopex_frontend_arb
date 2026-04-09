import api_v2 from '@/core/api_v2'

export const ctr_filter_v2 = {
  FilterGeo: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/geo-v2',
        params: params,
      })) || {}
    )
  },

  FilterLandingPage: async (params: any, data: any) => {
    return (
      (await api_v2.request({
        url: 'filter/landing-page',
        params: params,
        data: data,
      })) || []
    )
  },

  FilterLandingPageReport: async (params: any) => {
    return (
      (await api_v2.request({
        url: 'filter/landing-page/report',
        params: params,
        data: { filter: { status: ['on'] } },
      })) || []
    )
  },

  FilterAdAccountId: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/ad_account_id',
        params: params,
      })) || {}
    )
  },

  FilterAccount: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/account',
        params: params,
      })) || {}
    )
  },

  FilterAccountSupply: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/account_supply',
        params: params,
      })) || {}
    )
  },

  FilterTrafficSource: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/traffic-source-v2',
        params: params,
      })) || {}
    )
  },

  FilterDemandSource: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/demand-source-v2',
        params: params,
      })) || {}
    )
  },

  FilterPublisher: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/publisher-v2',
        params: params,
      })) || {}
    )
  },

  FilterCampaign: async (params: any = {}) => {
    return (
      (await api_v2.request({
        url: 'filter/campaign-v2',
        params: params,
      })) || {}
    )
  },

  FilterKeywordSet: async (params: any) => {
    const result = await api_v2.request({
      url: 'filter/keyword-set',
      params: params,
    })
    return result || {}
  },

  FilterKeywordSetReport: async (params: any) => {
    const result = await api_v2.request({
      url: 'filter/keyword-set-report',
      params: params,
    })
    return result || {}
  },

  FilterSupplyAccountAd: async (params: any) => {
    const result = await api_v2.request({
      url: 'filter/supply-account-ad',
      params: params,
    })
    return result || {}
  },
  FilterLayout: async (params: any) => {
    return (
      (await api_v2.request({
        url: '/filter/layout',
        params: params,
      })) || {}
    )
  },

  FilterDomain: async (params: any) => {
    return (
      (await api_v2.request({
        url: '/filter/domain?v=domain',
        params: params,
      })) || {}
    )
  },
  FilterPixel: async (params: any) => {
    const result = await api_v2.request({
      url: '/filter/pixel',
      params: params,
    })
    return result || {}
  },

  OptionTarget: async () => {
    const result = await api_v2.request({
      url: '/rule/get-facebook-option-target',
    })
    return result || {}
  },

  GetFilterLabelDomain: async () => {
    const result = await api_v2.request({
      url: '/domain/filter-label',
    })
    return result || {}
  },
  GetFilterSupplyAccountAdLabel: async () => {
    const result = await api_v2.request({
      url: '/filter/supply-account-ad/label',
    })
    return result || {}
  },

  GetFilterCampaignTags: async (params: any) => {
    return (
      (await api_v2.request({
        url: '/campaign/search-tag',
        data: params,
      })) || {}
    )
  },

  GetFilterMcc: async () => {
    const result = await api_v2.request({
      url: '/filter/mcc',
    })
    return result || {}
  },

  TrafficSourceAddCampaign: async (url: string, params: any = {}) => {
    if (!url) return
    return (
      (await api_v2.request({
        url: url,
        params: params,
      })) || {}
    )
  },

  GetCreativeType: async () => {
    return (
      (await api_v2.request({
        url: `/type/creative`,
      })) || {}
    )
  },
}
