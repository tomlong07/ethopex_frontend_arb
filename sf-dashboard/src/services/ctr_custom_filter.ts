import api_v2 from '@/core/api_v2'

export const ctr_custom_filter = {
  GetList: async (data: any) => {
    return (
      (await api_v2.request({ url: '/custom-filter/list', data: data })) || {}
    )
  },
}
