import { defineStore } from 'pinia'
export default defineStore('usePromtRule', () => {
  interface PromptRule {
    name: string
    status: 'on' | 'off'
    content: string
  }

  const createDefaultPromptRule = (): PromptRule => ({
    name: '',
    status: 'on',
    content: '',
  })

  const dataConfig = ref<PromptRule>(createDefaultPromptRule())
  const isLoading = ref<boolean>(true)
  const isSubmitBtnLoading = ref<boolean>(false)

  const initializeData = () => {
    dataConfig.value = createDefaultPromptRule()
  }

  return {
    dataConfig,
    isLoading,
    isSubmitBtnLoading,
    initializeData,
  }
})
