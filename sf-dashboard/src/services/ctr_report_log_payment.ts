import api_v2 from '@/core/api_v2'

export const ctr_report_log_payment = {
  GetReportLogPayment: async (payload: any) => {
    return (
      (await api_v2.request({ url: 'reports/payment', data: payload })) || {}
    )
  },
}
