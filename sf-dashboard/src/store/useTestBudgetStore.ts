import { defineStore } from 'pinia'

export default defineStore('useTestBudget', () => {
  const showModal = ref<boolean>(false)
  const userId = ref<number>(0)
  const user = ref<string>('')
  const amount = ref<number>(1)

  const payloadBonus = computed(() => {
    return { user_id: userId.value, amount: amount.value }
  })

  return {
    showModal,
    userId,
    user,
    amount,
    payloadBonus,
  }
})
