import { defineStore } from 'pinia'
import { macrosTraffics, demandConfigType } from '@/types/components/demand'

export default defineStore('demainStore', () => {
  const isLoading = ref(true)
  const isDisable = ref(true)
  const isDisableMacros = ref(true)
  const isTabLoading = ref(true)
  const arrayTrafficAllowed = ref<macrosTraffics[]>([])
  const isLoadingMacros = ref(true)
  const listTraffics = ref<macrosTraffics[]>([])

  // Khởi tạo demandConfig với macro mặc định
  const dataDemandConfig = {
    id: 0,
    name: '',
    show_name: '',
    status: 'on',
    fixed_adtitle: 'off',
    macros: [],
  }

  const demandConfig = ref<demandConfigType>({
    ...dataDemandConfig,
  })
  const clearData = () => {
    demandConfig.value = { ...dataDemandConfig }
  }
  return {
    demandConfig,
    isLoading,
    isDisable,
    isDisableMacros,
    isTabLoading,
    arrayTrafficAllowed,
    isLoadingMacros,
    listTraffics,
    clearData,
  }
})
