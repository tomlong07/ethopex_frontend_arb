import api_v2 from '@/core/api_v2'

export const ctr_category = {
  getCategoryIAB: async () => {
    const result = await api_v2.request({
      url: `/category/get-all-iab`,
    })
    return result || {}
  },
}
