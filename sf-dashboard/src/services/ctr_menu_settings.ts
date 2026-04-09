import api_v2 from '@/core/api_v2'

export default {
  GetFESettings: async (url: any) => {
    if (!url) return {}
    return (
      (await api_v2.request({
        url: `/fe-configs${url}`,
      })) || {}
    )
  },

  GetFEFilterSettings: async (url: any) => {
    if (!url) return {}
    return (
      (await api_v2.request({
        url: `/fe-filter-configs${url}`,
      })) || {}
    )
  },
}
