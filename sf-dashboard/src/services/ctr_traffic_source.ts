import api_v2 from '@/core/api_v2'

export const ctr_traffic_source = {
  GetAllTrafficSource: async () => {
    return (await api_v2.request({ url: 'traffic-source/get-all' })) || {}
  },

  GetCountries: async (params: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-country',
        params: params,
      })) || {}
    )
  },

  GetLanguage: async (traffic_source: string | undefined) => {
    if (!traffic_source) return {}

    return (
      (await api_v2.request({
        url: 'traffic-source/get-language',
        params: { traffic_source: traffic_source },
      })) || {}
    )
  },

  GetDevice: async (traffic_source: string | undefined) => {
    if (!traffic_source) return {}

    return (
      (await api_v2.request({
        url: 'traffic-source/get-device',
        params: { traffic_source: traffic_source },
      })) || {}
    )
  },

  GetBidding: async (params: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-bidding',
        params: params,
      })) || {}
    )
  },

  GetAccount: async (
    traffic_source: string | undefined,
    search: string,
    limit: number,
    id: number | undefined = undefined
  ) => {
    if (!traffic_source) return null
    const result = await api_v2.request({
      url: 'traffic-source/get-account',
      params: {
        object: traffic_source,
        q: search,
        limit: limit,
        id: id,
      },
    })

    return result || {}
  },

  GetAccountByTrafficSource: async (data: any) => {
    const result = await api_v2.request({
      url: 'traffic-source/get-all-account',
      data: data,
    })

    return result || {}
  },

  GetAccountV2: async (params: any) => {
    const result = await api_v2.request({
      url: 'traffic-source/get-account',
      params: params,
    })

    return result || {}
  },

  GetType: async (traffic_source: string | undefined) => {
    if (!traffic_source) return {}

    const result = await api_v2.request({
      url: 'traffic-source/get-type',
      params: { traffic_source: traffic_source },
    })

    return result || {}
  },

  GetInventories: async (payload: any) => {
    const result = await api_v2.request({
      url: 'traffic-source/get-inventories',
      data: payload,
    })
    return result || {}
  },

  TargetingPocPoc: async (payload: any) => {
    const result = await api_v2.request({
      url: 'traffic-source/target-pocpoc',
      params: payload.params,
    })
    return result || {}
  },

  AddConfig: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/add-config',
        data: payload,
      })) || {}
    )
  },

  EditConfig: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/edit-config',
        data: payload,
      })) || {}
    )
  },

  TrafficSourceAccept: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `traffic-source/supply-accept?demand=${payload.demand}`,
      })) || {}
    )
  },

  GetByID: async (id: number) => {
    return (
      (await api_v2.request({ url: `traffic-source/get-by-id/${id}` })) || {}
    )
  },

  GetEvent: async (traffic: string) => {
    return (
      (await api_v2.request({
        url: '/traffic-source/get-event/' + traffic,
        method: 'POST',
      })) || {}
    )
  },

  CheckRemoveEvent: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/check-remove-event',
        data: payload,
      })) || {}
    )
  },

  GetInfoAudience: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-info-audience',
        data: payload,
      })) || {}
    )
  },

  GetFacebookPage: async (params: any, payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-facebook-page',
        params: params,
        data: payload,
      })) || {}
    )
  },

  GetFacebookPixel: async (params: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-facebook-pixel',
        params: params,
      })) || {}
    )
  },
  GetAllDemographics: async () => {
    return (
      (await api_v2.request({
        url: '/audience-segment/get-all-demographics',
      })) || {}
    )
  },

  GetTargetingSuggest: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-targeting-suggest',
        data: payload,
      })) || {}
    )
  },

  GetFacebookPost: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-facebook-post',
        data: payload,
      })) || {}
    )
  },

  SyncFacebookPageV2: async (url: string) => {
    return (
      (await api_v2.request({
        url: url,
      })) || {}
    )
  },

  GetFacebookFanpage: async (page_id: string) => {
    return (
      (await api_v2.request({
        url: 'traffic-source/get-facebook-fanpage',
        data: { page_id: page_id },
      })) || {}
    )
  },
  AccountIdGet: async (id: any) => {
    return (
      (await api_v2.request({
        url: `/pixel/list-pixel-snapchat-by-account/${id}`,
      })) || {}
    )
  },

  GetPixelByAcc: async (data: any) => {
    const result = await api_v2.request({
      url: '/accounts/get-pixel',
      data: data,
    })

    return result || {}
  },
}
