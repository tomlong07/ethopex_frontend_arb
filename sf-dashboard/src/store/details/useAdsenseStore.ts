import { defineStore } from 'pinia'
import {
  adsenseAccountConfigInput,
  layOutConfigType,
} from '@/types/components/types'

export default defineStore('addsenseAcountStore', () => {
  const isDisable = ref(false)
  const isLoading = ref(false)
  const isSubmitBtnLoading = ref<boolean>(false)
  const layoutOptions = ref<{ value: string; name: string }[]>([])

  // Available traffic sources để chọn (từ API)
  const availableTrafficSources = ref<{ id: string; name: string }[]>([])

  // Active tabs (chỉ những tabs user đã add)
  const activeTabs = ref<{ id: string; name: string }[]>([
    { id: 'default', name: 'Default' },
  ])
  const activeTabName = ref<string>('Default')

  const tabLayoutConfigs = ref<Record<string, { n2s: any[]; s2s: any[] }>>({
    default: {
      n2s: [{ status: 'off', layout: null, style_id: '', traffic_source: '' }],
      s2s: [{ status: 'off', layout: null, style_id: '', traffic_source: '' }],
    },
  })

  const newMiniData = () => {
    return {
      status: 'off',
      layout: null,
      style_id: '',
      traffic_source: '',
    } as layOutConfigType
  }

  const dataAccountConfig = {
    name: '',
    status: 'on',
    pub_id: '',
    gam_id: '',
    api_key: '',
    channels: '',
    layout_config: {
      n2s: [
        {
          status: 'off',
          layout: null,
          style_id: '',
          type: '',
          traffic_source: '',
        },
      ],
      s2s: [
        {
          status: 'off',
          layout: null,
          style_id: '',
          type: '',
          traffic_source: '',
        },
      ],
    },

    position: {
      mobile: [],
      desktop: [],
    },
  }

  const adsenseAccountConfig = ref<adsenseAccountConfigInput>({
    ...dataAccountConfig,
  })

  // Computed để lấy tab ID hiện tại
  const currentTabId = computed(() => {
    return (
      activeTabs.value.find((tab) => tab.name === activeTabName.value)?.id ||
      'default'
    )
  })

  // Computed cho layout của tab hiện tại
  const currentN2S = computed({
    get: () => tabLayoutConfigs.value[currentTabId.value]?.n2s || [],
    set: (val) => {
      if (!tabLayoutConfigs.value[currentTabId.value]) {
        tabLayoutConfigs.value[currentTabId.value] = { n2s: [], s2s: [] }
      }
      tabLayoutConfigs.value[currentTabId.value].n2s = val
    },
  })

  const currentS2S = computed({
    get: () => tabLayoutConfigs.value[currentTabId.value]?.s2s || [],
    set: (val) => {
      if (!tabLayoutConfigs.value[currentTabId.value]) {
        tabLayoutConfigs.value[currentTabId.value] = { n2s: [], s2s: [] }
      }
      tabLayoutConfigs.value[currentTabId.value].s2s = val
    },
  })

  // Computed để lấy các traffic sources chưa được add
  const availableTrafficSourcesForAdd = computed(() => {
    const addedIds = activeTabs.value.map((tab) => tab.id)
    return availableTrafficSources.value.filter(
      (source) => !addedIds.includes(source.id)
    )
  })

  // Actions
  const setAvailableTrafficSources = (
    sources: { id: string; name: string }[]
  ) => {
    availableTrafficSources.value = sources
  }

  const addTab = (trafficSourceId: string) => {
    const trafficSource = availableTrafficSources.value.find(
      (s) => s.id === trafficSourceId
    )
    if (!trafficSource) return

    // Add tab to active tabs
    activeTabs.value.push({
      id: trafficSource.id,
      name: trafficSource.name,
    })

    // Initialize layout config for new tab
    const trafficSourceValue =
      trafficSource.id === 'default' ? '' : trafficSource.id
    tabLayoutConfigs.value[trafficSource.id] = {
      n2s: [{ ...newMiniData(), traffic_source: trafficSourceValue }],
      s2s: [{ ...newMiniData(), traffic_source: trafficSourceValue }],
    }

    // Switch to new tab
    activeTabName.value = trafficSource.name
  }

  const removeTab = (tabId: string) => {
    if (tabId === 'default') return

    // Tìm tab sẽ bị xóa
    const tabToRemove = activeTabs.value.find((tab) => tab.id === tabId)
    const isCurrentTab = activeTabName.value === tabToRemove?.name

    // Remove from active tabs
    activeTabs.value = activeTabs.value.filter((tab) => tab.id !== tabId)

    delete tabLayoutConfigs.value[tabId]

    // Nếu tab hiện tại bị xóa thì switch về Default
    if (isCurrentTab) {
      activeTabName.value = 'Default'
    }
  }

  const switchTab = (newTabName: string) => {
    activeTabName.value = newTabName

    const newTabId = activeTabs.value.find((tab) => tab.name === newTabName)?.id
    if (!newTabId) return

    const trafficSource = newTabId === 'default' ? '' : newTabId

    // Đảm bảo tab có dữ liệu
    if (!tabLayoutConfigs.value[newTabId]) {
      tabLayoutConfigs.value[newTabId] = {
        n2s: [{ ...newMiniData(), traffic_source: trafficSource }],
        s2s: [{ ...newMiniData(), traffic_source: trafficSource }],
      }
    }

    // Cập nhật traffic_source cho tab
    tabLayoutConfigs.value[newTabId].n2s = tabLayoutConfigs.value[
      newTabId
    ].n2s.map((item) => ({
      ...item,
      traffic_source: trafficSource,
    }))
    tabLayoutConfigs.value[newTabId].s2s = tabLayoutConfigs.value[
      newTabId
    ].s2s.map((item) => ({
      ...item,
      traffic_source: trafficSource,
    }))
  }

  const addN2SItem = () => {
    const trafficSource =
      currentTabId.value === 'default' ? '' : currentTabId.value
    currentN2S.value = [
      ...currentN2S.value,
      { ...newMiniData(), traffic_source: trafficSource },
    ]
  }

  const removeN2SItem = (index: number) => {
    if (currentN2S.value.length <= 1) return
    const newData = [...currentN2S.value]
    newData.splice(index, 1)
    currentN2S.value = newData
  }

  const addS2SItem = () => {
    const trafficSource =
      currentTabId.value === 'default' ? '' : currentTabId.value
    currentS2S.value = [
      ...currentS2S.value,
      { ...newMiniData(), traffic_source: trafficSource },
    ]
  }

  const removeS2SItem = (index: number) => {
    if (currentS2S.value.length <= 1) return
    const newData = [...currentS2S.value]
    newData.splice(index, 1)
    currentS2S.value = newData
  }

  // Tạo payload từ active tabs
  const getAllTabsPayload = () => {
    const allN2S: any[] = []
    const allS2S: any[] = []

    activeTabs.value.forEach((tab) => {
      const config = tabLayoutConfigs.value[tab.id]
      const trafficSource = tab.id === 'default' ? '' : tab.id

      if (config) {
        config.n2s.forEach((item) => {
          if (item.layout) {
            allN2S.push({ ...item, traffic_source: trafficSource })
          }
        })

        config.s2s.forEach((item) => {
          if (item.layout) {
            allS2S.push({ ...item, traffic_source: trafficSource })
          }
        })
      }
    })

    return {
      n2s: allN2S,
      s2s: allS2S,
    }
  }

  const clearDataAdsense = () => {
    adsenseAccountConfig.value = structuredClone(dataAccountConfig)
    tabLayoutConfigs.value = {
      default: {
        n2s: [{ ...newMiniData(), traffic_source: '' }],
        s2s: [{ ...newMiniData(), traffic_source: '' }],
      },
    }
    activeTabs.value = [{ id: 'default', name: 'Default' }]
    activeTabName.value = 'Default'
    availableTrafficSources.value = []
  }

  const initFromAdsenseConfig = (config: adsenseAccountConfigInput) => {
    // clone để tránh tham chiếu reactive không mong muốn
    const cfg = structuredClone(config) as adsenseAccountConfigInput
    adsenseAccountConfig.value = cfg

    const n2s = cfg.layout_config?.n2s ?? []
    const s2s = cfg.layout_config?.s2s ?? []

    // tập các traffic_source có trong API ('' => default)
    const tsSet = new Set<string>()
    const addTs = (t?: string) =>
      tsSet.add((t ?? '') === '' ? 'default' : t ?? '')
    n2s.forEach((i: any) => addTs(i.traffic_source))
    s2s.forEach((i: any) => addTs(i.traffic_source))

    // luôn có Default tab
    if (!tsSet.has('default')) tsSet.add('default')

    // build activeTabs: Default trước, sau đó là các traffic khác (lấy tên từ availableTrafficSources nếu có)
    const tabs: { id: string; name: string }[] = []
    tabs.push({ id: 'default', name: 'Default' })
    tsSet.forEach((t) => {
      if (t === 'default') return
      const name =
        availableTrafficSources.value.find((s) => s.id === t)?.name ?? t
      tabs.push({ id: t, name })
    })
    activeTabs.value = tabs

    // build tabLayoutConfigs từ dữ liệu API
    const configs: Record<string, { n2s: any[]; s2s: any[] }> = {}
    activeTabs.value.forEach((tab) => {
      const trafficSource = tab.id === 'default' ? '' : tab.id

      const filteredN2S = n2s
        .filter((it: any) => (it.traffic_source ?? '') === trafficSource)
        .map((it: any) => ({
          ...newMiniData(),
          ...it,
          traffic_source: trafficSource,
        }))

      const filteredS2S = s2s
        .filter((it: any) => (it.traffic_source ?? '') === trafficSource)
        .map((it: any) => ({
          ...newMiniData(),
          ...it,
          traffic_source: trafficSource,
        }))

      configs[tab.id] = {
        n2s: filteredN2S.length
          ? filteredN2S
          : [{ ...newMiniData(), trafficSource }],
        s2s: filteredS2S.length
          ? filteredS2S
          : [{ ...newMiniData(), trafficSource }],
      }
    })

    tabLayoutConfigs.value = configs
    activeTabName.value = 'Default'

    // đảm bảo có sẵn structure khi mount
    if (!adsenseAccountConfig.value.position) {
      adsenseAccountConfig.value.position = {
        mobile: [],
        desktop: [],
      }
    }
  }
  return {
    // States
    isDisable,
    isLoading,
    isSubmitBtnLoading,
    adsenseAccountConfig,
    layoutOptions,
    availableTrafficSources,
    activeTabs,
    activeTabName,
    tabLayoutConfigs,

    // Computed
    currentTabId,
    currentN2S,
    currentS2S,
    availableTrafficSourcesForAdd,

    // Actions
    newMiniData,
    setAvailableTrafficSources,
    addTab,
    removeTab,
    switchTab,
    addN2SItem,
    removeN2SItem,
    addS2SItem,
    removeS2SItem,
    getAllTabsPayload,
    clearDataAdsense,
    initFromAdsenseConfig,
  }
})
