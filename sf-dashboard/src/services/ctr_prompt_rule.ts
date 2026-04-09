import api_v2 from '@/core/api_v2'

export default {
  Add: async (payload: any) => {
    return (
      (await api_v2.request({ url: 'prompt-rule/add', data: payload })) || {}
    )
  },

  Update: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'prompt-rule/edit',
        data: payload,
      })) || {}
    )
  },

  GetByID: async (id: number) => {
    return (
      (await api_v2.request({
        url: `prompt-rule/get/${id}`,
        method: 'POST',
      })) || {}
    )
  },
}
