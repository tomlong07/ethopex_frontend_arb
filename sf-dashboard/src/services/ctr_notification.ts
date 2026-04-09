import api_v2 from '@/core/api_v2'

export const ctr_notification = {
  GetNotification: async () => {
    const result = await api_v2.request(
      {
        url: `notification`,
      },
      api_v2.client,
      false
    )
    return result || {}
  },
}
