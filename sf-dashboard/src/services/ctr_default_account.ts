import api_v2 from '@/core/api_v2'

export default {
  DefaultAccountByID: async (id: number) => {
    const result = await api_v2.request({ url: `default-account/${id}` })
    return result || {}
  },
  GetDataTable: async (payload: any) => {
    const result = await api_v2.request({
      url: '/default-account/get-accounts',
      data: payload,
    })
    return result || {}
  },

  RemoveAccountDefault: async (payload: any) => {
    const result = await api_v2.request({
      url: '/default-account/remove-account',
      data: payload,
    })
    return result || {}
  },

  UpdateCategoryAllocation: async (payload: any) => {
    const result = await api_v2.request({
      url: '/default-account/update-category-allocation',
      data: payload,
    })
    return result || {}
  },
}
