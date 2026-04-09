import api_v2 from '@/core/api_v2'

export const ctr_payload_key = {
  Key: async (payload: any) => {
    return (
      (await api_v2.request({ url: 'plk/key', params: payload.params })) || {}
    )
  },

  SavePlk: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/plk/key',
        data: payload
      })) || {}
    )
  }
}
