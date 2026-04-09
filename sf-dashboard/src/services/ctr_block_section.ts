import api_v2 from '@/core/api_v2'

export const ctr_block_section = {
  Submit: async (payload: any) => {
    const result = await api_v2.request({
      url: `/block-section/submit`,
      data: payload,
    })
    return result || {}
  },

  GetBlockSectionAdminByTrafficSource: async (payload: any) => {
    const result = await api_v2.request({
      url: `/block-section/get-block-section-admin-by-traffic-source?traffic_source=${payload}`,
    })
    return result || {}
  },
}
