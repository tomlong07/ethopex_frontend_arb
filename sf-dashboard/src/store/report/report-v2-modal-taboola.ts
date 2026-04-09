import { defineStore } from 'pinia'

export default defineStore('useReportV2ModalTaboola', () => {
  const showModal = ref<boolean>(false)
  const data: {
    title?: string
    description?: string
    thumbnail_url?: string
  } = {}

  return {
    showModal,
    data,
  }
})
