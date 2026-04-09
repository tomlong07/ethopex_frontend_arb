import { defineStore } from 'pinia'
import {
  ChartSeries,
  PayloadReportError,
  ProcessedChartData,
  ReportErrParams,
  ReportErrSettings,
  SelectFilter,
  TransformedDataItem,
  TransformedDataSrc,
} from '@/types/components/report-error'
import { ctr_report_error } from '@/services/ctr_report_error'
import Chart from '@/utils/chartErrorReport'
import { ByDimensionSettings, InfoData } from '@/types/components/types'
import { SelectOption } from 'naive-ui'
import { ctr_by_dimension } from '@/services/ctr_by_dimension'

export const useReportError = defineStore('reportErrorStore', () => {
  const isFetchingTableUpdate = ref<boolean>(false)

  const isLoadingChart = ref<boolean>(false)
  const updateClicked = ref<number>(0)
  const chartId = ref(`error-chart-${Math.random().toString(36).substr(2, 9)}`)

  const chartData = ref<TransformedDataItem[]>([])

  const loadingTables = ref<string[]>([])
  const tableDataCache = reactive<Record<string, any[]>>({})

  const showSettingModal = ref<boolean>(false)
  const reportSettingErr = ref<ReportErrSettings>(new ReportErrSettings())
  const reportParams = ref<ReportErrParams>(new ReportErrParams())
  const isTableView = computed(() => reportSettingErr.value.isDisplayTable())
  const isChartView = computed(() => reportSettingErr.value.isDisplayChart())
  const isBothView = computed(() => reportSettingErr.value.isDisplayBoth())

  const dropCustomTimeOut = ref<Array<ReturnType<typeof setTimeout> | null>>([])

  const settings = ref<ByDimensionSettings>({})

  const selectDropTitle = ref<{ [key: string]: string }>({})
  const selectOptions = ref<{ [key: string]: SelectOption[] }>({})
  const dimensionValue = ref<string[]>([])
  const dimensionValueTemp = ref<string[]>([])

  const filter = ref<SelectFilter>({
    campaigns: [],
    geo: [],
    traffic_source: [],
    demand_source: [],
    user_id: [],
    section: [],
    device: [],
  })

  // const source = ref<filterObjectError>({
  //   geo: [],
  //   device: [],
  //   traffic_source: [],
  //   demand_source: [],
  //   user_id: [],
  //   section: [],
  // })

  const targetDemensionOptions = computed(() => [
    { value: 'landing_page', label: 'Landing Page' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'domain', label: 'Domain' },
    { value: 'category', label: 'Category' },
    { value: 'country', label: 'Country' },
    { value: 'traffic_source', label: 'Traffic Source' },
  ])

  // Chart data format
  const chartColumns = [
    {
      key: 'total_error_count',
      title: 'Total Errors',
      type: 'number',
      display_format: { precision: 0 },
    },
    {
      key: 'error_page_1',
      title: 'Error 1',
      type: 'number',
      display_format: { precision: 0 },
    },
    {
      key: 'error_page_2',
      title: 'Error 2',
      type: 'number',
      display_format: { precision: 0 },
    },
    {
      key: 'rate_error_page_1',
      title: 'Rate error page 1',
      type: 'number',
      display_format: { precision: 0 },
    },
    {
      key: 'rate_error_page_2',
      title: 'Rate error page 2',
      type: 'number',
      display_format: { precision: 0 },
    },
  ]

  const transformedDataSrc = computed<TransformedDataSrc>(() => {
    if (!chartData.value || chartData.value.length === 0) {
      return { items: [] }
    }

    return {
      items: chartData.value.map((item: any) => ({
        time: item.time,
        total_error_count: item.total_error_count || 0,
        error_page_1: item.error_page_1 || 0,
        error_page_2: item.error_page_2 || 0,
        rate_error_page_1: item.rate_error_page_1 || 0,
        rate_error_page_2: item.rate_error_page_2 || 0,
      })),
    }
  })

  // Process data using Chart.processDataChart
  const processedChartData = computed<ProcessedChartData>(() => {
    if (!transformedDataSrc.value.items.length) {
      return {
        xAxis: [],
        series: {} as ChartSeries,
      }
    }

    const result = Chart.processDataChart(transformedDataSrc.value)
    return result as ProcessedChartData
  })

  const createReportErrorPayload = (
    targetDimension: string = ''
  ): PayloadReportError => {
    return {
      startDate: reportParams.value.startDate,
      endDate: reportParams.value.endDate,
      timeZone: reportParams.value.timeZone,
      selects: reportParams.value.selectDropList,
      orderBy: reportParams.value.orderBy,
      top: reportParams.value.topValue,
      ...(targetDimension ? {} : { interval: reportParams.value.interval }),
      ...(targetDimension ? { target_dimension: targetDimension } : {}),
    } as PayloadReportError
  }

  const fetcheTableData = async (targetDimension: string): Promise<void> => {
    if (loadingTables.value.includes(targetDimension)) return

    loadingTables.value.push(targetDimension)
    try {
      const payload = createReportErrorPayload(targetDimension)
      const response = await ctr_report_error.LoadTable(payload)
      // const response = ReportError

      tableDataCache[targetDimension] = response.data || []
    } catch (error) {
      console.error(`Error fetching ${targetDimension}:`, error)
      tableDataCache[targetDimension] = []
    } finally {
      loadingTables.value = loadingTables.value.filter(
        (id) => id !== targetDimension
      )
    }
  }

  const fetchReportErrChart = async () => {
    if (isLoadingChart.value) return

    isLoadingChart.value = true

    try {
      const payload = createReportErrorPayload()
      const response = await ctr_report_error.LoadChart(payload)
      chartData.value = response.data || []
      // chartData.value = reportChartErr.data || []
    } catch (error) {
      console.error('Error fetching chart data:', error)
      chartData.value = []
    } finally {
      isLoadingChart.value = false
      await renderChart()
    }
  }

  const renderChart = async () => {
    if (!chartData.value || chartData.value.length === 0) {
      return
    }

    await nextTick()

    try {
      // Process column format
      Chart.processColFormatChart(chartColumns)

      await Chart.renderErrorChart({
        id: chartId.value,
        title: 'Error Trends Over Time',
        xAxis: processedChartData.value.xAxis,
        series: processedChartData.value.series,
        height: 400,
      })
    } catch (error) {
      console.error('Error rendering chart:', error)
    }
  }

  const destroyChart = () => {
    try {
      Chart.destroyChart(chartId.value)
    } catch (error) {
      console.error('Error destroying chart:', error)
    }
  }

  const selectList = computed<string[]>(() => {
    return settings.value.settingSelect?.selects || []
  })
  const ajaxObject = computed(() => {
    let objectTemp: { [key: string]: InfoData } = {}

    selectList.value.forEach((element) => {
      for (let index = 0; index < infoData.value.length; index++) {
        const e = infoData.value[index]
        if (e.id == element) {
          objectTemp[element] = e
        }
      }
    })

    return objectTemp
  })

  const objectSettings = computed(() => {
    const objectTemp: { [key: string]: InfoData } = {}

    for (let index = 0; index < infoData.value.length; index++) {
      objectTemp[infoData.value[index].id] = infoData.value[index]
    }

    return objectTemp
  })

  const infoData = computed(() => {
    return settings.value.info || []
  })

  const dimensionForShow = computed<string>(() => {
    if (!dimensionValue.value || !dimensionValue.value.length) {
      return ''
    }

    return dimensionValue.value[0]
  })
  const valueById = (id: string, prop: string) => {
    for (let index = 0; index < infoData.value.length; index++) {
      if (infoData.value[index].id == id) {
        return infoData.value[index][prop as keyof InfoData]
      }
    }

    return null
  }

  const changeSelectDropListByKey = (key: string, data: any) => {
    reportParams.value.selectDropList[key] = data
    pushParamsIntoState()
  }

  const changeOptionsByKey = (key: string, data: any) => {
    selectOptions.value[key] = data || []
  }

  const changeDate = (v1: string, v2: string) => {
    reportParams.value.startDate = v1
    reportParams.value.endDate = v2
    pushParamsIntoState()
  }
  const changeInterval = (value: string) => {
    reportParams.value.interval = value
    pushParamsIntoState()
  }
  const changeTimezone = (value: string) => {
    reportParams.value.timeZone = value
    pushParamsIntoState()
  }
  const changeTop = (value: number) => {
    reportParams.value.topValue = value
    pushParamsIntoState()
  }
  const changeOrderBy = (value: string) => {
    reportParams.value.orderBy = value
    pushParamsIntoState()
  }
  const changeTableDimension = (value: string[]) => {
    reportParams.value.defaultDemension = value
    pushParamsIntoState()
  }
  const changeSettings = (value: ByDimensionSettings) => {
    settings.value = value
    if (!settings.value) {
      return
    }
    const currentSelectDropList = { ...reportParams.value.selectDropList }
    //Validate dimensions
    if (dimensionValue.value.length) {
      dimensionValue.value = dimensionValue.value.filter(function (item) {
        return settings.value.settingSelect?.dimensions?.includes(item)
      })
    }

    selectList.value.forEach((element) => {
      if (element == dimensionForShow.value && ajaxObject.value[element].top) {
        selectDropTitle.value[element] = `Top ${ajaxObject.value[element].top}`
      } else {
        selectDropTitle.value[element] = 'All'
      }
      if (ajaxObject.value[element].multiple) {
        // Giữ giá trị cũ nếu có, nếu không thì gán array rỗng
        if (
          currentSelectDropList[element] &&
          currentSelectDropList[element] !== 'All'
        ) {
          reportParams.value.selectDropList[element] =
            currentSelectDropList[element]
        } else if (!Array.isArray(reportParams.value.selectDropList[element])) {
          reportParams.value.selectDropList[element] = []
        }
      }
    })
  }
  const isSettingsLoaded = ref<boolean>(false)
  // Load settings từ API
  const loadSettings = async () => {
    try {
      const result = await ctr_by_dimension.GetSetting()
      if (result?.status) {
        changeSettings(result.data as ByDimensionSettings)
      }

      isSettingsLoaded.value = true
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
  const pushParamsIntoState = () => {
    const params = new URLSearchParams()

    if (reportParams.value.startDate)
      params.append('start_date', reportParams.value.startDate)
    if (reportParams.value.endDate)
      params.append('end_date', reportParams.value.endDate)
    if (reportParams.value.interval)
      params.append('interval', reportParams.value.interval)
    if (reportParams.value.timeZone)
      params.append('timezone', reportParams.value.timeZone)
    if (reportParams.value.orderBy)
      params.append('order_by', reportParams.value.orderBy)
    if (reportParams.value.topValue)
      params.append('top', String(reportParams.value.topValue))

    if (
      reportParams.value.defaultDemension &&
      reportParams.value.defaultDemension.length > 0
    )
      params.append('table', reportParams.value.defaultDemension.join(','))

    if (reportParams.value.selectDropList) {
      Object.keys(reportParams.value.selectDropList).forEach((key) => {
        const value = reportParams.value.selectDropList[key]
        params.append(key, value)
      })
    }

    // Update URL
    window.router.replace({
      query: Object.fromEntries(params.entries()),
    })
  }
  const parseQueryToParams = () => {
    const query = window.route.query
    const selectDropListTypes: Record<string, 'string' | 'number'> = {
      campaign: 'number',
      geo: 'string',
      traffic_source: 'string',
      demand_source: 'string',
      user_id: 'number',
      section: 'string',
      device: 'string',
    }

    const parseArray = (value: any, type: 'string' | 'number') => {
      const arr = Array.isArray(value)
        ? value
        : (value as string)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)

      return type === 'number'
        ? arr.map((v: any) => Number(v)).filter((n: any) => !isNaN(n))
        : arr
    }
    const parser = {
      startDate: (query.start_date as string) || '',
      endDate: (query.end_date as string) || '',
      interval: (query.interval as string) || 'day',
      timeZone: (query.timezone as string) || 'UTC',
      orderBy: (query.order_by as string) || 'revenue',
      topValue: query.top ? Number(query.top) : 10,
      defaultDemension: Array.isArray(query.table)
        ? query.table
        : query.table
        ? (query.table as string)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [
            'landing_page',
            'campaign',
            'domain',
            'category',
            'country',
            'traffic_source',
          ],
      selectDropList: Object.fromEntries(
        Object.entries(selectDropListTypes).map(([key, type]) => [
          key,
          parseArray(query[key], type),
        ])
      ),
    }
    reportParams.value = new ReportErrParams(parser)
  }
  const setQueryDefault = () => {
    const query = window.route.query

    if (!query || Object.keys(query).length === 0) {
      reportParams.value = new ReportErrParams()
      reportParams.value.setDefaultParams()

      pushParamsIntoState()
    } else {
      parseQueryToParams()
    }
  }
  const initData = () => {
    loadSettings()
    setQueryDefault()
  }
  return {
    // Filters and data
    reportParams,
    settings,
    infoData,

    filter,

    reportSettingErr,
    isTableView,
    isChartView,
    isBothView,
    selectDropTitle,
    // selectDropList,
    selectOptions,
    selectList,
    ajaxObject,
    objectSettings,
    dimensionValue,
    dimensionValueTemp,
    dropCustomTimeOut,
    // Loading states
    isFetchingTableUpdate,
    isLoadingChart,
    loadingTables,
    showSettingModal,
    isSettingsLoaded,
    // Chart specific
    chartId,
    chartData,
    processedChartData,
    updateClicked,

    // Table data
    tableDataCache,
    targetDemensionOptions,

    // Methods
    fetchReportErrChart,
    renderChart,
    destroyChart,
    fetcheTableData,
    // fetchFiltersErr,
    valueById,
    changeSettings,
    changeSelectDropListByKey,
    changeOptionsByKey,
    changeTop,
    changeOrderBy,
    changeDate,
    changeInterval,
    changeTimezone,
    changeTableDimension,
    initData,
  }
})
