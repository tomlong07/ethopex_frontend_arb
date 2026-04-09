import ctr_brand from '@/services/ctr_brand'
import { BrandCls } from '@/types/components/brand_type'
import { GridApi } from 'ag-grid-community'
import { defineStore } from 'pinia'
import { useTemplateV2 } from './templateV2Store'

export default defineStore('useBrandStore', () => {
  const showModal = ref<boolean>(false)
  const gridApi = ref<GridApi | null>(null)
  const createType = ref<'create' | 'edit'>('create')
  const listBrand = ref<any>({})
  const keywordSearch = ref('')
  const isRequest = ref(false)
  const currentPaging = ref({
    page: 1,
    size: 10,
  })
  const currentBrand = ref<BrandCls>({})

  const fetchData = async () => {
    gridApi.value?.showLoadingOverlay()

    const { page, size } = currentPaging.value
    const _payload = {
      page,
      size,
      search: keywordSearch.value,
    }

    const result = await ctr_brand.Get(_payload)
    if (result.data) {
      listBrand.value = result.data
    }
    gridApi.value?.hideOverlay()
  }

  const openModal = () => {
    showModal.value = true
    currentBrand.value = new BrandCls({})
  }

  const getById = async (id: number) => {
    const result = await ctr_brand.GetById(id)
    if (result.data) {
      currentBrand.value = new BrandCls(result.data)
    }
  }

  const submit = async () => {
    if (!currentBrand.value.brand_name) return
    try {
      isRequest.value = true
      let result
      if (createType.value === 'create') {
        result = await ctr_brand.Create(currentBrand.value)
      } else {
        result = await ctr_brand.Update(currentBrand.value)
      }

      if (result?.status) {
        window.message.success(createType.value === 'create' ? 'Submit successfully!' : 'Update successfully!')
        showModal.value = false

        // Trigger reload table
        const templateV2Store = useTemplateV2(helper.truePath())()
        templateV2Store.reInitTable()
      }
    } finally {
      isRequest.value = false
    }
  }

  return {
    showModal,
    gridApi,
    currentPaging,
    currentBrand,
    listBrand,
    keywordSearch,
    createType,
    isRequest,

    submit,
    fetchData,
    openModal,
    getById,
  }
})
