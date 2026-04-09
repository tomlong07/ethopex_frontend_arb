import api_v2 from '@/core/api_v2'

export const ctr_abtest = {
  ABTestElasticSearch: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `/ab-test/list`,
        data: payload,
      })) || {}
    )
  },
}
