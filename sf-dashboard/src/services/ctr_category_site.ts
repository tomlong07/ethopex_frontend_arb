import api_v2 from '@/core/api_v2'

export default {
  Create: async (payload: any) => {
    const result = await api_v2.request({
      url: 'category-site-builder/add',
      data: payload,
    })
    return result || {}
  },

  Update: async (payload: any) => {
    const result = await api_v2.request({
      url: `category-site-builder/edit`,
      data: payload,
    })
    return result || {}
  },

  GetParentCategory: async (id?: number) => {
    return (
      (await api_v2.request({
        url: `/category-site-builder/all-except-id/${id}`,
      })) || {}
    )
  },

  GetById: async (id?: number) => {
    const result = await api_v2.request({
      url: `/category-site-builder/${id}`,
    })
    return result || {}
  },
  GetCategoryByTrafficSource: async (traffic_source?: string) => {
    const result = await api_v2.request({
      url: 'traffic-source/get-categories',
      params: { traffic_source: traffic_source },
    })
    return result || {}
  },
}
