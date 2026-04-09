import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import { ctr_google_targeting } from '@/services/ctr_google_targeting'

import { defineStore } from 'pinia'

import { TS } from '@/enum/campaign'
import { SelectOption } from 'naive-ui'

import ctr_default_account from '@/services/ctr_default_account'
import { DS, ONOFF } from '@/enum/campaign'
import { debounceV2 } from '@/utils'
import { TableData } from '@/components/default_account/dataTable'
import { Type } from '@/components/default_account/enum'
import { FeSettings } from '@/class/fe_settings'

class DefaultAccountStruct {
  traffic_source?: TS
  accounts?: string
  demand_source?: DS
  max_spend?: number | null
  name?: string
  global?: ONOFF | null

  max_spend_status?: ONOFF | null
  max_campaign_status?: ONOFF | null

  category_allocation?: ONOFF | null
  max_campaign?: number | null

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          switch (key) {
            case 'accounts':
              this['accounts'] = Array.isArray(element)
                ? element.join('\n')
                : element || ''
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }

    if (!this.category_allocation) this.category_allocation = ONOFF.OFF
  }
}

export class DefaultAccountAsyncSettings {
  categoryAllocation?: boolean

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

export const useDefaultAccount = defineStore(`defaultAccount`, () => {
  const id = ref(Number(window.route.params.id || 0))

  const name = 'Default Account'
  const isLoading = ref(true)
  const isSubmitBtnLoading = ref(false)

  const isSubmittingModal = ref(false)
  const loadingTrafficSource = ref(false)
  const loadingDemandSource = ref(false)
  const loadingTable = ref(false)
  const isLoadingUpdate = ref(false)
  const isFetchFanpage = ref(false)
  const isFetchLocation = ref(false)
  const isFetchPixel = ref(false)
  const feSettings = ref<FeSettings>()

  const trafficSourceOptions = ref<SelectOption[]>([])
  const demandSourceOptions = ref<SelectOption[]>([])

  const defaultAccountData = ref(new DefaultAccountStruct())
  const permissionAsyncConfigs = ref(new DefaultAccountAsyncSettings())

  const initCategoryAllocation = ref<ONOFF>(ONOFF.OFF)

  const isAddPage = computed(() => id.value === 0)
  const isEditPage = computed(() => !isAddPage.value)

  const isGoogleAdsense = computed(() => {
    return (
      defaultAccountData.value.traffic_source === TS.GOOGLE &&
      defaultAccountData.value.demand_source === DS.ADSENSE
    )
  })
  const isFacebook = computed(() => {
    return defaultAccountData.value.traffic_source === TS.FACEBOOK
  })
  const selectedRows = ref<Set<number | string>>(new Set())

  const selectedRowKeys = ref<(string | number)[]>([])
  const selectedAllTotal = ref(false)

  const deletingKeys = ref<Set<number | string>>(new Set())

  const tableData = ref<TableData[]>([])

  const pageSize = ref(50)
  const currentPage = ref(1)
  const selectedCategories = ref<string[]>(['all'])
  const selectedNames = ref<string[]>([])
  const searchQuery = ref('')
  const totalRecord = ref<number>()
  const totalEnabled = ref<number>()
  const totalSuspended = ref<number>()
  const infomationError = ref<any>({})

  const payload = computed(() => {
    return {
      ...defaultAccountData.value,
      accounts: helper.stringToArray(defaultAccountData.value?.accounts || ''),
    }
  })

  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)
  })

  const submitForm = async () => {
    isSubmitBtnLoading.value = true
    const result = await ctr_google_targeting.SaveDefaultAccount(payload.value)
    if (result?.status) {
      window.message.success(`Save successfully`)
      infomationError.value = {}
      if (isAddPage.value && feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value?.page_list })
      }

      if (isEditPage.value) {
        initCategoryAllocation.value =
          defaultAccountData.value.category_allocation || ONOFF.OFF
        fetchTableData()
      }
    } else {
      infomationError.value = result
    }
    isSubmitBtnLoading.value = false
  }

  const fetchTrafficSourceOptions = async () => {
    loadingTrafficSource.value = true
    const result = await ctr_filter_v2.FilterTrafficSource()
    if (result?.status) {
      trafficSourceOptions.value = result?.data || []
    }
    loadingTrafficSource.value = false
  }

  const fetchDemandSourceOptions = async () => {
    loadingTrafficSource.value = true
    const result = await ctr_filter_v2.FilterDemandSource()
    if (result?.status) {
      demandSourceOptions.value = result?.data || []
    }
    loadingDemandSource.value = false
  }

  const getById = async () => {
    isLoading.value = true
    const result = await ctr_default_account.DefaultAccountByID(id.value)
    defaultAccountData.value = new DefaultAccountStruct(result?.data || {})

    initCategoryAllocation.value = defaultAccountData.value
      .category_allocation as ONOFF

    isLoading.value = false
  }

  const payloadAccounts = computed(() => {
    let categories: string[] = []
    let accounts: string[] = []

    if (selectedCategories.value && selectedCategories.value.length > 0) {
      categories = selectedCategories.value
    }

    if (selectedNames.value && selectedNames.value.length > 0) {
      accounts = selectedNames.value
    }

    return {
      id: id.value,
      filter: {
        categories,
        accounts,
      },
      size: pageSize.value,
      page: currentPage.value,
      search: searchQuery.value,
    }
  })

  const fetchTableData = async (isCall: boolean = false) => {
    loadingTable.value = true

    try {
      const payload = isCall
        ? { ...payloadAccounts.value, page: 1 }
        : payloadAccounts.value

      const result = await ctr_default_account.GetDataTable(payload)

      const mappedData = (result.data.accounts || []).map(
        (item: any, index: any) => ({
          key: index,
          ...item,
        })
      )

      tableData.value = mappedData
      totalRecord.value = result.data.total || 0
      totalEnabled.value = result.data.total_enabled
      totalSuspended.value = result.data.total_suspended
    } catch (error) {
      console.error('Error fetching table data:', error)
      tableData.value = []
      totalRecord.value = 0
    } finally {
      loadingTable.value = false
    }
  }

  const clearSelectAllSelection = () => {
    selectedAllTotal.value = false
    selectedRows.value = new Set()
    selectedRowKeys.value = []
  }

  const debouncedFetchTableData = debounceV2(fetchTableData, 500)

  const clearData = () => {
    selectedNames.value = []
    selectedCategories.value = ['all']
    id.value = Number(window.route.params.id || 0)
    defaultAccountData.value = new DefaultAccountStruct()
    tableData.value = []
    initCategoryAllocation.value = ONOFF.OFF
  }

  const deleteTableItems = (deletedKeys: (string | number)[]) => {
    tableData.value = tableData.value.filter(
      (item) => !deletedKeys.includes(item.key)
    )
  }
  const setPermissionAsyncConfigs = (data: any) => {
    permissionAsyncConfigs.value = new DefaultAccountAsyncSettings(data)
  }

  const handlePixelConfirm = async (
    row: TableData,
    newPixel: string,
    type: string,
    label?: string
  ) => {
    try {
      isLoadingUpdate.value = true

      const payload: any = {
        id: row.id,
        type: type,
        value: newPixel,
      }
      if (type !== Type.LOCATION) {
        payload.name = label
      }
      if (row.id !== 1) {
        payload.account = row.name
      }

      const result = await ctr_default_account.UpdateCategoryAllocation(payload)

      if (result.status) {
        window.message.success(`Set ${type} success`)
        fetchTableData()
      }
    } finally {
      isLoadingUpdate.value = false
    }
  }

  const fanpageOptions = ref<SelectOption[]>([])
  const locationOptions = ref<SelectOption[]>([])
  const pixelOptions = ref<SelectOption[]>([])

  const fetchPixelOptions = async (account_id: string, sync = false) => {
    isFetchPixel.value = true

    const result = await ctr_traffic_source.GetFacebookPixel({
      account_id,
      sync: sync ? TS.FACEBOOK : undefined,
    })

    pixelOptions.value = (result?.data || []).map((item: any) => ({
      label: item.name,
      value: item.id,
    }))

    isFetchPixel.value = false
  }

  const fetchLocationOptions = async () => {
    isFetchLocation.value = true
    const result = await ctr_traffic_source.GetCountries({})

    locationOptions.value = (result?.data?.coutries || []).map((item: any) => ({
      label: item.name,
      value: item.value,
    }))

    isFetchLocation.value = false
  }

  /* eslint-disable no-unused-vars */
  // @ts-nocheck
  const fetchFanpageOptions = async (q?: string) => {
    isFetchFanpage.value = true
    const result = await ctr_traffic_source.GetFacebookPage({}, {})
    if (result?.data) {
      fanpageOptions.value = result.data
    } else {
      fanpageOptions.value = []
    }
    isFetchFanpage.value = false
  }

  const handleSearchFanpage = debounceV2(async (query?: string) => {
    fetchFanpageOptions(query)
  }, 300)

  const showFanpageModal = ref(false)
  const selectedValue = ref<string | null>(null)
  const typePayload = ref<string>('')
  const currentRow = ref<TableData | null>(null)

  const openFanpageModal = (row: TableData, type: any) => {
    currentRow.value = row
    showFanpageModal.value = true
    typePayload.value = type

    const optionsMap: Record<
      string,
      { options: any[]; value: any; fetch: Function; check?: () => boolean }
    > = {
      [Type.FANPAGE]: {
        options: fanpageOptions.value,
        value: row.fanpage_id,
        fetch: fetchFanpageOptions,
        check: () => !!row.fanpage_id && row.fanpage_id.length > 0,
      },
      [Type.LOCATION]: {
        options: locationOptions.value,
        value: row.location,
        fetch: fetchLocationOptions,
        check: () => !!row.location && row.location.length > 0,
      },
      [Type.PIXEL]: {
        options: pixelOptions.value,
        value: row.pixelName,
        fetch: () => fetchPixelOptions(row.name),
        check: () => !!row.pixelName && row.pixelName.length > 0,
      },
    }

    const { options, value, fetch, check } = optionsMap[type]
    selectedValue.value = options.length > 0 && check?.() ? value : null
    fetch()
  }

  const handleSubmitFanpage = async () => {
    try {
      isSubmitBtnLoading.value = true
      if (!currentRow.value || !selectedValue.value) return

      const getLabel = (): string | undefined => {
        let options: any[] = []

        switch (typePayload.value) {
          case Type.FANPAGE:
            options = fanpageOptions.value
            return (
              options.find((o) => o.post_id == selectedValue.value)?.name ||
              options.find((o) => o.post_id == selectedValue.value)?.label
            )
          case Type.LOCATION:
            options = locationOptions.value
            return options.find((o) => o.value == selectedValue.value)?.label
          case Type.PIXEL:
            options = pixelOptions.value
            return options.find((o) => o.value == selectedValue.value)?.label
          default:
            return undefined
        }
      }

      const selectedLabel = getLabel()

      await handlePixelConfirm(
        currentRow.value,
        selectedValue.value,
        typePayload.value,
        selectedLabel
      )

      showFanpageModal.value = false
    } finally {
      isSubmitBtnLoading.value = false
    }
  }
  return {
    // State
    id,
    name,
    isLoading,
    isSubmitBtnLoading,
    defaultAccountData,
    isSubmittingModal,
    loadingTrafficSource,
    trafficSourceOptions,
    demandSourceOptions,
    loadingDemandSource,
    loadingTable,
    tableData,
    initCategoryAllocation,
    selectedRows,
    selectedRowKeys,
    selectedAllTotal,
    deletingKeys,
    permissionAsyncConfigs,
    pageSize,
    currentPage,
    selectedCategories,
    selectedNames,
    searchQuery,
    payloadAccounts,
    totalRecord,
    showFanpageModal,
    selectedValue,
    currentRow,
    fanpageOptions,
    locationOptions,
    typePayload,
    totalEnabled,
    totalSuspended,
    feSettings,
    // Getters

    isGoogleAdsense,
    isEditPage,
    isFacebook,
    isLoadingUpdate,
    isFetchFanpage,
    isFetchLocation,
    pixelOptions,
    isFetchPixel,

    // Actions
    clearData,
    submitForm,
    fetchTrafficSourceOptions,
    fetchDemandSourceOptions,
    getById,
    fetchTableData,
    debouncedFetchTableData,
    deleteTableItems,
    setPermissionAsyncConfigs,
    openFanpageModal,
    handleSubmitFanpage,
    handlePixelConfirm,
    fetchFanpageOptions,
    handleSearchFanpage,
    fetchLocationOptions,
    clearSelectAllSelection,
    fetchPixelOptions,

    infomationError,
    showErr,
  }
})
