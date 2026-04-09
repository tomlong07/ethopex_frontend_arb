import { pixelTriggersConfigType } from '@/types/components/pixel_manager'
import { defineStore } from 'pinia'
import { tableInfo } from '@/types/components/pixel_manager'
import { columnsDefPixelTrigger } from '@/columns/pixel_trigger'
import { PixelOption } from '@/types/components/pixel_triggers_detail'
import { ctr_pixel_trigger } from '@/services/ctr_pixel_trigger'

export default defineStore('usePixelTriggersDetail', () => {
  const id = computed<number>(() => Number(window.route.params.id || 0))
  const isLoading = ref<boolean>(false)
  const isDisable = ref<boolean>(false)
  const showModal = ref<boolean>(false)
  const multipleAccountIds = ref('')
  const isAddPage = computed<boolean>(() => id.value === 0)
  const isEditPage = computed<boolean>(() => {
    return !isAddPage.value
  })
  const optionPixel = reactive(new PixelOption())
  const getDefaultData = (): pixelTriggersConfigType => ({
    name: '',
    status: 'on',
    pixel_ids: [],
    triggers: [{ field: null, condition: 'include', value: [] }],
    publisher: null,
  })

  const pixelConfig = ref<pixelTriggersConfigType>(getDefaultData())

  const clearData = () => {
    pixelConfig.value = getDefaultData()
  }

  const campsByTrigger = ref({
    loading: false,
    page: 1,
    pageSize: 10,
    total: 0,
    search: '',
    searchTimeout: null,
    columnDefs: columnsDefPixelTrigger as any[],
    rowData: [] as any[],
  } as tableInfo)

  const updatePage = (page: number) => {
    campsByTrigger.value.page = page
    getListCampaignsByTrigger()
  }

  const getListCampaignsByTrigger = async () => {
    campsByTrigger.value.loading = true

    let resRaw = await ctr_pixel_trigger.GetCampaignsByTrigger({
      page: campsByTrigger.value.page,
      size: campsByTrigger.value.pageSize,
      search: campsByTrigger.value.search,
      id: id.value,
    })

    if (resRaw && resRaw.data?.items) {
      campsByTrigger.value.rowData = resRaw.data.items
      campsByTrigger.value.total = resRaw.data.recordsTotal
    } else {
      campsByTrigger.value.rowData = []
      campsByTrigger.value.total = 0
    }

    campsByTrigger.value.loading = false
  }

  return {
    pixelConfig,
    campsByTrigger,
    showModal,
    isLoading,
    isDisable,
    multipleAccountIds,
    isEditPage,
    isAddPage,
    id,
    optionPixel,

    updatePage,
    clearData,
    getListCampaignsByTrigger,
  }
})
