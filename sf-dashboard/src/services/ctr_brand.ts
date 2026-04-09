import api_v2 from '@/core/api_v2'

export default {
  Create: async (payload: any) => {
    const result = await api_v2.request({
      url: 'brand/add',
      data: payload,
    })
    return result || {}
  },

  Update: async (payload: any) => {
    const result = await api_v2.request({
      url: 'brand/edit',
      data: payload,
    })
    return result || {}
  },

  GetById: async (id?: number) => {
    const result = await api_v2.request({
      url: `brand/get/${id}`,
      method: 'POST',
    })
    return result || {}
  },

  Get: async (payload: any) => {
    const result = await api_v2.request({
      url: 'brands',
      data: payload,
      method: 'POST',
    })
    return result || {}
  },

  GetAll: async () => {
    const result = await api_v2.request({
      url: 'brand/get-all',
    })
    return result || {}
  },
}
