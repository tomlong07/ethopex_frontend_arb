import { ctr_bot_telegram } from '@/services/ctr_bot_telegram'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

export default defineStore('telegramStore', () => {
  const isLoading = ref(true)
  const listBot = ref<any[]>([])
  const listChat = ref<any[]>([])
  const statusOptions = ref<SelectOption[]>([
    {
      label: 'Active',
      value: 'active',
      style: { color: 'green' },
    },
    {
      label: 'Inactive',
      value: 'in_active',
      style: { color: 'red' },
    },
  ])

  const dataBot = ref<any>({
    id: 0,
    name: '',
    token: '',
    status: 'active',
  })

  const dataChat = ref<any>({
    chat_id_telegram: null,
    name: '',
    bot_id: null,
    status: 'active',
  })

  const dataTopic = ref<any>({
    topic_id: null,
    name: '',
    chat_id: null,
  })

  const loadBot = async () => {
    try {
      const result = await ctr_bot_telegram.ListBot()
      listBot.value = result?.data || []
    } catch {
      window.message.error('Failed to load bots!')
    }
  }

  const loadChat = async () => {
    try {
      const result = await ctr_bot_telegram.ListChat()
      listChat.value = result?.data || []
    } catch {
      window.message.error('Failed to load chats!')
    }
  }

  return {
    isLoading,
    statusOptions,
    dataBot,
    dataChat,
    dataTopic,
    listBot,
    listChat,
    loadBot,
    loadChat,
  }
})
