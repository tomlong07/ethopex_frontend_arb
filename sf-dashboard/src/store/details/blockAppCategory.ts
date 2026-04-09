import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

import { TS } from '@/enum/campaign'
import { ctr_account_category } from '@/services/ctr_account_category'
import { FeSettings } from '@/class/fe_settings'
interface BlockAppCategoryStruct {
  id?: number
  name?: string
  accounts?: string[]
  categories?: string[]
  list_exclude?: number[]

  // thêm các fields khác
}

interface Option {
  store: string
  label: string
  value: string
  parent_category?: string
  isNotShow?: boolean
  children?: Option[]
}

export const useBlockAppCategory = defineStore('blockAppCategory', () => {
  // State
  const isLoading = ref(true)
  const isSubmitBtnLoading = ref(false)
  const accountLoading = ref(false)
  const categoryLoading = ref(false)
  const showModal = ref(false)
  const modalData = ref('')

  const accountOptions = ref<SelectOption[]>([])
  const accountBaseOptions = ref<SelectOption[]>([])
  const categoryOptions = ref<SelectOption[]>([])

  const blockAppCategoryData = ref<BlockAppCategoryStruct>({})
  const feSettings = ref<FeSettings>()
  
  const infomationError = ref<any>({})

  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)  
  })

  const categoryForShow = computed(() => {
    const storeMap = new Map<string, Option>()

    // Bước 1: Tạo root store nodes
    const stores = ['Apple App Store', 'Google Play']
    stores.forEach((store) => {
      storeMap.set(store, {
        value: store,
        label: store,
        store,
        parent_category: store,
        isNotShow: true,
        children: [],
      })
    })

    const parentCategoryMap = new Map<string, Option>()

    // Bước 2: Build cây 3 cấp: store -> parent_category -> category
    categoryOptions.value?.forEach((item) => {
      const store = item.store as string
      const parent_category = item.parent_category as string | undefined
      const categoryID = item.category_id as string
      const label = item.category as string

      const storeNode = storeMap.get(store)
      if (!storeNode) return

      if (parent_category) {
        // Kiểm tra hoặc tạo parent_category node
        const parentKey = `${store}-${parent_category}`
        let parentNode = parentCategoryMap.get(parentKey)

        if (!parentNode) {
          parentNode = {
            value: parent_category,
            label: parent_category,
            store,
            parent_category,
            isNotShow: true,
            children: [],
          }
          storeNode.children?.push(parentNode)
          parentCategoryMap.set(parentKey, parentNode)
        }

        // Thêm category vào parent_category
        parentNode.children?.push({
          value: categoryID,
          label,
          store,
          parent_category,
        })
      } else {
        // Nếu không có parent_category thì thêm thẳng vào store
        storeNode.children?.push({
          value: categoryID,
          label,
          store,
          parent_category,
        })
      }
    })

    return Array.from(storeMap.values())
  })

  const clearData = () => {
    blockAppCategoryData.value = {
      accounts: [],
      categories: [],
    }
  }

  const initData = async () => {
    clearData()
    if (window.route.query?.id) {
      const result = await ctr_account_category.GetBlockAppCategoryByID(
        window.route.query?.id
      )

      blockAppCategoryData.value = result?.data || {}
      if (!blockAppCategoryData.value.accounts)
        blockAppCategoryData.value.accounts = []
      if (!blockAppCategoryData.value.categories)
        blockAppCategoryData.value.categories = []
    }

    isLoading.value = false
  }

  const fetchAccounts = async (query?: string) => {
    accountLoading.value = true

    //Lấy hết trường hợp để select all
    const result = await ctr_traffic_source.GetAccountV2({
      object: TS.GOOGLE,
      //   id: props.campaign.account_supply_id || undefined,
      q: query || '',
      limit: 5000,
    })

    accountOptions.value = result?.data?.accounts || []
    accountBaseOptions.value = helper.clone(accountOptions.value)
    accountLoading.value = false
  }

  const fetchCategories = async () => {
    categoryLoading.value = true

    const result = await ctr_account_category.ListCategory()
    categoryOptions.value = result?.data || []

    categoryLoading.value = false
  }

  const submitForm = async () => {
    isSubmitBtnLoading.value = true

    const result = await ctr_account_category.SubmitAccountGoogleCategory(
      blockAppCategoryData.value
    )

    if (result?.status) {
      window.message.success(`Save successfully`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    } else {
      infomationError.value = result
    }
    isSubmitBtnLoading.value = false
  }

  return {
    // State
    isLoading,
    isSubmitBtnLoading,
    accountLoading,
    showModal,
    modalData,
    categoryLoading,
    blockAppCategoryData,
    accountOptions,
    accountBaseOptions,
    categoryOptions,
    feSettings,
    infomationError,
    showErr,

    // Getters
    categoryForShow,

    // Actions
    initData,
    fetchAccounts,
    fetchCategories,
    submitForm,
  }
})
