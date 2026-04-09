import api_v2 from '@/core/api_v2'

export const ctr_adsense_style = {
  GetStyleByPubID: async (id: any, params: any) => {
    return (
      (await api_v2.request({
        url: 'adsense-style/get-by-pubid' + '/' + id,
        params: params,
      })) || {}
    )
  },
  GetGenerationOfStyleByPubID: async (id: any) => {
    return (
      (await api_v2.request({
        url: 'adsense-style/get-generation-by-pubid' + '/' + id,
      })) || {}
    )
  },
}
