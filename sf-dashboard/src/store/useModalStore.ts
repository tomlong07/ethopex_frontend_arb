import { defineStore } from 'pinia'
export default defineStore('useModalStore', () => {
  const showModal = ref(false)
  const isLoading = ref(false)
  const key = ref<string>('')
  const message = ref<string>('')
  const title = ref<string>('')
  const result = ref<any>({})

  const toggle = () => {
    isLoading.value = true
    showModal.value = !showModal.value
  }
  const cancel = () => {
    showModal.value = false
    isLoading.value = false
  }
  const submit = () => {
    showModal.value = false
    isLoading.value = false
  }

  return {
    result,
    isLoading,
    showModal,
    toggle,
    cancel,
    submit,
    key,
    message,
    title,
  }
})
