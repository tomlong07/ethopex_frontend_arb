import { defineStore } from 'pinia'
import ctr_post_back from '@/services/ctr_post_back'
import { useRouter } from 'vue-router'
import { PostBackTestResult } from '@/types/components/post_back'

export default defineStore('usePostBack', () => {
  const router = useRouter()
  const isSubmitLoading = ref<boolean>(false)
  const isTestLoading = ref<boolean>(false)
  const idPostBack = ref<number>(0)
  const isFetchPostBackDetailLoading = ref<boolean>(false)
  const isTestUrlPageWiewLoading = ref<boolean>(false)
  const isTestUrlSearchLoading = ref<boolean>(false)
  const isTestUrlConversionLoading = ref<boolean>(false)
  const dataTest = ref<PostBackTestResult | null>(null)

  const isAddPage = computed(() => idPostBack.value === 0)
  const titleCard = computed(() =>
    isAddPage.value ? `Add Post Back` : 'Edit Post Back'
  )

  const initialPayload = () => ({
    url_page_view: '',
    url_search: '',
    url_conversion: '',
  })

  const payload = ref(initialPayload())

  const resetPayload = () => {
    payload.value = initialPayload()
  }

  const fetchPostBackDetail = async () => {
    try {
      const id = idPostBack.value
      if (id === 0) return
      isFetchPostBackDetailLoading.value = true
      const result = await ctr_post_back.GetById(id)
      if (result?.status) {
        const { url_page_view, url_search, url_conversion } = result.data
        payload.value = { url_page_view, url_search, url_conversion }
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      isFetchPostBackDetailLoading.value = false
    }
  }

  const handleSubmit = async () => {
    try {
      isSubmitLoading.value = true

      const isEdit = !!idPostBack.value

      const result = isEdit
        ? await ctr_post_back.Edit(idPostBack.value, payload.value)
        : await ctr_post_back.Add(payload.value)

      if (result?.status) {
        window.message.success(
          result.message ||
            (isEdit ? 'Updated successfully' : 'Created successfully')
        )
        router.push({ path: '/postback' })
      }
    } finally {
      isSubmitLoading.value = false
    }
  }

  const handleTest = async (event: 'PageView' | 'Search' | 'Conversion') => {
    const id = idPostBack.value
    if (!id) return

    // URL tương ứng với event
    const urlMap = {
      PageView: payload.value.url_page_view,
      Search: payload.value.url_search,
      Conversion: payload.value.url_conversion,
    }

    const requestURL = urlMap[event]
    if (!requestURL) return

    // Loading riêng từng event
    const loadingMap = {
      PageView: isTestUrlPageWiewLoading,
      Search: isTestUrlSearchLoading,
      Conversion: isTestUrlConversionLoading,
    }
    const loading = loadingMap[event]
    loading.value = true

    try {
      const result = await ctr_post_back.Test(id, event, requestURL)
      if (result?.status) dataTest.value = result.data
    } finally {
      loading.value = false
    }
  }

  return {
    isSubmitLoading,
    isTestLoading,
    idPostBack,
    isFetchPostBackDetailLoading,
    isTestUrlPageWiewLoading,
    isTestUrlSearchLoading,
    isTestUrlConversionLoading,
    dataTest,
    isAddPage,
    titleCard,

    initialPayload,
    payload,
    resetPayload,

    fetchPostBackDetail,
    handleSubmit,
    handleTest,
  }
})
