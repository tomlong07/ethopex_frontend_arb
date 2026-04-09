import { defineStore } from 'pinia'

import { ModeClassString, StatusClass } from '@/types/components/base'
import {
  FacebookViaType,
  fbViaSelectOptions,
} from '@/types/components/facebook-via'
import { ModalClass } from '@/types/components/base'

export const useFacebookViaStore = defineStore(`useFacebookViaStore`, () => {
  const modeData = ref<ModeClassString>(new ModeClassString(window.route))
  const statusData = ref(new StatusClass('facebook via'))
  const selectData = ref<fbViaSelectOptions>(new fbViaSelectOptions())
  const infomationError = ref<any>({})

  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)  
  })

  const dataConfig = ref(new FacebookViaType())
  const modalManager = ref(new ModalClass())
  const clearData = () => {
    dataConfig.value = new FacebookViaType()
  }

  const prefetch = () => {
    modeData.value = new ModeClassString(window.route)
  }
  return {
    modeData,
    statusData,
    selectData,
    dataConfig,
    modalManager,
    clearData,
    prefetch,
    infomationError,
    showErr,
  }
})
