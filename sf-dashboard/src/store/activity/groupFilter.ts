import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IActivityItem, IPayload } from '@/types/components/activity'
import { format, startOfYear } from 'date-fns'
import DateRanger from '@/components/common/DateRanger.vue'
import { SelectOption } from 'naive-ui'
import { FilterItem } from '@/types/state/template'
import { general } from '@/services/general'
import { AxiosRequestConfig } from 'axios'
import helper from '@/utils/helper'

interface FilterTypeActivity {
  options: SelectOption[]
  baseOptions?: SelectOption[] //Lưu data gốc để client filter hoạt động
  loading: boolean
  searchTimeout: ReturnType<typeof setTimeout> | null
}

export const useGroupFilterStore = defineStore('useGroupFilterStore', () => {
  // !! State
  const router = useRouter()
  const route = useRoute()

  const numRefresh = ref<number>(0)

  const dateRangerComponent = ref<InstanceType<typeof DateRanger>>()
  const isRequest = ref<boolean>(false)

  const isRequestLog = ref<boolean>(false)

  const filterSettings = ref<FilterItem[]>([])

  const filterManager = ref<Record<string, FilterTypeActivity>>({})

  const activityRawData = ref<IActivityItem[]>([])

  const payload = reactive<IPayload>({
    filter: {
      search: '',
      startDate: '',
      endDate: '',
      user: null,
      campaign: null,
      objectType: null,
    },
    page: 1,
    size: 10,
    sort: [
      {
        field: 'created_at',
        dir: 'desc',
      },
    ],
  })

  // !! Lifecycle hook

  const dateInfo = computed(() => {
    return {
      startDate: payload?.filter?.startDate || '',
      endDate: payload?.filter?.endDate || '',
    }
  })

  watch(dateInfo, (newVal, _) => {
    if (dateRangerComponent.value) {
      const dataInfo = {
        start_date: newVal.startDate.split(' ')[0],
        end_date: newVal.endDate.split(' ')[0],
      }

      dateRangerComponent.value?.updateDateValue([
        dataInfo.start_date,
        dataInfo.end_date,
      ])
    }
  })

  const defaultDate = computed(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const allTime = format(
      startOfYear(new Date(2022, 8, 2, 11, 55)),
      'yyyy-MM-dd'
    )
    return [allTime, today]
  })

  // Transform payload trước khi gửi API
  const payloadForAPI = computed(() => {
    const result = helper.clone(payload)

    // Chuyển null thành 'all' cho backend
    Object.keys(result.filter).forEach((key) => {
      if (
        (result.filter[key] === null || result.filter[key] === undefined) &&
        ['user', 'campaign', 'objectType'].includes(key)
      ) {
        result.filter[key] = 'all'
      }
    })
    return result
  })

  const parseQueryValue = (val: string | string[] | null): string => {
    if (Array.isArray(val)) return val[0] ?? ''
    if (val === null) return ''
    return val
  }

  const syncPayloadToURL = (isModal = false) => {
    if (isModal) return
    const query: Record<string, string> = {}

    Object.keys(payload.filter).forEach((key) => {
      const value = payload.filter[key]

      if (key === 'startDate' && value) {
        query[key] = value.split(' ')[0]
      } else if (key === 'endDate' && value) {
        query[key] = value.split(' ')[0]
      } else if (value && value !== null && value !== '') {
        query[key] = value
      }
    })

    router.replace({
      path: route.path,
      query,
    })
  }

  const parseURLToPayload = (): boolean => {
    let hasQuery = false

    Object.keys(payload.filter).forEach((key) => {
      const val = route.query[key]
      if (val !== undefined) {
        hasQuery = true
        let parsed = parseQueryValue(val as any)

        if (key === 'startDate' && parsed) parsed = `${parsed} 00:00:00`
        if (key === 'endDate' && parsed) parsed = `${parsed} 23:59:59`

        payload.filter[key] = parsed || null
      }
    })

    return hasQuery
  }

  const syncDateRanger = () => {
    if (dateRangerComponent.value) {
      const start = payload.filter.startDate?.split(' ')[0]
      const end = payload.filter.endDate?.split(' ')[0]

      if (start && end) {
        dateRangerComponent.value.updateDateValue([start, end])
      }
    }
  }

  const handleRefresh = () => {
    numRefresh.value += 1
  }
  const updateDatePicker = (date: string[]) => {
    if (!date || date.length != 2) {
      console.error('GroupBy->updateDate: date is not correct', date)
    }

    payload.filter.startDate = `${date[0]} 00:00:00`
    payload.filter.endDate = `${date[1]} 23:59:59`
  }

  const getOneFilter = async (
    opts: FilterItem,
    opts2: {
      first?: boolean
      q?: string
      f?: string | null
    } = {
      first: false,
      q: '',
      f: '',
    }
  ) => {
    if (!filterManager.value[opts.key]) return
    filterManager.value[opts.key].loading = true

    const f =
      opts2.f === null || opts2.f === undefined || opts2.f === ''
        ? 'all'
        : opts2.f
    const optsAjax: AxiosRequestConfig = {
      url: opts.ajax,
      method: opts.post ? 'POST' : 'GET',
      params: {
        q: opts2.q,
        f: f,
        fi: opts2.first ? '1' : undefined,
      },
    }

    const response = await general.fetchDataByOpts(optsAjax)

    const valueKey = opts?.customValue || 'value'
    const labelKey = opts?.customLabel || 'label'

    let data: any[] = []

    try {
      data = response?.data || []
    } catch (error) {
      console.error(error)
      data = []
    }

    try {
      filterManager.value[opts.key].options = data.map((item: any) => ({
        label: item[labelKey],
        value: item[valueKey],
      }))
    } catch {
      filterManager.value[opts.key].options = []
    }

    if (opts.clientFilter) {
      filterManager.value[opts.key].baseOptions = helper.clone(
        filterManager.value[opts.key].options
      )
    }

    filterManager.value[opts.key].loading = false
  }
  const fetchMissingFilterValue = async (opts: FilterItem, value: string) => {
    if (!value || value === null || value === undefined) return

    // Đợi options ban đầu load xong
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (!filterManager.value[opts.key]?.loading) {
          clearInterval(check)
          resolve(true)
        }
      }, 100)
    })

    // Check nếu giá trị đã có trong options
    const exists = filterManager.value[opts.key]?.options?.some(
      (opt: SelectOption) => String(opt.value) === String(value)
    )

    if (exists) return

    const valueKey = opts?.customValue || 'value'
    const labelKey = opts?.customLabel || 'label'

    try {
      const optsAjax: AxiosRequestConfig = {
        url: opts.ajax,
        method: opts.post ? 'POST' : 'GET',
        params: {
          f: value,
        },
      }

      const response = await general.fetchDataByOpts(optsAjax)
      const data = response?.data || []

      if (data.length > 0) {
        const newOption = {
          label: data[0][labelKey],
          value: String(data[0][valueKey]),
        }

        filterManager.value[opts.key].options = [
          newOption,
          ...filterManager.value[opts.key].options,
        ]

        if (opts.clientFilter && filterManager.value[opts.key].baseOptions) {
          filterManager.value[opts.key].baseOptions = helper.clone(
            filterManager.value[opts.key].options
          )
        }
      }
    } catch (error) {
      console.error('Error fetching missing filter value:', error)
    }
  }

  const initFilters = () => {
    filterSettings.value?.forEach((item: FilterItem) => {
      if (!payload.filter[item.key as string]) {
        payload.filter[item.key as string] = null
      }

      if (!filterManager.value[item.key]) {
        filterManager.value[item.key] = {
          options: [],
          loading: false,
          searchTimeout: null,
        }
      }

      getOneFilter(item, { first: true })
      const currentValue = payload.filter[item.key as string]
      if (currentValue && currentValue !== null) {
        fetchMissingFilterValue(item, currentValue)
      }
    })
  }

  return {
    numRefresh,
    isRequest,
    isRequestLog,
    payload,
    payloadForAPI,
    activityRawData,

    filterSettings,
    filterManager,
    dateRangerComponent,

    defaultDate,
    updateDatePicker,

    handleRefresh,
    initFilters,
    getOneFilter,

    parseURLToPayload,
    syncPayloadToURL,
    syncDateRanger,
  }
})
