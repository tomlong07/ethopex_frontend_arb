import api_v2 from '@/core/api_v2'

export default {
  GetFacebookConfigByType: async (payload: any) => {
    const result = await api_v2.request({
      url: `/facebook-config/get-by-type`,
      data: payload,
    })
    return result || {}
  },
  SaveFacebookConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: `/facebook-config/save-config`,
      data: payload,
    })
    return result || {}
  },
}
