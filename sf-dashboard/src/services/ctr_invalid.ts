import api_v2 from '@/core/api_v2'

export const ctr_invalid = {
  Get: async (id: any) => {
    const result = await api_v2.request({ url: `invalid/get/${id}` })
    return result || {}
  },

  Add: async (payload: any) => {
    const result = await api_v2.request({ url: 'invalid/add', data: payload })
    return result || {}
  },

  Edit: async (payload: any) => {
    const result = await api_v2.request({ url: `invalid/edit`, data: payload })
    return result || {}
  },

  LoadInvalid: async (id: any) => {
    const result = await api_v2.request({ url: `invalid/load-invalid/${id}` })
    return result || {}
  },
}
