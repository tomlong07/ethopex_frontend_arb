import api_v2 from '@/core/api_v2'


export const ctr_report_supply_keyword = {
  ReportSupplyKeyword: async (payload: any) => {
    return (await api_v2.request({ url: 'report/supply-keyword', data: payload })) || {}
  },
}
