import api_v2 from '@/core/api_v2'

export const ctr_tool = {
  GetGstyle: async () => {
    return (await api_v2.request({ url: 'tool/get-gstyle' })) || {}
  },
  SaveGstyle: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `tool/save-gstyle`,
        data: payload,
      })) || {}
    )
  },

  AdManagerList: async () => {
    return (
      (await api_v2.request({
        url: 'tool/admanager-list',
      })) || {}
    )
  },

  AdManagerAdd: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'tool/admanager-add',
        data: payload,
      })) || {}
    )
  },

  GetPricingRuleIdsByNetworkId: async (id: number) => {
    return (
      (await api_v2.request({
        url: 'tool/pricing-rule-ids-by-network-id' + '/' + id,
      })) || {}
    )
  },

  GenerateImgLandingByPrompt: async (payload?: any) => {
    let result
    result = await api_v2.request({
      url: 'tool/general-image-ai',
      data: payload,
    })
    return result || {}
  },

  Heaps: async () => {
    return (
      (await api_v2.request({
        url: '/tool/heaps',
      })) || {}
    )
  },
  Heap: async (url?: string) => {
    if (!url) return
    return (
      (await api_v2.request({
        url: '/tool/heaps/' + url,
        method: 'Post',
        responseType: 'blob',
      })) || {}
    )
  },
}
