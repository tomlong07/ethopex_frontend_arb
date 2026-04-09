import api_v2 from '@/core/api_v2'

export default {
  GetDataAjax: async (url: any) => {
    return (
      (await api_v2.request({
        url: url,
      })) || {}
    )
  },
}
