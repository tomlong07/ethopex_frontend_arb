import { defineStore } from 'pinia'

export const useUserLabel = defineStore('userLabelModal', () => {
  const showModal = ref(false)

  const userId = ref<number | null>(null)
  const email = ref<string>('')
  const labelName = ref<string>('')

  return {
    showModal,
    userId,
    email,
    labelName,
  }
})
