import api_v2 from '@/core/api_v2'

export const ctr_report_topcampaign = {
  Filter: async (payload: any) => {
    return (
      (await api_v2.request({ url: `/topcampcontent`, data: payload })) || {}
    )
  },
}
