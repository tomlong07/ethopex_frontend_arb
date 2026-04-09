import api_v2 from '@/core/api_v2'

export default {
  FilterDemand: async (payload: any) => {
    const result = await api_v2.request({
      url: 'demand-source',
      data: payload,
    })
    return result || {}
  },

  AddConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: 'demand-source/add-config',
      data: payload,
    })
    return result || {}
  },

  EditConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: 'demand-source/edit-config',
      data: payload,
    })
    return result || {}
  },

  GetAllDemandSource: async () => {
    const result = await api_v2.request({ url: 'demand-source/get-all' })
    return result || {}
  },

  GetByTrafficSource: async (traffic: string) => {
    const result = await api_v2.request({
      url: `demand-source/get-by-trafficsource?traffic_source=${traffic}`,
    })
    return result || {}
  },

  GetVerticals: async (params: any) => {
    const result = await api_v2.request({
      url: `demand-source/get-verticals`,
      params: params,
    })
    return result || {}
  },

  GetAccount: async (params: any) => {
    const result = await api_v2.request({
      url: `demand-source/get-account`,
      params: params,
    })
    return result || {}
  },

  GetMacroByType: async (payload: any) => {
    const result = await api_v2.request({
      url: `list-macro/get-by-type?type=${payload.type}`,
    })
    return result || {}
  },

  GetByID: async (id: number) => {
    const result = await api_v2.request({
      url: `demand-source/get-by-id/${id}`,
    })
    return result || {}
  },
}
