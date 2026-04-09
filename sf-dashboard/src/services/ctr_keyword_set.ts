import api_v2 from '@/core/api_v2'

export const ctr_keyword_set = {
  Add: async (payload: any) => {
    return (
      (await api_v2.request({ url: 'keywordSet/add', data: payload })) || {}
    )
  },

  Update: async (id: number, payload: any) => {
    payload.id = id

    return (
      (await api_v2.request({ url: 'keywordSet/update', data: payload })) || {}
    )
  },

  GetByID: async (id: number, query: string = '', country?: string) => {
    if (query && !query.includes('?')) {
      query = '?' + query
    }
    if (country) {
      query += (query ? '&' : '?') + `country=${country}`
    }

    const result = await api_v2.request({
      url: `keywordSet/get/${id}${query}`,
      method: 'POST',
    })
    return result || {}
  },

  GetCampaignsUsed: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `keywordSet/get/${id}/campaigns`,
      method: 'POST',
      data: payload,
    })

    return result || {}
  },

  GetDemandSource: async () => {
    const result = await api_v2.request({
      url: 'keywordSet/get-demand-source',
      method: 'POST',
    })
    return result || {}
  },
}
