import { ONOFF } from '@/enum/campaign'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

class GlobalConfigStruct {
  push_to_pub?: ONOFF
  status_campaign?: ONOFF
  publishers?: number[]
  target_geo_by?: string = 'fixed'

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof this] = element
        }
      }
    }

    if (!this.publishers) this.publishers = []
    if (!this.status_campaign) this.status_campaign = ONOFF.OFF
    if (!this.push_to_pub) this.push_to_pub = ONOFF.OFF
  }
}

class GlobalAsyncSettings {
  pushToPub?: boolean

  constructor(data?: any) {
    if (!data) return
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]

        this[key as keyof this] = element
      }
    }
  }
}

export const useGlobalConfig = defineStore('useGlobalConfig', () => {
  // State
  const isLoading = ref(true)
  const isSubmitBtnLoading = ref(false)
  const loadingUsers = ref(false)

  const permissionAsyncConfigs = ref(new GlobalAsyncSettings())

  const globalConfigData = ref(new GlobalConfigStruct())
  const userOptions = ref<SelectOption[]>([])
  const infomationError = ref<any>({})

  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []
    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)
  })

  const userIds = computed(
    () => globalConfigData.value.publishers?.join(',') || ''
  )

  const fetchGlobalConfig = async () => {
    isLoading.value = true

    const result = await ctr_crawl_campaign.GetGlobalConfig()
    globalConfigData.value = new GlobalConfigStruct(result?.data || {})
  }

  const submitForm = async () => {
    isSubmitBtnLoading.value = true

    const result = await ctr_crawl_campaign.SaveGlobalConfig(
      globalConfigData.value
    )

    if (result?.status) {
      window.message.success(`Update successfully`)
      infomationError.value = {}
    } else {
      infomationError.value = result
    }
    isSubmitBtnLoading.value = false
  }

  const fetchUsers = async (q: string, first?: boolean) => {
    loadingUsers.value = true
    const result = await ctr_filter_v2.FilterPublisher({
      f: userIds.value,
      fi: first ? '1' : '',
      q: q,
    })

    userOptions.value = result?.data || []
    loadingUsers.value = false
  }

  const clearData = () => {
    globalConfigData.value = {
      push_to_pub: ONOFF.OFF,
      publishers: [],
    }
  }

  const initData = async () => {
    clearData()

    await fetchGlobalConfig()

    isLoading.value = false
  }

  const setPermissionAsyncConfigs = (data: any) => {
    permissionAsyncConfigs.value = new GlobalAsyncSettings(data)
  }

  return {
    // State
    isLoading,
    isSubmitBtnLoading,
    globalConfigData,
    userOptions,
    permissionAsyncConfigs,

    // Getters

    // Actions
    submitForm,
    initData,
    fetchUsers,
    setPermissionAsyncConfigs,

    showErr,
  }
})
