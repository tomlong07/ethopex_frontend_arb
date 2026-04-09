import api_v2 from '@/core/api_v2'

export const ctr_table_settings = {
  Update: async (data: any) => {
    return (await api_v2.request({ url: 't-col/update', data: data })) || {}
  },

  Get: async (data: any) => {
    return (await api_v2.request({ url: 't-col/get', data: data })) || {}
  },

  Clear: async (data: any) => {
    return (await api_v2.request({ url: 't-col/clear', data: data })) || {}
  },
}
