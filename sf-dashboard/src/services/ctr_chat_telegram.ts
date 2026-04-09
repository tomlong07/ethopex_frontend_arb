import api_v2 from '@/core/api_v2'

export const ctr_chat_telegram = {
  ListTopic: async (id: any) => {
    return await api_v2.request({
      url: `bot-telegram/list-topic-with-chat-id/${id}`,
    })
  },
  ListChat: async (id: any) => {
    return await api_v2.request({
      url: `bot-telegram/bot/${id}/list-chat`,
    })
  },
  AddChat: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/chat/add`,
      data: payload
    })
  },
  GetChatByID: async (id: any) => {
    return await api_v2.request({
      url: `/bot-telegram/chat/${id}`,
    })
  },
  UpdateChat: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/chat/edit`,
      data: payload
    })
  },
  DeleteChat: async (id: any) => {
    return await api_v2.request({
      url: `/bot-telegram/chat/delete`,
      data: { id }
    })
  }
}
