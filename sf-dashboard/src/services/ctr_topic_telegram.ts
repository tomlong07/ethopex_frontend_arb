import api_v2 from '@/core/api_v2'

export const ctr_topic_telegram = {
  AddTopic: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/topic/add`,
      data: payload
    })
  },
  GetTopicByID: async (id: any) => {
    return await api_v2.request({
      url: `/bot-telegram/topic/${id}`,
    })
  },
  UpdateTopic: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/topic/edit`,
      data: payload
    })
  },
  DeleteTopic: async (id: any) => {
    return await api_v2.request({
      url: `/bot-telegram/topic/delete`,
      data: { id }
    })
  },
  TestSend: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/send-message`,
      data: payload
    })
  }
}
