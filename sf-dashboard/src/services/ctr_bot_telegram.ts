import api_v2 from '@/core/api_v2'

export const ctr_bot_telegram = {
  ListBot: async () => {
    const result = await api_v2.request({
      url: `bot-telegram/list-bot`,
    })
    return result || {}
  },
  ListChat: async () => {
    const result = await api_v2.request({
      url: `bot-telegram/list-chat`,
    })
    return result || {}
  },
  AddBot: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/bot/add`,
      data: payload
    })
  },
  GetBotByID: async (id: any) => {
    return await api_v2.request({
      url: `/bot-telegram/bot/${id}`,
    })
  },
  UpdateBot: async (payload: any) => {
    return await api_v2.request({
      url: `/bot-telegram/bot/edit`,
      data: payload
    })
  },
  DeleteBot: async (id: any) => {
    return await api_v2.request({
      url: `/bot-telegram/bot/delete`,
      data: { id }
    })
  },
}
