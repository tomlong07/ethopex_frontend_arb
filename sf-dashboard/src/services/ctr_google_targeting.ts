import api_v2 from '@/core/api_v2'

export const ctr_google_targeting = {
  GoogleTargetingCopy: async () => {
    const result = await api_v2.request({ url: '/google-targeting/copy' })
    return result || {}
  },
  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: `/google-targeting/add`,
      data: payload,
    })
    return result || {}
  },

  GetNetwork: async () => {
    const result = await api_v2.request({
      url: '/google-targeting/get-network',
    })
    return result || {}
  },

  ExportSectionTaboolaWithType: async (type: string) => {
    return (
      (await api_v2.request({
        url: 'google-targeting/export-section-taboola',
        params: {
          type: type,
        },
        responseType: 'blob',
      })) || {}
    )
  },

  SavePerformance: async (payload: any) => {
    const result = await api_v2.request({
      url: `/google-performance/save`,
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result || {}
  },

  // "/google-performance/change-status"
  UpdateStatusPlacements: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      data: payload,
    })
    return result || {}
  },

  SaveDefaultAccount: async (payload: any) => {
    const result = await api_v2.request({
      url: `/default-account/save`,
      data: payload,
    })
    return result || {}
  },
}
