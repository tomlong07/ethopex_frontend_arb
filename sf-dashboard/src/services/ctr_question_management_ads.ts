import api_v2 from '@/core/api_v2'

export const ctr_question_management_ads = {
  Add: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'google-appeal-question/add',
        data: payload,
      })) || {}
    )
  },

  Update: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `google-appeal-question/edit/${payload.id}`,
        data: payload,
      })) || {}
    )
  },

  GetByID: async (id: number) => {
    return (
      (await api_v2.request({
        url: `google-appeal-question/get-by-id/${id}`,
        method: 'GET',
      })) || {}
    )
  },
}
