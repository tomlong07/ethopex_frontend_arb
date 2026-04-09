import api_v2 from '@/core/api_v2'

export const ctr_funds = {
  Filter: async (payload: any) => {
    const result = await api_v2.request({
      url: `/funds`,
      data: payload,
    })
    return result || {}
  },
  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: `/funds/add`,
      data: payload,
    })
    return result || {}
  },

  Edit: async (payload: any) => {
    const result = await api_v2.request({ url: 'funds/edit', data: payload })
    return result || {}
  },

  GetByID: async (id: any) => {
    const result = await api_v2.request({ url: `funds/get-by-id/${id}` })
    return result || {}
  },

  GetSource: async (id: any) => {
    const url = 'funds/get-source' + (id ? `?user_id=${id}` : '')
    const result = await api_v2.request({ url: url })
    return result || {}
  },

  AmountOfUser: async () => {
    const result = await api_v2.request({ url: 'funds/amount-user' })
    return result || {}
  },
}
