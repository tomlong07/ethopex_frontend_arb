import { PromptLogData } from '@/class/prompt_logs'
import { ctr_prompt } from '@/services/ctr_prompt'
import { defineStore } from 'pinia'

export default defineStore('promptLogStore', () => {
  const showModal = false
  const dataLog = ref<PromptLogData>(new PromptLogData())
  const isLoading = false

  const showDrawer = false
  const drawerContent = ref('')
  const isLoadingDrawer = false
  const dataLogDrawer = ref<PromptLogData>(new PromptLogData())

  const callbackDeleteRow: Function = () => {}
  const callbackUpdateRow: Function = () => {}

  const setDataLog = (data: any) => {
    dataLog.value = new PromptLogData(data)
  }

  const setDataLogDrawer = (data: any) => {
    dataLogDrawer.value = new PromptLogData(data)
  }

  const getPromptLogByCreativeContent = async (data: any) => {
    const result = await ctr_prompt.GetListPromptLog(data)

    if (result.data) {
      return result.data
    } else {
      return {}
    }
  }
  return {
    showModal,
    dataLog,
    isLoading,
    callbackDeleteRow,
    callbackUpdateRow,
    showDrawer,
    drawerContent,
    isLoadingDrawer,
    dataLogDrawer,

    setDataLog,
    setDataLogDrawer,
    getPromptLogByCreativeContent,
  }
})
