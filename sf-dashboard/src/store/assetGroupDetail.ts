import { ONOFF } from '@/enum/campaign'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import ctr_asset_group from '@/services/ctr_asset_group'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { FeSettings } from '@/class/fe_settings'

interface AssetGroup {
  id?: number
  name?: string
  status?: ONOFF
  user_id?: number
  asset_groups?: AssetGroups[]
}

export interface AssetGroups {
  traffic_source?: string
  accounts?: string[]
  fanpages?: string[]
}

interface TrafficSourceOption {
  label: string
  value: string
}

interface ParamsAccountType {
  object?: string
  search?: string
  account_id?: string[]
  ids?: number[]
  limit?: number
}
export const useAssetGroupDetail = defineStore('assetGroupDetail', () => {
  // State
  const isLoading = ref(false)
  const isSubmitBtnLoading = ref(false)
  const loadingUsers = ref(false)
  const loadingAdAccounts = ref(false)
  const loadingFanpages = ref(false)
  const isLoadingTrafficSource = ref(false)
  const isFromGetByPublisher = ref(false)
  const hasNoTrafficSource = ref(false)
  const assetGroup = ref<AssetGroup>({
    asset_groups: [],
  })
  const userOptions = ref<SelectOption[]>([])
  const adAccountOptions = ref<SelectOption[]>([])
  const fanpageOptions = ref<SelectOption[]>([])
  const selectedUserEmail = ref('')
  const currentTrafficSource = ref('')
  const macroValueOptions = ref<TrafficSourceOption[]>([])
  const assetEmpty = ref<any>()
  const isRequest = ref(0)
  const showModalAsset = ref(false)
  const infoAssetDetail = ref('')

  const feSettings = ref<FeSettings>()
  // Getters
  const getAssetGroup = computed(() => assetGroup.value)
  const userIds = computed(() => assetGroup.value.user_id?.toString() || '')
  let msg: { destroy: () => void } | null = null

  const fanpageIds = computed(() => {
    const current = getCurrentAssetGroup.value
    return current.fanpages?.join(',') || ''
  })

  // Actions
  const checkAndSelectPublisher = async () => {
    const currentPath = window.location.pathname
    const match = currentPath.match(/\/get-by-publisher\/(.+)/)
    if (match && match[1]) {
      isFromGetByPublisher.value = true
      const email = match[1]
      await fetchUsers(email, true)
      const userOption = userOptions.value.find((user) => user.label === email)
      if (userOption) {
        assetGroup.value.user_id = userOption.value as number
        await setSelectedUserEmail(email)
        // await fetchAssetGroup(email)
      }
    } else {
      isFromGetByPublisher.value = false
      await fetchUsers('', true)
    }
    isRequest.value += 1
  }

  const fetchAssetGroup = async (email: string) => {
    isLoading.value = true

    try {
      const result = await ctr_asset_group.GetByPublisher(email)
      if (result?.data) {
        assetGroup.value = result.data
      }
      helper.sleep(100)
      await fetchTrafficSource()
    } finally {
      isLoading.value = false
    }
  }

  const submitForm = async () => {
    isSubmitBtnLoading.value = true
    let result

    try {
      result = await ctr_asset_group.AddAssetGroup(assetGroup.value)
      if (result?.status) {
        const action = isFromGetByPublisher.value ? 'Update' : 'Add'
        window.message.success(`${action} Asset Group successfully`)
        if (!isFromGetByPublisher.value && feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }
    } finally {
      isSubmitBtnLoading.value = false
    }
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

  const fetchFanpages = async (q?: string) => {
    loadingFanpages.value = true
    const result = await ctr_traffic_source.GetFacebookPage(
      {
        ids: fanpageIds.value,
        q: q,
      },
      {}
    )

    fanpageOptions.value = result?.data || []
    loadingFanpages.value = false
  }

  const getCurrentAssetGroup = computed(() => {
    return (
      assetGroup.value.asset_groups?.find(
        (group) => group.traffic_source === currentTrafficSource.value
      ) || {
        traffic_source: currentTrafficSource.value,
        ad_accounts: [],
        fanpages: [],
      }
    )
  })

  const fetchAccountsByTrafficSource = async ({
    object,
    search,
    account_id,
    ids,
  }: ParamsAccountType) => {
    loadingAdAccounts.value = true
    try {
      const result = await ctr_traffic_source.GetAccountByTrafficSource({
        object,
        search,
        account_id,
        ids,
        limit: 100000,
      } as ParamsAccountType)
      if (result?.status && result.data?.accounts) {
        if (result.data?.traffic_source === object) {
          adAccountOptions.value = result.data.accounts || []
        } else {
          adAccountOptions.value = []
        }
      }
    } finally {
      loadingAdAccounts.value = false
    }
  }

  const clearAssetGroup = () => {
    assetGroup.value = {
      status: ONOFF.ON,
      asset_groups: [],
    }
    macroValueOptions.value = []
    assetEmpty.value = {}
  }
  const initData = async () => {
    isLoading.value = true
    clearAssetGroup()
    await checkAndSelectPublisher()
    isLoading.value = false
  }

  // Getter for selectedUserEmail
  const getUserEmail = computed(() => selectedUserEmail.value)

  // Action to set selectedUserEmail
  const setSelectedUserEmail = async (email: string) => {
    clearAssetGroup()
    selectedUserEmail.value = email
    await fetchAssetGroup(email)
  }

  const handleTabChange = async (value: string) => {
    adAccountOptions.value = []
    if (value) {
      window.router.push({
        query: {
          ...window.route.query,
          traffic_source: value,
        },
      })
      const findAssetGroup = assetGroup.value?.asset_groups?.find(
        (item) => item.traffic_source === value
      )
      if (findAssetGroup) {
        assetEmpty.value = findAssetGroup
      }

      await fetchAccountsByTrafficSource({ object: value })
      isRequest.value += 1
    }
  }

  const updateAssetGroupByTrafficSource = (
    trafficSource: string,
    data: { accounts?: string[] } | { fanpages?: string[] },
    overwrite: boolean = false // flag cho modal
  ) => {
    const groups = assetGroup.value.asset_groups || []

    let group = groups.find((g) => g.traffic_source === trafficSource)
    if (!group) {
      group = { traffic_source: trafficSource, accounts: [], fanpages: [] }
      groups.push(group)
    }

    if ('accounts' in data) {
      const newIds = Array.isArray(data.accounts) ? data.accounts : []

      if (overwrite) {
        // Khi gọi từ modal: ghi đè toàn bộ ad_accounts, bỏ qua trùng lặp
        group.accounts = [...newIds]
      } else {
        const oldIds = group.accounts || []

        // Tìm các id đã tồn tại
        const duplicateIds = newIds.filter((id) => oldIds.includes(id))

        if (duplicateIds.length) {
          if (msg) msg.destroy()

          const duplicateLabels = duplicateIds.map((value) => {
            const option = adAccountOptions.value.find((o) => o.value === value)
            return option ? option.name : value
          })

          msg = window.message.error(
            `These accounts already exist: ${duplicateLabels.join(', ')}`
          )
        }

        // Chỉ thêm các id mới chưa tồn tại
        const uniqueNewIds = newIds.filter((id) => !oldIds.includes(id))
        group.accounts = [...oldIds, ...uniqueNewIds]
      }
    }

    if ('fanpages' in data) {
      const oldPages = group.fanpages || []
      const newPages = Array.isArray(data.fanpages) ? data.fanpages : []
      group.fanpages = Array.from(new Set([...oldPages, ...newPages]))
    }

    assetEmpty.value = group
    return group
  }

  const handleSearchAccount = async (search: string) => {
    if (currentTrafficSource.value) {
      await fetchAccountsByTrafficSource({
        object: currentTrafficSource.value,
        search,
      })
    }
  }

  const fetchTrafficSource = async () => {
    if (!selectedUserEmail.value) return

    try {
      isLoadingTrafficSource.value = true
      const result = await ctr_asset_group.GetTrafficSource(
        selectedUserEmail.value
      )

      if (result?.status) {
        macroValueOptions.value = result?.data || []

        if (macroValueOptions.value.length === 0) {
          hasNoTrafficSource.value = true
          currentTrafficSource.value = ''
        } else {
          hasNoTrafficSource.value = false

          if (!assetGroup.value.asset_groups) {
            assetGroup.value.asset_groups = []
          }

          macroValueOptions.value.forEach((ts) => {
            const exists = assetGroup.value.asset_groups?.some(
              (g) => g.traffic_source === ts.value
            )

            if (!exists) {
              assetGroup.value.asset_groups?.push({
                traffic_source: ts.value,
                accounts: [],
                fanpages: [],
              })
            }
          })

          const trafficSource = window.route.query.traffic_source as string

          const defaultTab =
            macroValueOptions.value.find((item) => item.value === trafficSource)
              ?.value || macroValueOptions.value[0].value

          currentTrafficSource.value = defaultTab

          await handleTabChange(defaultTab)
        }
      }
    } finally {
      isLoadingTrafficSource.value = false
    }
  }

  return {
    // State
    isLoading,
    isSubmitBtnLoading,
    assetGroup,
    userOptions,
    adAccountOptions,
    fanpageOptions,
    selectedUserEmail,
    currentTrafficSource,
    loadingAdAccounts,
    isLoadingTrafficSource,
    macroValueOptions,
    isFromGetByPublisher,
    hasNoTrafficSource,
    assetEmpty,
    isRequest,
    showModalAsset,
    infoAssetDetail,
    feSettings,

    // Getters
    getAssetGroup,
    getUserEmail,
    getCurrentAssetGroup,

    // Actions
    fetchAssetGroup,
    submitForm,
    initData,
    fetchUsers,
    fetchFanpages,
    setSelectedUserEmail,
    fetchAccountsByTrafficSource,
    updateAssetGroupByTrafficSource,
    fetchTrafficSource,
    handleTabChange,
    handleSearchAccount,
    checkAndSelectPublisher,
  }
})
