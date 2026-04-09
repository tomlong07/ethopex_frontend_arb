import { DATE_RANGE } from '@/enum/report-v2'
import { ctr_report } from '@/services/ctr_report'
import { ReportQueryCls } from '@/types/components/report-top-list'
import { FilterOpts, ReportColumn } from '@/types/state/report'
import date2 from '@/utils/date2'
import helper from '@/utils/helper'
import { defineStore } from 'pinia'

export default defineStore('useReportTopList', () => {
  // !! State
  const isFetchingReport = ref<boolean>(false)
  const isGroupBy = ref<boolean>(true)
  const isFetchingCol = ref(false)
  const dataReport = ref<
    { col: any; items: any[]; isRender: boolean; isLoading: boolean }[]
  >([])
  const ReportCols = ref<ReportColumn[]>([])
  const reportConditions = ref<ReportQueryCls>(new ReportQueryCls())
  const metricReportCols = ref<any[]>([])
  const showCard = ref({
    metric: false,
    dimension: true,
  })

  const pagination = ref({
    page: 1,
    size: 50,
  })

  // !! Lifecycle hook

  const dateDefaultValue = ref<any[]>([])

  const defaultDateRange = computed(() => window.route.query.dateRange)
  const updateDateRange = (value: DATE_RANGE) => {
    reportConditions.value.dateRange = value
    setTimeout(() => {
      buildQuery()
    }, 1000)
  }

  const updateTimezone = (tz: string) => {
    reportConditions.value.timezone = tz
    buildQuery()
  }

  const resetTzDefault = () => {
    reportConditions.value.timezone = 'UTC'
  }

  const fetchTopMetric = async () => {
    const result = await ctr_report.GetTopMetric()
    metricReportCols.value = result.data?.items || []
  }

  const fetchCols = async () => {
    isFetchingCol.value = true
    await fetchTopMetric()
    const result = await ctr_report.FetchCols()
    const rawData = result.data?.items || []

    rawData.forEach((element: any) => {
      const newCol = new ReportColumn(element)
      newCol.InitDefault()
      ReportCols.value?.push(newCol)
    })
    for (const key in rawData) {
      if (Object.prototype.hasOwnProperty.call(rawData, key)) {
      }
    }
    isFetchingCol.value = false
  }

  const GroupByReport = computed<ReportColumn[]>(() => {
    return ReportCols.value.filter((col) => col.group)
  })

  let controller: AbortController | null = null
  const onUpdateReport = async () => {
    const conditions = JSON.parse(JSON.stringify(reportConditions.value))

    if (isFetchingReport.value && controller) {
      controller.abort()
    }

    controller = new AbortController()
    isFetchingReport.value = true

    try {
      if (!conditions.cols || conditions.cols.length === 0) return
      dataReport.value = dataReport.value?.filter((item) =>
        conditions.cols?.includes(item.col)
      )
      for (const col of conditions.cols) {
        let index = dataReport.value.findIndex((item) => item.col === col)
        if (index === -1) {
          dataReport.value.push({
            col,
            items: [],
            isRender: false,
            isLoading: true,
          })
          index = dataReport.value.length - 1
        } else {
          dataReport.value[index].isLoading = true
        }

        try {
          const result = await ctr_report.Report(
            {
              ...conditions,
              page: 1,
              cols: [col],
              sort: [{ dir: 'desc', field: col }],
            },
            controller.signal
          )

          if (result?.status) {
            dataReport.value[index] = {
              col,
              items: result.data.items || [],
              isRender: false,
              isLoading: false,
            }
          }
        } catch (err: any) {
          if (err.name === 'CanceledError' || err.name === 'AbortError') {
            break
          } else {
            dataReport.value[index].isLoading = false
          }
        }
      }
    } finally {
      isFetchingReport.value = false
    }
  }

  function parseToArray<T extends 'string' | 'number'>(
    input: string | string[] | null | undefined,
    type: T
  ): T extends 'string' ? string[] : number[] {
    if (!input) {
      return [] as any
    }

    if (Array.isArray(input)) {
      return input as any
    }

    const parts = input.split(',')

    if (type === 'number') {
      return parts.map(Number) as any
    }

    return parts as any
  }

  const buildQuery = () => {
    const params = new URLSearchParams(window.location.search)
    const value = reportConditions.value
    // filter
    if (value.filter?.start_date)
      params.append('start_date', value.filter.start_date)
    if (value.filter?.end_date) params.append('end_date', value.filter.end_date)

    // group_by
    if (value.group_by && value.group_by.length > 0)
      params.append('group_by', value.group_by?.join(','))

    // size
    if (value.size) params.append('size', String(value.size))

    // time_interval
    if (value.time_interval) params.append('time_interval', value.time_interval)

    // timezone
    if (value.timezone) params.append('timezone', value.timezone)

    // dateRange
    if (value.dateRange) params.append('dateRange', value.dateRange)

    // cols
    if (value.cols && value.cols.length > 0)
      params.append('cols', value.cols?.join(','))

    window.router.replace({
      query: Object.fromEntries(params.entries()),
    })
  }

  const buildQueryReportFilter = (value: any, item: FilterOpts) => {
    const params = new URLSearchParams(window.location.search)

    if (Array.isArray(value) && value?.length > 0) {
      params.append(item.key, value?.join(','))
    } else if (value) {
      params.append(item.key, value)
    } else {
      params.delete(item.key)
    }
    reportConditions.value.filter = {
      ...reportConditions.value.filter,
      [item.key]: value,
    } as any

    window.router.replace({
      query: Object.fromEntries(params.entries()),
    })
  }

  const parseQueryToParams = () => {
    const query = window.route.query
    const parser = {
      filter: {
        start_date: (query.start_date as string) || '',
        end_date: (query.end_date as string) || '',
        campaigns: parseToArray(query.campaigns as string, 'number'),
        publisher: parseToArray(query.publisher as string, 'number'),
        section_id: parseToArray(query.section_id as string, 'string'),
        status: parseToArray(query.status as string, 'string'),
        traffic_source: parseToArray(query.traffic_source as string, 'string'),
        demand_source: parseToArray(query.demand_source as string, 'string'),
        manager: parseToArray(query.manager as string, 'number'),
        account_demand_id: parseToArray(
          query.account_demand_id as string,
          'number'
        ),
        landing_page_id: parseToArray(
          query.landing_page_id as string,
          'number'
        ),
        geo: parseToArray(query.geo as string, 'string'),
        account_supply_id: parseToArray(
          query.account_supply_id as string,
          'number'
        ),
        ad_account: parseToArray(query.ad_account as string, 'string'),
        keyword_set_id: parseToArray(query.keyword_set_id as string, 'number'),
        label: parseToArray(query.label as string, 'number'),
        layout_id: parseToArray(query.layout_id as string, 'number'),
        domain: parseToArray(query.domain as string, 'string'),
        created_by: (query.created_by as string) || null,
        account_cp: (query.account_cp as string) || null,
        pixel: parseToArray(query.pixel as string, 'number'),
        promotion_status: parseToArray(
          query.promotion_status as string,
          'string'
        ),
        bidding: parseToArray(query.bidding as string, 'string'),
      } as any,
      group_by: Array.isArray(query.group_by)
        ? query.group_by
        : query.group_by
        ? (query.group_by as string).split(',')
        : [],
      size: query.size ? Number(query.size) : 50,
      time_interval: (query.time_interval as string) || '',
      timezone: (query.timezone as string) || '',
      dateRange: (query.dateRange as string) || '',
      cols: Array.isArray(query.cols)
        ? query.cols
        : query.cols
        ? (query.cols as string).split(',')
        : [],
    } as any

    reportConditions.value = new ReportQueryCls(parser)
  }

  const setQueryDefault = async () => {
    const query = window.route.query

    if (!query || Object.keys(query).length === 0) {
      reportConditions.value?.SetDefaultQuery()
      buildQuery()
    } else {
      if (defaultDateRange.value) {
        await nextTick()
      }
      parseQueryToParams()
    }
    const { start_date, end_date } = reportConditions.value.filter as {
      start_date?: string
      end_date?: string
    }

    if (start_date && end_date) {
      dateDefaultValue.value = [start_date || '', end_date || '']
    } else {
      dateDefaultValue.value = [date2.today(), date2.today()]
    }
  }

  const initData = async () => {
    await fetchCols()
    dataReport.value = []
    reportConditions.value = new ReportQueryCls()
    await setQueryDefault()
    await onUpdateReport()
  }

  const updateDate = (date: string[]) => {
    if (!reportConditions.value?.filter) return
    reportConditions.value.filter.start_date = date[0]
    reportConditions.value.filter.end_date = date[1]

    buildQuery()
  }

  const getTitleDimension = computed(() => {
    const map: Record<string, string> = {}
    GroupByReport.value?.forEach((item: any) => {
      map[item.key] = item.title
    })
    return map
  })

  const makeNameChart = (data: any) => {
    if (!reportConditions.value?.group_by?.length) return ''

    return reportConditions.value.group_by
      .map((item) => {
        const title = `<strong>${
          getTitleDimension.value[item] || item
        }</strong>`
        switch (item) {
          case 'campaign':
            return `${title}: ${data?.campaign_name?.name || ''}`
          case 'publisher':
            return `${title}: ${data?.publisher?.email || ''}`
          case 'section':
            return `${title}: ${data?.section?.name || ''}`
          case 'landing_page_id':
            return `${title}: ${data?.landing_page?.name || ''}`
          case 'ad_id':
            return `${title}: ${data?.ad_id?.name || ''}`
          case 'account_demand_id':
            return `${title}: ${data?.account_demand?.name || ''}`
          default:
            return `${title}: ${data?.[item] ?? ''}`
        }
      })
      .filter(Boolean)
      .join('<br>')
  }

  const getTypeMetric = computed(() => {
    const map: Record<string, { title: string; type: string }> = {}

    metricReportCols.value?.forEach((item: any) => {
      map[item.key] = {
        title: item.title,
        type: item.type,
      }
    })

    return map
  })

  const makeValueAxistY = (value: any, field: string) => {
    const typeMetrict = getTypeMetric.value[field]?.type
    const titleMetrict = getTypeMetric.value[field]?.title
    let valueY
    if (typeMetrict !== 'money') {
      valueY = helper.formatData(value, typeMetrict)
    } else if (typeMetrict === 'money') {
      valueY = helper.currencyFormatterAuto3(value)
    } else {
      valueY = value
    }

    return `<strong>${titleMetrict}:</strong> ${valueY ?? 0}`
  }

  const makeDataChart = (data: any[], field: any) => {
    if (!data?.length) return []

    const showCount = Math.ceil((data.length * 2) / 3)

    const mainItems: any = data.slice(0, showCount)
    const otherItems = data.slice(showCount)

    if (otherItems.length) {
      const otherValue = otherItems.reduce(
        (sum, item) => sum + (Number(item[field]) || 0),
        0
      )
      mainItems.push({ name: 'Other', [field]: otherValue })
    }

    const colors = [
      '#7cb5ec',
      '#434348',
      '#90ed7d',
      '#f7a35c',
      '#8085e9',
      '#f15c80',
      '#e4d354',
      '#2b908f',
      '#f45b5b',
      '#91e8e1',
    ]
    return mainItems.map((item: any, index: number) => ({
      name: item.name !== 'Other' ? makeNameChart(item) : 'Other',
      y: Number(item[field]) || 0,
      color: item.name === 'Other' ? '#cccccc' : colors[index % colors.length],
    }))
  }

  return {
    isFetchingReport,
    isGroupBy,
    pagination,
    dataReport,
    reportConditions,
    GroupByReport,
    metricReportCols,
    showCard,
    dateDefaultValue,
    isFetchingCol,
    defaultDateRange,
    updateDate,
    updateDateRange,
    initData,
    fetchCols,
    updateTimezone,
    resetTzDefault,
    onUpdateReport,
    makeDataChart,
    makeValueAxistY,
    buildQuery,
    buildQueryReportFilter,
  }
})
