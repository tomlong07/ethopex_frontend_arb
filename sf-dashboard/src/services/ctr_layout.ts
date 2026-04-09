import api_v2 from '@/core/api_v2'

export const ctr_layout = {
  List: async (payload: any) => {
    const result = await api_v2.request({
      url: `/layout/list`,
      data: payload,
    })
    return result || {}
  },

  Layouts: async (params?: any) => {
    const result = await api_v2.request({
      url: `/layouts`,
      method: 'POST',
      params: params || {},
    })
    return result || {}
  },

  Add: async (payload: any) => {
    const result = await api_v2.request({ url: `/layout/add`, data: payload })
    return result || {}
  },

  Edit: async (id: any, payload: any) => {
    const result = await api_v2.request({
      url: `/layout/edit/${id}`,
      data: payload,
    })
    return result || {}
  },

  Get: async (id: any) => {
    const result = await api_v2.request({ url: `/layout/get/${id}` })
    return result || {}
  },

  ListAccountAdsense: async () => {
    const result = await api_v2.request({
      url: `/layout/list-account-adsense`,
    })
    return result || {}
  },

  ChangeRunOnNetwork: async (payload: any) => {
    const result = await api_v2.request({
      url: `layout/change-run-on-network`,
      data: payload,
    })
    return result || {}
  },
}
