import { defineStore } from 'pinia'
import ctr_google_exclude_list from '@/services/ctr_google_exclude_list'
import {
  IGoogleExcludeListData,
  IPlacementItem,
  IPaginationPlacements,
  TPlacementType,
  TAppCategoryRaw,
  TPlacementNode,
} from '@/types/components/google-exclude-list'
import type {
  ColDef,
  // GridOptions,
  SelectionChangedEvent,
  SortChangedEvent,
  SortDirection,
} from 'ag-grid-community'
import { FeSettings } from '@/class/fe_settings'

export const useGoogleExcludeList = defineStore('useGooleExcludeList', () => {
  // !! State
  const isPlacementsLoading = ref<boolean>(false)
  const idGoogleListExclude = ref<number>(0)
  const isFormLoading = ref<boolean>(false)
  const feSettings = ref<FeSettings>()

  const getDefaultGoogleExcludeListData = (): IGoogleExcludeListData => ({
    name: '',
    description: '',
    placements: [],
  })
  const googleExcludeListData = ref<IGoogleExcludeListData>(
    getDefaultGoogleExcludeListData()
  )

  const listCategory = ref<any[]>([])
  const listPlacements = ref<IPlacementItem[]>([])
  const paginationPlacements = ref<IPaginationPlacements>({
    page: 1,
    size: 10,
    total: 0,
  })
  const sortBy = ref<string>('created_at desc')

  const isGeneratePlacementsLoading = ref<boolean>(false)

  const textareaValueUrl = ref('')
  const MAX_LINE = 500
  const selectedTranferPlacements = ref<string[]>([])

  const checkedRowKeys = ref<string[]>([])
  const rowKey = (row: any) => row.placement

  const typeMap: Record<string, string> = {
    app_category: 'App Category',
    youtube_video: 'YouTube Video',
    youtube_channel: 'YouTube Channel',
    app_ios: 'iOS App',
    app_android: 'Android App',
    website: 'Website',
    invalid: 'Invalid',
  }
  const columns: ColDef[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
    },
    { headerName: 'Name', field: 'name' },
    {
      headerName: 'Type',
      field: 'type',
      minWidth: 150,
      valueFormatter: ({ value }) => typeMap[value] || value,
    },
    { headerName: 'Placement', field: 'placement' },
    {
      headerName: 'Created At',
      field: 'created_at',
      minWidth: 160,
      sortable: true,
      sort: 'desc',
    },
  ]
  const defaultColDef: ColDef = {
    sortable: true,
    flex: 1,
    minWidth: 120,
    sortingOrder: ['desc', 'asc'] as SortDirection[],
  }

  // !! Lifecycle hook
  const isUpdatePage = computed(() => idGoogleListExclude.value > 0)
  const isAddPage = computed(() => idGoogleListExclude.value === 0)
  const cardTitle = computed(() =>
    isUpdatePage.value
      ? 'Update Google Exclude List'
      : 'Create Google Exclude List'
  )
  const pageCount = computed(() => {
    const size = paginationPlacements.value.size
    const total = paginationPlacements.value.total
    return size > 0 ? Math.ceil(total / size) : 1
  })

  // !! Func
  const fetchPlacements = async () => {
    try {
      if (!isUpdatePage.value) {
        return
      }
      isPlacementsLoading.value = true
      const payload = {
        search: '',
        page: paginationPlacements.value.page,
        size: paginationPlacements.value.size,
        sort_by: sortBy.value,
      }
      const result = await ctr_google_exclude_list.GetPlacements(
        idGoogleListExclude.value,
        payload
      )

      if (result.status) {
        listPlacements.value = result?.data?.items || []
        paginationPlacements.value.total = result?.data?.total
      }
    } catch (error) {
      console.error(error)
    } finally {
      isPlacementsLoading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    paginationPlacements.value.page = page
    fetchPlacements()
  }

  const handlePageSizeChange = (pageSize: number) => {
    paginationPlacements.value.size = pageSize
    paginationPlacements.value.page = 1
    fetchPlacements()
  }

  const onSortChanged = (event: SortChangedEvent) => {
    const sortedColumns = event.api
      .getColumnState()
      .filter((col) => col.sort)
      .map((col) => ({ colId: col.colId, sort: col.sort }))

    if (sortedColumns.length > 0) {
      const { colId, sort } = sortedColumns[0]
      sortBy.value = `${colId} ${sort}`
    } else {
      sortBy.value = ''
    }

    fetchPlacements()
  }

  const onUrlInput = (val: string) => {
    const lines = val.split(/\n/)
    if (lines.length > MAX_LINE) {
      window.message.error(`Limit reached: Only ${MAX_LINE} lines are allowed.`)
      textareaValueUrl.value = lines.slice(0, MAX_LINE).join('\n')
    }
  }

  const getTypeFromUrl = (urlObj: URL): TPlacementType => {
    const hostname = urlObj.hostname
    const pathname = urlObj.pathname
    const searchParams = urlObj.searchParams

    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
      const isVideo =
        searchParams.has('v') ||
        hostname === 'youtu.be' ||
        pathname.startsWith('/embed/') ||
        pathname.startsWith('/live/') ||
        pathname.startsWith('/shorts/')

      if (isVideo) return 'youtube_video'
      if (pathname === '/playlist' && searchParams.has('list'))
        return 'youtube_playlist'

      const isChannel =
        pathname.startsWith('/@') ||
        pathname.startsWith('/channel/') ||
        pathname.startsWith('/user/') ||
        pathname.startsWith('/c/')

      if (isChannel) return 'youtube_channel'

      return 'youtube'
    }

    if (hostname.includes('apple.com')) return 'app_ios'
    if (hostname.includes('play.google.com')) return 'app_android'
    if (!hostname) return 'invalid'
    return 'website'
  }

  const isWebsite = (urlObj: URL): boolean => {
    const hostname = urlObj.hostname.toLowerCase()
    const pathname = urlObj.pathname
    const searchParams = urlObj.searchParams
    const hash = urlObj.hash

  
    const specialHosts = ['youtube.com', 'youtu.be', 'play.google.com', 'apps.apple.com']
    if (specialHosts.some((host) => hostname.includes(host))) return false

    
    const isRootPath = pathname === '/' || pathname === ''
    const hasNoQuery = Array.from(searchParams.keys()).length === 0
    const hasNoHash = !hash

    return isRootPath && hasNoQuery && hasNoHash
  }


  const guessName = (urlObj: URL): string => {
    const hostname = urlObj.hostname
    const pathname = urlObj.pathname
    const searchParams = urlObj.searchParams
    const pathParts = pathname.split('/').filter(Boolean)

    const formatName = (str: string): string => {
      return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }

    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
      const videoId = searchParams.get('v')
      const listId = searchParams.get('list')
      const firstSegment = pathParts[0]

      const videoMap: Record<string, string> = {
        shorts: 'YouTube Shorts',
        live: 'YouTube Live',
        embed: 'YouTube Video',
      }

      if (videoId) return `YouTube Video - ${videoId}`

      if (hostname === 'youtu.be' && firstSegment)
        return `YouTube Video - ${firstSegment}`

      if (videoMap[firstSegment] && pathParts[1])
        return `${videoMap[firstSegment]} - ${pathParts[1]}`

      if (pathname === '/playlist' && listId)
        return `YouTube Playlist - ${listId}`

      if (firstSegment?.startsWith('@'))
        return `Channel - ${firstSegment.slice(1)}`

      const channelMap: Record<string, string> = {
        channel: 'Channel',
        user: 'Channel',
        c: 'Channel',
      }

      if (channelMap[firstSegment] && pathParts[1]) {
        return `${channelMap[firstSegment]} - ${pathParts[1]}`
      }

      return urlObj.href
    }

    if (hostname.includes('apple.com')) {
      const parts = pathname.split('/').filter(Boolean)
      const appNameIndex = parts.indexOf('app')
      if (appNameIndex !== -1 && parts[appNameIndex + 1]) {
        return formatName(parts[appNameIndex + 1])
      }
    }

    if (hostname.includes('play.google.com')) {
      return urlObj.href
    }

    if (isWebsite(urlObj)) {
      return urlObj.hostname
    }

    if (pathname === '/') {
      const domainParts = hostname.split('.')
      if (domainParts.length >= 2) {
        return formatName(domainParts[domainParts.length - 2])
      }
    }

    const parts = pathname.split('/').filter(Boolean)
    const fallback =
      parts[parts.length - 2] || parts[parts.length - 1] || 'Unknown'
    return formatName(fallback)
  }

  const mergePlacementsAndSelections = (
    newItems: IPlacementItem[],
    existingItems: IPlacementItem[],
    currentSelections: string[]
  ): {
    mergedItems: IPlacementItem[]
    mergedSelections: string[]
  } => {
    const uniqueNewItems = newItems.filter(
      (newItem) =>
        !existingItems.some(
          (existing) => existing.placement === newItem.placement
        )
    )

    const mergedItems = [...existingItems, ...uniqueNewItems]

    const newSelections = uniqueNewItems.map((item) => item.placement)
    const mergedSelections = Array.from(
      new Set([...currentSelections, ...newSelections])
    )

    return {
      mergedItems,
      mergedSelections,
    }
  }

  const generatePlacements = async (): Promise<void> => {
    isGeneratePlacementsLoading.value = true

    try {
      const urls: string[] = Array.from(
        new Set(
          textareaValueUrl.value
            .split(/[\n,]+/)
            .map((url) => url.trim())
            .filter((url) => url !== '')
        )
      )

      await new Promise((resolve) => setTimeout(resolve, 500))

      const generatedPlacements: IPlacementItem[] = urls.map((url) => {
        try {
          const urlObj = url.includes('://')
            ? new URL(url)
            : new URL('https://' + url)
          return {
            name: guessName(urlObj),
            site: urlObj.hostname,
            placement: url,
            type: getTypeFromUrl(urlObj),
          }
        } catch {
          return {
            name: 'Invalid URL',
            site: '',
            placement: url,
            type: 'invalid',
          }
        }
      })

      const result = mergePlacementsAndSelections(
        generatedPlacements,
        googleExcludeListData.value.placements || [],
        selectedTranferPlacements.value || []
      )

      googleExcludeListData.value.placements = result.mergedItems
      selectedTranferPlacements.value = result.mergedSelections
      textareaValueUrl.value = ''
    } finally {
      isGeneratePlacementsLoading.value = false
    }
  }

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes()
    const selectedPlacements = selectedNodes.map((node) => node.data.placement)
    checkedRowKeys.value = selectedPlacements
  }

  const deletePlacements = async () => {
    const selectedPlacements = checkedRowKeys.value
    if (!selectedPlacements.length) return

    const result = await ctr_google_exclude_list.DeletePlacements(
      idGoogleListExclude.value,
      selectedPlacements
    )

    if (result.status) {
      window.message.success('Delete successfully')

      googleExcludeListData.value.placements =
        googleExcludeListData.value.placements.filter(
          (item) => !selectedPlacements.includes(item.placement)
        )

      checkedRowKeys.value = []

      await fetchPlacements()
    }
  }

  const getFilteredPlacements = (): any[] => {
    const placements = googleExcludeListData.value.placements
    const categoryList = listCategory.value
    const selected = selectedTranferPlacements.value

    if (!Array.isArray(selected) || selected.length === 0) {
      return []
    }

    const map = new Map<string, any>()

    if (Array.isArray(placements)) {
      for (const item of placements) {
        if (selected.includes(item.placement) && !map.has(item.placement)) {
          map.set(item.placement, item)
        }
      }
    }

    const traverse = (nodes: TPlacementNode[]) => {
      for (const node of nodes) {
        if (selected.includes(node.placement) && !map.has(node.placement)) {
          map.set(node.placement, node)
        }
        if (Array.isArray(node.children)) {
          traverse(node.children)
        }
      }
    }

    traverse(categoryList)

    return Array.from(map.values())
  }

  const createPlacements = async () => {
    const placementsFinal = getFilteredPlacements()

    if (placementsFinal.length === 0) {
      window.message.error('Please select placement')
      return
    }
    const result = await ctr_google_exclude_list.CreatePlacements(
      idGoogleListExclude.value,
      placementsFinal
    )

    if (result?.status) {
      window.message.success('Create successfully')
      googleExcludeListData.value.placements = []
      selectedTranferPlacements.value = []
      await fetchPlacements()
    }
  }

  const resetGoogleExcludeListData = () => {
    idGoogleListExclude.value = 0
    googleExcludeListData.value = getDefaultGoogleExcludeListData()
    isGeneratePlacementsLoading.value = false
    listPlacements.value = []
    selectedTranferPlacements.value = []
    textareaValueUrl.value = ''
  }

  const fetchGoogleExcludeListById = async () => {
    if (!isUpdatePage.value) return
    isFormLoading.value = true
    const result = await ctr_google_exclude_list.GetGoogleExclude(
      idGoogleListExclude.value
    )

    if (result.status) {
      googleExcludeListData.value.name = result.data.name
      googleExcludeListData.value.description = result.data.description
    }

    isFormLoading.value = false
  }

  const convertAppCategoriesToPlacements = (
    data: TAppCategoryRaw[]
  ): TPlacementNode[] => {
    if (!Array.isArray(data)) return []

    const storeMap = new Map<string, TPlacementNode>()
    const parentCategoryMap = new Map<string, TPlacementNode>()

    const stores = ['Apple App Store', 'Google Play']
    for (const store of stores) {
      storeMap.set(store, {
        type: 'app_category',
        placement: `store::${store}`,
        name: store,
        children: [],
      })
    }

    // let addedParents = 0
    // let addedCategories = 0

    for (const item of data) {
      const { store, parent_category, category_id, category } = item
      const storeNode = storeMap.get(store)
      if (!storeNode) continue

      const categoryNode: TPlacementNode = {
        type: 'app_category',
        placement: category_id,
        name: category,
      }

      if (parent_category) {
        const parentKey = `${store}::${parent_category}`
        let parentNode = parentCategoryMap.get(parentKey)

        if (!parentNode) {
          parentNode = {
            type: 'app_category',
            placement: `parent::${parent_category}`,
            name: parent_category,
            children: [],
          }
          parentCategoryMap.set(parentKey, parentNode)
          storeNode.children!.push(parentNode)
          // addedParents++
        }

        parentNode.children!.push(categoryNode)
      } else {
        storeNode.children!.push(categoryNode)
      }

      // addedCategories++
    }

    const result = Array.from(storeMap.values())

    return result
  }

  const fetchCategorys = async () => {
    const result = await ctr_google_exclude_list.GetCategory()

    listCategory.value = convertAppCategoriesToPlacements(result.data)
  }

  const submitForm = async () => {
    if (isAddPage) {
      googleExcludeListData.value.placements = getFilteredPlacements()
    }

    const payload = isAddPage.value
      ? googleExcludeListData.value
      : { id: idGoogleListExclude.value, ...googleExcludeListData.value }

    const result = isAddPage.value
      ? await ctr_google_exclude_list.CreateGoogleExclude(payload)
      : await ctr_google_exclude_list.UpdateGoogleExclude(payload)

    if (result?.status) {
      window.message.success('Save successfully')
      resetGoogleExcludeListData()

      if (isAddPage.value && feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value?.page_list })
      }
    }
  }

  return {
    idGoogleListExclude,
    isFormLoading,
    isGeneratePlacementsLoading,
    isPlacementsLoading,
    listPlacements,
    listCategory,
    feSettings,

    textareaValueUrl,
    selectedTranferPlacements,

    columns,
    defaultColDef,
    rowKey,
    checkedRowKeys,
    isUpdatePage,

    handlePageChange,
    handlePageSizeChange,
    onSortChanged,
    paginationPlacements,
    pageCount,

    cardTitle,
    googleExcludeListData,

    deletePlacements,
    getFilteredPlacements,
    onSelectionChanged,
    fetchGoogleExcludeListById,
    onUrlInput,
    generatePlacements,
    fetchPlacements,
    createPlacements,
    fetchCategorys,
    resetGoogleExcludeListData,
    submitForm,
  }
})
