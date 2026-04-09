import api_v2 from '@/core/api_v2'

export const ctr_daily_target = {
  ExcelDownload: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'daily-target/excel/download',
        data: payload,
        responseType: 'blob',
      })) || {}
    )
  },

  ChangeStatusTargeting: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'change-status-targeting',
        data: payload,
      })) || {}
    )
  },
}
