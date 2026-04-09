import api_v2 from '@/core/api_v2'

export const ctr_cronjob = {
  InsertCronjobCustom: async (payload: any) => {
    const result = await api_v2.request({
      url: 'cronjob/InsertCronjobCustom',
      data: payload,
    })
    return result || {}
  },
}
