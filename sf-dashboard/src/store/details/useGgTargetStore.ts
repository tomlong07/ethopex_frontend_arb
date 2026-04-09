import { defineStore } from 'pinia'
import { googleTargetingData } from '@/types/components/google-targeting'

export default defineStore('useGgTargetStore', () => {
  const dataGoogleTargetingConfig = {
    data_source: 'manual',
    type: 'whitelist',
    domains: [],
    sellers: '',
  }
  const googleTargetingConfig = ref<googleTargetingData>({
    ...dataGoogleTargetingConfig,
  })
  
  const infomationError = ref<any>({})

  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)  
  })

  const clearData = () => {
    googleTargetingConfig.value = { ...dataGoogleTargetingConfig }
  }
  return { 
    googleTargetingConfig, 
    clearData,
    
    infomationError,
    showErr
  }
})
