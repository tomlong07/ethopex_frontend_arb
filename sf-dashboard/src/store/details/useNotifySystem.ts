import ctr_notify_system from '@/services/ctr_notify_system'
import { INotifySystemItem } from '@/types/components/notify_system'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { useRouter } from 'vue-router'
import { menuNew } from '@/types/state/general'

export default defineStore('useNotifySystem', () => {
  const router = useRouter()
  // !! State
  const idNotifySystem = ref<number>(0)
  const isFetchNotifyDetailLoading = ref<boolean>(false)
  const isFilterLoading = ref<boolean>(false)
  const isSubmitLoading = ref<boolean>(false)

  const notifySystem = ref<string>('Notify System')
  const pathNotify = ref<string>('/notify-page')

  const initialPayload = () => ({
    message: '',
    status: 'off',
    users: [],
    roles: [],
    pages: [],
    level: '',
  })

  const payload = ref(initialPayload())
  const pagination = ref({
    page: 1,
    size: 100,
    total: 0,
  })

  const userOptions = ref<SelectOption[]>([])

  const roleOptions = ref<SelectOption[]>([])

  const pageOptions = ref<SelectOption[]>([])

  const levelOptions = ref<SelectOption[]>([
    {
      name: 'Info',
      value: 'info',
      colorClass: 'text-blue-500',
    },

    {
      name: 'Warning',
      value: 'warning',
      colorClass: 'text-yellow-500',
    },
    {
      name: 'Error',
      value: 'error',
      colorClass: 'text-red-500',
    },
  ])

  const notifySystemList = ref<INotifySystemItem[]>([])

  const isAddPage = computed(() => idNotifySystem.value === 0)
  const titleCard = computed(() =>
    isAddPage.value ? `Add ${notifySystem.value}` : `Edit ${notifySystem.value}`
  )

  // !! Func

  const resetPayload = () => {
    payload.value = initialPayload()
  }

  const getUserOptions = async (q = '', users?: any) => {
    const params: Record<string, any> = {
      q,
      f: users?.join(','),
    }

    const response = await ctr_filter_v2.FilterPublisher(params)
    userOptions.value = response?.data || []
  }

  const getRoleOptions = async () => {
    const response = await ctr_notify_system.GetRole()
    roleOptions.value = response?.data?.roles || []
  }

  const setPageOptions = (menuRouter: menuNew[]) => {
    pageOptions.value = []

    try {
      pageOptions.value = menuRouter
        .filter((m) => m && (m.show === undefined || m.show === true))
        .flatMap((m) => {
          const current = { name: m.name ? m.name : m.title, url: m.url }

          return [current]
        })
        .filter((item) => item.url)
    } catch {}
  }

  const formatPageOptions = (params: any) => {
    const val = params.value
    if (!Array.isArray(val)) return ''

    const pages = pageOptions.value || []

    const names = val
      .map((url) => {
        const found = pages.find((p) => p.url === url)
        return found ? found.name : url
      })
      .filter(Boolean)

    return names.join(', ')
  }

  const handleSubmit = async () => {
    try {
      isSubmitLoading.value = true

      const result = idNotifySystem.value
        ? await ctr_notify_system.Edit(idNotifySystem.value, payload.value)
        : await ctr_notify_system.Add(payload.value)

      if (result?.status) {
        window.message.success(result.message)
        router.push({ path: '/notify-page' })
      }
    } finally {
      isSubmitLoading.value = false
    }
  }

  const handleFilter = async () => {
    try {
      isFilterLoading.value = true

      notifySystemList.value = []

      const { ...restPayload } = payload.value
      const result = await ctr_notify_system.Filter({
        ...restPayload,
        page: pagination.value.page,
        size: pagination.value.size,
      })

      if (result?.status) {
        notifySystemList.value = result?.data?.items || []
        pagination.value.total = result?.data?.total || 0
      }
    } finally {
      isFilterLoading.value = false
    }
  }

  const pageCount = computed(() => {
    return Math.ceil(pagination.value.total / pagination.value.size) || 1
  })

  const handlePageChange = (page: number) => {
    pagination.value.page = page
    handleFilter()
  }

  const handlePageSizeChange = (size: number) => {
    pagination.value.size = size
    pagination.value.page = 1
    handleFilter()
  }

  const fetchNotifyById = async () => {
    try {
      const id = idNotifySystem.value
      if (id === 0) return
      isFetchNotifyDetailLoading.value = true
      const result = await ctr_notify_system.GetById(id)
      if (result?.status) {
        const { message, status, users, roles, pages, level } = result.data
        payload.value = { message, status, users, roles, pages, level }

        await getUserOptions('', users)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      isFetchNotifyDetailLoading.value = false
    }
  }

  return {
    idNotifySystem,
    isFetchNotifyDetailLoading,
    isFilterLoading,
    isSubmitLoading,
    isAddPage,
    notifySystem,
    pathNotify,
    payload,
    pagination,

    userOptions,
    roleOptions,
    pageOptions,
    levelOptions,

    notifySystemList,

    titleCard,
    resetPayload,
    getUserOptions,
    getRoleOptions,
    setPageOptions,
    formatPageOptions,

    handleSubmit,

    handleFilter,
    pageCount,
    handlePageChange,
    handlePageSizeChange,

    fetchNotifyById,
  }
})
