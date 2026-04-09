import api_v2 from '@/core/api_v2'

export const ctr_report_error = {
  LoadTable: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'by-dimension/report-error-top',
        data: payload,
      })) || {}
    )
  },

  LoadChart: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'by-dimension/report-error-chart',
        data: payload,
      })) || {}
    )
  },
}
