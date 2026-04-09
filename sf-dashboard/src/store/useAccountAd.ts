import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { ctr_account } from '@/services/ctr_account'
import {
  accountCondition,
  accountMcc,
  accountType,
  TabAccountMcc,
} from '@/types/components/account'
import { PayloadObjectLabel } from '@/types/components/account-ad'
import { GridApi } from 'ag-grid-community'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { TS } from '@/enum/campaign'

export default defineStore('useAccountAd', () => {
  //  ref
  const isLoadingTable = ref<boolean>(false)
  const showModalReconnect = ref<boolean>(false)
  const showModal = ref<boolean>(false)
  const showModalCreateLabel = ref<boolean>(false)
  const showModalBulk = ref<boolean>(false)
  const showModalChangeMCC = ref<boolean>(false)
  const isSubmittingBulk = ref<boolean>(false)
  const accountAd = ref<accountType>({}) // state dùng cho page Account Detaill
  const excludeGoogle = ref<any>({})
  const listLabel = ref<any>({})
  const id = ref<string>('')
  const id_route = ref(Number(window.route.params.id || 0))
  const gridApi = ref<GridApi | null>(null)
  const accountAdsDetail = ref<accountType>({})
  const accountSelected = ref<any[]>([])
  const searchText = ref('')
  const currentPagingDetail = ref({
    page: 1,
    size: 10,
  })
  const dataLabel = ref<{
    id?: string
    labels?: PayloadObjectLabel[]
  }>({})
  const type = ref<string>('id')
  const watchId = ref<boolean>(false)
  const dataToChange = ref<any>(null)
  const mccOptions = ref<SelectOption[]>([])

  const colorMap = ref<{ [key: string]: string }>({})

  const categoryOptions = ref<SelectOption[]>([]) //Lấy ở preload hiển thị cell

  const dataCategories = ref<{
    id?: string
    categories?: string[]
  }>({})

  const accountAdsDetailCondition = ref<accountCondition>({
    type: [],
    account_ids: [],
    cp_status: [],
    list_exclude_scan: [],
    labels: [],
  })
  const tabAccountMcc = ref<TabAccountMcc>({
    name: null,
    count: null,
    time_delay: null,
  })

  // computed
  const isId = computed(() => {
    return type.value === 'id' || false
  })

  const isAdvertiser = computed(() => {
    return type.value === 'advertiser' || false
  })

  const isLabels = computed(() => {
    return type.value === 'labels' || false
  })

  const isCategories = computed(() => {
    return type.value === 'categories' || false
  })
  const isGoogleAccount = computed<boolean>(() => {
    return accountAd.value.object === TS.GOOGLE
  })
  const isGeneralAccount = computed<boolean>(() => {
    return accountAd.value.object && accountAd.value.is_general == 'on'
      ? true
      : false
  })
  const isFacebookAccount = computed<boolean>(() => {
    return accountAd.value.object === TS.FACEBOOK
  })
  const isTiktokAccount = computed<boolean>(() => {
    return accountAd.value.object === TS.TIKTOK
  })
  //watch
  watch(
    () => window.route.params.id,
    (v) => {
      id_route.value = Number(v || 0)
    }
  )

  // function
  const updateColorMap = (data: any[]) => {
    colorMap.value = {}
    data.forEach((element) => {
      colorMap.value[element.label as string] = element.color as string
    })
  }

  const buildAccountAdsDetailPayload = () => {
    const filterCondition = accountAdsDetailCondition.value

    const payloadLabels =
      Array.isArray(filterCondition.labels) && filterCondition.labels.length > 0
        ? filterCondition.labels.filter((x) => x != null && x !== 'none')
        : ['all']

    const finalPayload = payloadLabels.length > 0 ? payloadLabels : []

    return {
      filter: {
        ...filterCondition,
        list_exclude_scan:
          filterCondition.list_exclude_scan &&
          filterCondition.list_exclude_scan?.length > 0
            ? filterCondition.list_exclude_scan
            : ['all'],
        labels: finalPayload,
      },
      customFilter: {},
      search: searchText.value || '',
      page: currentPagingDetail.value.page || 1,
      size: currentPagingDetail.value.size || 10,
      detailed_id: id_route.value,
      sort: [{ field: 'id', dir: 'desc' }],
    }
  }

  const GetAccountAdsDetail = async (payload?: any) => {
    isLoadingTable.value = true
    const _payload = payload || buildAccountAdsDetailPayload()

    let result = await ctr_account.GetAccountAdsDetail(_payload)

    accountAdsDetail.value = result.data
    isLoadingTable.value = false
    return result
  }

  const getListExcludeGoogle = async () => {
    let result = await ctr_account.GetListExcludeGoogle()
    excludeGoogle.value = result
    return result
  }

  const getListLabel = async () => {
    let result = await ctr_account.GetListLabel()
    listLabel.value = result
    return result
  }
  const accountMcc = ref<accountMcc>({
    name: '',
    account_id: 0,
    mcc_id: null,
    status: '',
    error: '',
    create_at: '',
    time_run: '',
  })
  const accountMccList = ref<accountMcc[]>([])
  const getFilterMcc = async () => {
    const result = await ctr_filter_v2.GetFilterMcc()
    mccOptions.value = result?.data || undefined
  }
  const currentPageMCC = ref(1)
  const pageSizeMCC = ref(10)
  const totalRecords = ref(0)
  const filterAccoutMcc = async (status = 'new'): Promise<void> => {
    const payload = {
      mcc_id: accountMcc.value.mcc_id,
      status: status,
      page: currentPageMCC.value,
      size: pageSizeMCC.value,
    }
    let result = await ctr_account.AccountMcc(payload)
    const records = result.data.recordsTotal || 0
    const totalPage = Math.ceil(records / pageSizeMCC.value)

    if (currentPageMCC.value > totalPage && totalPage > 0) {
      currentPageMCC.value = 1
      return filterAccoutMcc(status)
    }
    accountMccList.value = result.data.items
    totalRecords.value = result.data.recordsTotal
  }

  return {
    mccOptions,
    showModal,
    showModalCreateLabel,
    showModalBulk,
    isSubmittingBulk,
    colorMap,
    id,
    dataLabel,
    type,
    watchId,
    dataToChange,
    categoryOptions,
    dataCategories,
    isId,
    isAdvertiser,
    isLabels,
    isCategories,
    updateColorMap,
    accountAd,
    GetAccountAdsDetail,
    isLoadingTable,
    showModalReconnect,
    gridApi,
    isGoogleAccount,
    isTiktokAccount,
    isFacebookAccount,
    isGeneralAccount,
    getListExcludeGoogle,
    excludeGoogle,
    currentPagingDetail,
    accountAdsDetail,
    getListLabel,
    listLabel,
    searchText,
    accountSelected,
    accountAdsDetailCondition,
    id_route,
    getFilterMcc,
    tabAccountMcc,
    filterAccoutMcc,
    accountMcc,
    accountMccList,
    currentPageMCC,
    pageSizeMCC,
    totalRecords,
    showModalChangeMCC,
  }
})
