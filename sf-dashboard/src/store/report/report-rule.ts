import { ResponseRuleCheckCamp } from '@/class/report'
import { ctr_rule } from '@/services/ctr_rule'

import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'report_rule_filters'
interface RuleFilters {
  publisher: number[] | null
  traffic_source: string[] | null
  rule: number | null
}

export default defineStore('useReportRule', () => {
  const isLoadingRules = ref<boolean>(true)
  const isInit = ref<boolean>(false)
  const ruleOptions = ref<SelectOption[]>([])
  const ruleSelected = ref<number | null>(0)
  const updateData = ref(0)
  const dataSatisfy = ref<ResponseRuleCheckCamp | null>(null)
  const activeTab = ref<string>('0')
  const campaignID = ref<number>(0)
  const isGetting = ref(false)
  const isReady = ref(false)

  const messageLoading = ref<any>(null)

  const publisherOptions = ref<SelectOption[]>([])
  const isLoadingPublisher = ref(false)

  const trafficSourceOptions = ref<SelectOption[]>([])
  const isLoadingTrafficSource = ref(false)

  const savedFilters = ref<RuleFilters>({
    publisher: null,
    traffic_source: null,
    rule: null,
  })

  // Hàm lưu filters vào localStorage
  const saveFiltersToStorage = (filters: RuleFilters) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
      savedFilters.value = { ...filters }
    } catch (err) {
      console.error('Error saving filters to localStorage', err)
    }
  }

  // Hàm load filters từ localStorage
  const loadFiltersFromStorage = (): RuleFilters => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const filters = JSON.parse(stored)
      savedFilters.value = filters
      return filters
    }
    return { publisher: null, traffic_source: null, rule: null }
  }

  const fetchRules = async (filter?: {
    publisher?: number[] | null
    traffic_source?: string[] | null
    search?: string | null
    size?: number | string
  }) => {
    isLoadingRules.value = true
    try {
      const params: Record<string, string | number> = {}
      if (filter?.publisher?.length)
        params.publisher = filter.publisher.join(',')
      if (filter?.traffic_source?.length)
        params.traffic_source = filter.traffic_source.join(',')
      if (filter?.search) params.search = filter.search
      if (filter?.size) params.size = filter.size

      // Lưu filters vào localStorage
      saveFiltersToStorage({
        publisher: filter?.publisher || null,
        traffic_source: filter?.traffic_source || null,
        rule: ruleSelected.value || null,
      })

      const res = await ctr_rule.GetRules(params)

      ruleOptions.value = (res?.data || []).map((item: any) => ({
        ...item,
        label: `${item.id}: ${item.name}`,
      }))
    } finally {
      isLoadingRules.value = false
    }
  }

  const fetchPublisher = async (query = '', selectedValue: any = null) => {
    try {
      isLoadingPublisher.value = true
      const params = {
        q: query,
        f:
          Array.isArray(selectedValue) && selectedValue.length > 0
            ? selectedValue.join(',')
            : '',
      }

      const res = await ctr_rule.GetPublishers(params)

      publisherOptions.value = (res?.data || []).map((p: any) => ({
        label: p.label,
        value: p.value,
      }))
    } finally {
      isLoadingPublisher.value = false
    }
  }

  const fetchTrafficSource = async (query = '', selectedValue: any = null) => {
    try {
      isLoadingTrafficSource.value = true
      const params = {
        q: query,
        f:
          Array.isArray(selectedValue) && selectedValue.length > 0
            ? selectedValue.join(',')
            : '',
      }

      const res = await ctr_rule.GetTrafficSources(params)

      trafficSourceOptions.value = (res?.data || []).map((t: any) => ({
        label: t.label,
        value: t.value,
      }))
    } finally {
      isLoadingTrafficSource.value = false
    }
  }

  const gettingDataRule = async (payload: any) => {
    messageLoading.value = window.message.loading('Getting data...')
    isGetting.value = true
    isReady.value = true
    try {
      const result = await ctr_rule.GetRuleCheckCamp(payload)
      activeTab.value = '0'
      dataSatisfy.value = new ResponseRuleCheckCamp(result.data || {})

      messageLoading.value?.destroy()
    } finally {
      isGetting.value = false
      isReady.value = true
    }
  }

  watch(ruleSelected, (newVal) => {
    saveFiltersToStorage({
      publisher: savedFilters.value.publisher,
      traffic_source: savedFilters.value.traffic_source,
      rule: newVal || null,
    })
  })

  return {
    isLoadingRules,
    isInit,
    ruleSelected,
    ruleOptions,
    updateData,
    dataSatisfy,
    activeTab,
    campaignID,
    isGetting,
    isReady,

    publisherOptions,
    trafficSourceOptions,
    isLoadingPublisher,
    isLoadingTrafficSource,

    savedFilters,

    fetchRules,
    fetchPublisher,
    fetchTrafficSource,
    gettingDataRule,
    loadFiltersFromStorage,
    saveFiltersToStorage,
  }
})
