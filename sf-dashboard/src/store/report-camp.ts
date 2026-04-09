import { defineStore } from 'pinia'
import { format } from 'date-fns'
import {
  reportChartType,
  sortType,
  reportPayload,
} from '@/types/state/report-camp'
import { debounceV2, replacePlk } from '@/utils'

import { reportData } from '@/types/components/reportcamp'
import { ctr_report_campaign } from '@/services/ctr_report_campaign'
import { ctr_payload_key } from '@/services/ctr_payload_key'
import { useReportV2 } from './report/report-v2'
import helper from '@/utils/helper'
import { ctr_report } from '@/services/ctr_report'
import { ReportColumn } from '@/types/state/report'
import { filterItemType } from '@/types/components/filter'
// import { mockReportCampaign } from '@/data/report_campaign'

export const useReportCamp = defineStore('reportCampState', () => {
  const reportStoreV2 = useReportV2(helper.truePath())()
  const listFilterItem = ref<any[]>([])
  const listGroupBy = ref<any[]>([])

  //state payload
  const filter = ref<any>({})
  const isFetchInit = ref(false)
  const group_by = ref<string[]>(['campaign'])
  const sort = ref<sortType>({ field: 'cost', dir: 'desc' })
  const time_interval = ref<string>('day')
  const timezone = ref<string>('UTC')
  const currency = ref<string>('USD')
  const limit = ref<number>(250)
  const page = ref<number>(1)
  const end_date = ref<string>(
    format(new Date(new Date().toUTCString().substring(0, 25)), 'yyyy-MM-dd')
  )
  const start_date = ref<string>(
    format(new Date(new Date().toUTCString().substring(0, 25)), 'yyyy-MM-dd')
  )
  const reportData = ref<reportData>({
    items: [],
    total: {},
  })
  const data = ref()
  const isFetchingReportCamp = ref<boolean>(false)
  const listColAccepted = ref<string[]>([])
  const updateClicked = ref<number>(0)
  const isGroupByChange = ref<boolean>(false)
  // const columnOptions = ref<any[]>(groupOptions);
  const reportChart = ref<reportChartType>({
    title: '',
    xAxis: [],
    series: {},
    comparison: {},
  })
  const chartColumnList = ref<any[]>([])
  const chartColSelected = ref<string[]>([
    'revenue',
    'profit_rt',
    'roi_rt',
    'epm',
  ])
  const isAutoSync = ref<boolean>(true)
  const onChangeProfile = ref<boolean>(false)
  const isFirstLoadReport = ref<boolean>(true)

  const payload = computed<reportPayload>(() => {
    return {
      end_date: end_date.value,
      start_date: start_date.value,
      limit: limit.value,
      sort: sort.value,
      time_interval: time_interval.value,
      timezone: timezone.value,
      currency: currency.value,
      filter: filter.value,
      group_by: group_by.value,
      path: 'report-campaign/load',
      page: page.value,
    }
  })

  //action
  const resetFilter = () => {
    filter.value = {}
  }
  const resetPayload = () => {
    resetFilter()
    group_by.value = ['campaignId']
    sort.value = { field: 'revenue', dir: 'desc' }
    time_interval.value = 'day'
    timezone.value = 'UTC'
    currency.value = 'USD'
    limit.value = 250
    end_date.value = format(
      new Date(new Date().toUTCString().substring(0, 25)),
      'yyyy-MM-dd'
    )
    start_date.value = format(
      new Date(new Date().toUTCString().substring(0, 25)),
      'yyyy-MM-dd'
    )
  }
  const resetReport = () => {
    reportData.value = {
      items: [],
      total: {},
    }
  }

  const fetchReport = async () => {
    isFetchingReportCamp.value = true
    const result = await ctr_report_campaign.Load(payload.value)

    if (result?.status) {
      data.value = result.data
      replacePlk(data.value.plk)
    } else {
      resetReport()
      isFetchingReportCamp.value = false
      return
    }

    reportData.value = result.data
    isFetchingReportCamp.value = false
    isGroupByChange.value = false
    isFirstLoadReport.value = false
  }

  const fetchFilterByPlk = async (plk: string) => {
    const result = await ctr_payload_key.Key({ params: { q: plk } })
    if (!result?.status) return
    if (result.data?.path !== 'report-campaign/load') return

    filter.value = result.data.filter
    group_by.value = result.data.group_by
    currency.value = result.data.currency
    start_date.value = result.data.start_date
    end_date.value = result.data.end_date
    time_interval.value = result.data.time_interval
    timezone.value = result.data.timezone
    sort.value = result.data.sort
  }
  const ReportCols = ref<ReportColumn[]>([])

  const fetchCols = async () => {
    if (!reportStoreV2.reportOptions.col) return

    const result = await ctr_report.ReportGetData(
      reportStoreV2.reportOptions.col
    )
    const rawData = result?.data?.items || []
    ReportCols.value = []

    try {
      rawData.forEach((element: any) => {
        const newCol = new ReportColumn(element)
        newCol.InitDefault()
        ReportCols.value?.push(newCol)
      })

      for (const key in rawData) {
        if (Object.prototype.hasOwnProperty.call(rawData, key)) {
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getListFilters = async (path_url: string) => {
    if (!reportStoreV2.reportOptions.filter) return

    const result = await ctr_report.ReportGetData(
      reportStoreV2.reportOptions.filter,
      {
        path_url,
      }
    )

    if (!Array.isArray(result.data.filter) || !result.data.filter.length) return

    // Khởi tạo danh sách ban đầu (set loading true)
    listFilterItem.value = result.data.filter.map((item: any) => ({
      ...item,
      label: item.name,
      primary_key: item.key,
      isMultiple: true,
      value: [],
      loading: true,
      options: [],
    }))

    // Gọi toàn bộ API song song
    const promises = listFilterItem.value.map(async (item: any) => {
      try {
        const res = await ctr_report.Ajax({
          url: item.url,
          params: { fi: '1', f: '1' },
        })
        return { key: item.key, data: res.data ?? [] }
      } catch (e) {
        console.error(`Error loading ${item.key}`, e)
        return { key: item.key, data: [] }
      }
    })

    const results = await Promise.all(promises)

    // Gán kết quả vào từng item tương ứng
    listFilterItem.value = listFilterItem.value.map((item: any) => {
      const found = results.find((r) => r.key === item.key)
      return {
        ...item,
        loading: false,
        options:
          found?.data?.map((opt: any) => ({
            label: opt.name ?? opt.label ?? '',
            value: opt.id ?? opt.value ?? null,
          })) || [],
      }
    })
  }
  const initData = async (path_url: string) => {
    isFetchInit.value = true
    await reportStoreV2.fetchOpts({
      path_url: helper.truePath(),
    })

    await Promise.all([fetchCols(), getListFilters(path_url)])
    listGroupBy.value = ReportCols.value.filter((item) => item.group)
    await helper.sleep(10)
    isFetchInit.value = false
    updateClicked.value = Date.now()
  }

  const searchValueFilter = debounceV2(
    async (query: string, filterItem: filterItemType) => {
      const item = listFilterItem.value.find(
        (it) => it.primary_key === filterItem.primary_key
      )
      if (!item) return

      item.loading = true

      const saveValue = Array.isArray(filter.value[filterItem.primary_key])
        ? filter.value[filterItem.primary_key]?.join(',')
        : filter.value[filterItem.primary_key]

      try {
        const response = await ctr_report.ReportGetDataV2(filterItem.url, {
          q: query,
          fi: '1',
          f: saveValue ?? undefined,
        })

        if (response.data) {
          item.options =
            response.data?.map((opt: any) => ({
              label: opt.name ?? opt.label ?? '',
              value: opt.id ?? opt.value ?? null,
            })) || []
        }
      } catch (err) {
        console.error('Lỗi search', err)
      } finally {
        item.loading = false
      }
    },
    500
  )

  return {
    filter,
    group_by,
    sort,
    reportData,
    listColAccepted,
    payload,
    isFetchingReportCamp,
    updateClicked,
    isGroupByChange,
    time_interval,
    timezone,
    reportChart,
    chartColumnList,
    chartColSelected,
    isAutoSync,
    onChangeProfile,
    start_date,
    end_date,
    limit,
    page,
    ReportCols,
    isFetchInit,
    listFilterItem,
    listGroupBy,

    resetFilter,
    fetchReport,
    resetReport,
    resetPayload,
    fetchFilterByPlk,
    initData,
    searchValueFilter,
  }
})
