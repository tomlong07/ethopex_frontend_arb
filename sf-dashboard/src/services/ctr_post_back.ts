import api_v2 from '@/core/api_v2'

export default {
  GetById: async (id: number | string) => {
    const result = await api_v2.request({
      url: `postback-url/${id}`,
    })
    return result || {}
  },

  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: 'postback-url',
      data: payload,
    })
    return result || {}
  },

  Edit: async (id: number | string, payload: any) => {
    const result = await api_v2.request({
      url: `postback-url/${id}/edit`,
      data: payload,
    })
    return result || {}
  },

  Test: async (
    id: number | string,
    event: 'PageView' | 'Search' | 'Conversion',
    url: string
  ) => {
    const result = await api_v2.request({
      url: `postback-url/${id}/test?event=${event}`, 
      method: 'POST',
      data: { url }, 
    })
    return result || {}
  },
}
