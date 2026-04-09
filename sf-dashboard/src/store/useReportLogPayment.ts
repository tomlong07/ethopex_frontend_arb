import { ctr_filter } from '@/services/ctr_filter'
import { ctr_report_log_payment } from '@/services/ctr_report_log_payment'

import { ReportLogPaymentRequest } from '@/types/components/report-log-payment'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import date2 from '@/utils/date2'
import { DATE_RANGE } from '@/enum/report-v2'
import { ctr_user } from '@/services/ctr_user'

export default defineStore('useReportLogPayment', () => {
  // !! State
  const isFetchingReport = ref<boolean>(false)
  const isPublisherLoading = ref<boolean>(false)
  const isAccountManagerLoading = ref<boolean>(false)
  const range = date2.last3Months()
  const getDefaultPayload = (): ReportLogPaymentRequest => ({
    filter: {
      start_date: range.start,
      end_date: range.end,
      type: [],
      user_id: [],
      account_manager: [],
    },
    page: 1,
    size: 10,
  })
  const dateRange = ref<DATE_RANGE>(DATE_RANGE.LAST_3_MONTHS)

  const total = ref<number>(0)
  const pageCount = ref<number>(0)
  const payload = ref<ReportLogPaymentRequest>(getDefaultPayload())

  const typeSelectOptions: SelectOption[] = [
    { label: 'Earnings', value: 'earnings' },
    { label: 'Payments', value: 'payments' },
    { label: 'Adjustments', value: 'adjustments' },
    { label: 'Taxes', value: 'taxes' },
  ]
  const publisherOptions = ref<SelectOption[]>([])
  const accountManagerOptions = ref<SelectOption[]>([])
  const dataReport = ref<any | null>(null)

  // !! Func
  const updateDate = (date: string[]) => {
    payload.value.filter.start_date = date[0]
    payload.value.filter.end_date = date[1]
  }

  const updateDateRange = (value: DATE_RANGE) => {
    dateRange.value = value
  }
  const clearFilter = () => {
    payload.value = getDefaultPayload()
  }

  const getListPublisher = async (q = '') => {
    isPublisherLoading.value = true
    const response = await ctr_filter.FilterPublisher({
      params: { q: q },
    })
    const temp = [] as SelectOption[]
    response?.data?.forEach((publisher: any) => {
      temp.push({
        label: publisher.email,
        value: publisher.id,
      })
    })
    publisherOptions.value = temp
    isPublisherLoading.value = false
  }

  const fetchAccountManager = async () => {
    isAccountManagerLoading.value = true
    try {
      const result = await ctr_user.GetAllAgency()
      accountManagerOptions.value =
        result?.data?.agencies?.map((item: any) => ({
          label: item.email,
          value: item.id,
        })) || []
    } finally {
      isAccountManagerLoading.value = false
    }
  }

  const onSearchPublisher = debounceV2(async (q: string = '') => {
    getListPublisher(q)
  }, 300)

  const onUpdateReport = async () => {
    try {
      isFetchingReport.value = true

      const result = await ctr_report_log_payment.GetReportLogPayment(
        payload.value
      )
      if (result?.status) {
        dataReport.value = result.data || []
        total.value = result.data?.total || 0

        pageCount.value = Math.ceil(total.value / payload.value.size)
      }
    } finally {
      isFetchingReport.value = false
    }
  }

  const handlePageChange = (page: number) => {
    payload.value.page = page
    onUpdateReport()
  }

  const handlePageSizeChange = (size: number) => {
    payload.value.size = size
    payload.value.page = 1
    onUpdateReport()
  }

  return {
    isFetchingReport,
    isPublisherLoading,
    isAccountManagerLoading,
    payload,
    typeSelectOptions,
    publisherOptions,
    accountManagerOptions,
    dataReport,
    pageCount,
    dateRange,
    updateDate,
    updateDateRange,

    clearFilter,
    fetchAccountManager,
    onSearchPublisher,
    onUpdateReport,
    handlePageChange,
    handlePageSizeChange,
  }
})
