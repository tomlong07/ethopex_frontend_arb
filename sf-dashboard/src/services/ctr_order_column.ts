import api_v2 from '@/core/api_v2'

export const ctr_order_column = {
  SaveOrderColumn: async (payload?: any) => {
    return (
      (await api_v2.request({
        url: 'save-column-orders',
        data: payload,
      })) || {}
    )
  },

  GetColumnsByPage: async (page: string) => {
    return (
      (await api_v2.request({
        url: `/fe-settings/columns${page}`,
      })) || {}
    )
  },
}
