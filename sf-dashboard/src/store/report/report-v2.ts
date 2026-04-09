import { defineStore } from 'pinia'
import { SelectOption } from 'naive-ui'
import { format } from 'date-fns'
import {
  filterType,
  reportChartType,
  sortType,
  ReportPermission,
  ReportColumn,
  ReportOpts,
  ReportFilterOpts,
  ReportFilterStateManager,
  DataLoadChart,
} from '@/types/state/report'
import {
  reportDataV2,
  reportPayload,
  reportProfile,
} from '@/types/components/report'

import Chart from '@/utils/chart2'
import date2 from '@/utils/date2'
import { ReportV2 } from '@/constants/report-v2'
import { PermissionManager } from '@/types/components/base'
import { GetDateByRange, reportSettingsV2 } from '@/types/state/report-v2'
import { CHART_TYPE, DATE_RANGE, POSITION } from '@/enum/report-v2'
import { TS } from '@/enum/campaign'
import { ctr_report } from '@/services/ctr_report'
import { ctr_payload_key } from '@/services/ctr_payload_key'
import { FeSettings } from '@/class/fe_settings'
import { CHART_REPORT_STORAGE, CHART_STORAGE_KEY } from '@/constants/storage'
import { MAX_ADD_CHART } from '@/constants/limits'
import { ctr_campaign } from '@/services/ctr_campaign'

export interface ChartItemV2 {
  reportChart: reportChartType
  colSelected: {
    column: string[]
    spline: string[]
  }
  loading: boolean
  series?: object
}

class YAxisGroup {
  position: POSITION = POSITION.RIGHT
  label?: string = ''
  color?: string = ''

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof this] = element
        }
      }
    }
  }
}

export class ReportChartStruct {
  chart: Record<string, ReportColumn> = {}
  yAxisGroup: Record<string, YAxisGroup> = {}
  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          switch (key) {
            case 'chart':
              this.chart = {}
              for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                  this.chart[key] = new ReportColumn(element[key])
                }
              }
              break

            case 'yAxisGroup':
              this.yAxisGroup = {}
              for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                  this.yAxisGroup[key] = new YAxisGroup(element[key])
                }
              }
              break
            default:
              this[key as keyof this] = element
              break
          }
        }
      }

      if (!this.chart) {
        this.chart = {}
      }

      if (!this.yAxisGroup) {
        this.yAxisGroup = {}
      }
    }
  }
}

export const useReportV2 = (path: string) =>
  defineStore(`useReportV2${path}`, () => {
    localStorage.removeItem(CHART_REPORT_STORAGE) //Xóa storage cũ, sau bỏ đi vì đã xóa hết storage cũ
    const originalTitle = document.title
    const isReady = ref<boolean>(false)
    const selectedRowsMap = new Map()
    const DEFAULT_CHART_METRICS: { column: string[]; spline: string[] } =
      path === '/'
        ? {
            column: ['revenue', 'profit_rt'],
            spline: ['roi_rt', 'epm'],
          }
        : {
            column: ['ctr2', 'gclick3_ctr'],
            spline: ['rpm', 'roi'],
          }

    const keyStoreChart = CHART_REPORT_STORAGE + path
    const oldChartMetrics = ref<{ column: string[]; spline: string[] } | null>(
      null
    )
    try {
      oldChartMetrics.value = localStorage.getItem(keyStoreChart)
        ? JSON.parse(localStorage.getItem(keyStoreChart) as string)
        : null
    } catch (error) {
      console.error(error)
    }
    //state payload
    const filter = ref<filterType>({
      campaigns: [],
      demand_source: [],
      start_date: date2.today(),
      end_date: date2.today(),
      publisher: [],
      section_id: [],
      status: [],
      traffic_source: [],
      manager: [],
      account_demand_id: [],
      landing_page_id: [],
      geo: [],
      account_supply_id: [],
      ad_account: [],
      keyword_set_id: [],
      label: [],
      layout_id: [],
      domain: [],
      created_by: null,
      account_cp: null,
      pixel: [],
    })

    const dateRange = ref<DATE_RANGE | null>(DATE_RANGE.TODAY)
    const group_by = ref<string[]>(['campaign'])
    const page = ref<number>(1)
    const search = ref<string>('')
    const size = ref<number>(100)
    const width = ref<number>(100)
    const sort = ref<sortType[]>([{ field: 'net_revenue', dir: 'desc' }])
    const orderBy = ref<string | null>(null)
    const time_interval = ref<string>('day')
    const timezone = ref<string>('UTC')
    const showModalSettings = ref<boolean>(false)

    const showReportBulkAction = ref<boolean>(
      localStorage.getItem('showReportBulkAction') === 'true'
    )

    const changeTimezone = ref(0)

    const isReload = ref<boolean>(false)
    const isReloadChart = ref<boolean>(false)
    const isReloadTable = ref<boolean>(false)

    const searchType = ref<string>('campaign')
    const searchTypeOptions = ref<SelectOption[]>([])

    const reportChartDataV2 = ref<any>()
    const reportChartDataV2Convert = ref<any>()

    const profileOptions = ref<reportProfile[]>([])

    const permission = ref<PermissionManager | null>(null)

    const mapCampaignInfo = ref<{ [key: string]: any }>({})

    const reportSettingsNew = ref<reportSettingsV2>(new reportSettingsV2())

    const reportFilterOpts = ref<ReportFilterOpts>(new ReportFilterOpts({}))
    const reportFilterState = ref<ReportFilterStateManager>(
      new ReportFilterStateManager()
    )

    const reportPermission = ref<ReportPermission>(new ReportPermission({}))
    const ReportCols = ref<ReportColumn[]>([])
    const reportOptions = ref<ReportOpts>(new ReportOpts())

    const ReportChartSettings2 = ref<ReportChartStruct>(new ReportChartStruct())

    const feSettings = ref<FeSettings>(new FeSettings())

    const downloadExcelNow = ref<number>(0)

    const MetricReportCols = computed<ReportColumn[]>(() => {
      return ReportCols.value.filter((col) => col.IsMetric() && !col.info)
    })

    const MetricReportColsForChart = computed<ReportColumn[]>(() => {
      return ReportCols.value.filter(
        (col) => col.IsMetric() && !!col.key && !!col.title && !col.chartEx
      )
    })

    const hasPermissionNote = computed<boolean>(() => {
      return reportPermission.value?.note || false
    })

    const InfoReportCols = computed<ReportColumn[]>(() => {
      return ReportCols.value.filter(
        (col) => (!col.IsGroup() && !col.IsMetric()) || col.info
      )
    })

    const GroupByReport = computed<ReportColumn[]>(() => {
      return ReportCols.value.filter((col) => col.IsGroup())
    })

    const GroupByMap = computed<{ [key: string]: ReportColumn }>(() => {
      return GroupByReport.value.reduce<
        Record<string, (typeof GroupByReport.value)[number]>
      >((acc, el) => {
        if (el.key !== undefined) {
          acc[el.key] = el
        }
        return acc
      }, {})
    })

    const isDefaultSortDate = computed(() => {
      return (
        reportSettingsNew.value.defaultSortDate &&
        group_by.value.includes('date') &&
        helper.DiffDays(filter.value.start_date, filter.value.end_date) > 1
      )
    })

    const IsConditionMustGoogleTaboolaCampaign = computed(() => {
      if (window.arb.isAnt()) return false
      if (
        (!filter.value?.traffic_source?.includes(TS.GOOGLE) &&
          !filter.value?.traffic_source?.includes(TS.TABOOLA)) ||
        !group_by.value.includes('campaign')
      ) {
        return true
      }

      return false
    })

    const IsConditionMustGoogleTaboola = computed(() => {
      if (window.arb.isAnt()) return false
      if (
        !filter.value?.traffic_source?.includes(TS.GOOGLE) &&
        !filter.value?.traffic_source?.includes(TS.TABOOLA)
      ) {
        return true
      }

      return false
    })

    const IsConditionMustTaboolaSection = computed(() => {
      if (window.arb.isAnt()) return false

      if (
        !filter.value?.traffic_source?.includes(TS.TABOOLA) ||
        !group_by.value.includes('section')
      ) {
        return true
      }

      return false
    })

    const toggleBulkAction = () => {
      const next = !showReportBulkAction.value
      showReportBulkAction.value = next
      localStorage.setItem('showReportBulkAction', String(next))
    }

    const dimensionInfo = (key: string) => {
      const col = ReportCols.value.find((col) => col.key === key)
      if (!col?.IsMetric()) {
        return new ReportColumn(col)
      }
      return null
    }

    const metricInfo = (key: string) => {
      const col = ReportCols.value.find((col) => col.key === key)
      if (col?.IsMetric()) {
        return new ReportColumn(col)
      }
      return null
    }

    const newDataDefault = () => {
      return {
        columns: [],
        items: [],
        plk: '',
        recordsTotal: 0,
        total: {},
      }
    }
    //other state
    const prevReportData = ref<reportDataV2 | undefined>()

    const prevReportDataNow = computed<reportDataV2 | undefined>(() => {
      // Only use this feature if the user enables it (enabled by default)
      if (reportSettingsNew.value.changeCompare) {
        return prevReportData.value
      }
      return
    })

    const selectedProfile = computed(() => {
      return profileOptions.value.find(
        (profile) => profile.id === profileSelectedId.value
      )
    })

    const isTodaySave = ref<boolean>(false) // Avoid cases like: open yesterday -> then switch to today -> show comparison feature

    const reportDataV2 = ref<reportDataV2>(newDataDefault())
    const isFetchingReport = ref<boolean>(false)
    const listColAccepted = ref<string[]>([])
    const allListColAccepted = ref<string[]>([])
    const updateClicked = ref<number>(0)
    const updateSearchClicked = ref<number>(0)
    const metricOrderVersion = ref<number>(0)

    const isFetchingCampaignDetail = ref<boolean>(false)
    const dataCampaignDetail = ref<any[]>([])

    const chartColSelected = ref<{ column: string[]; spline: string[] }>(
      oldChartMetrics.value &&
        oldChartMetrics.value.column &&
        oldChartMetrics.value.spline
        ? oldChartMetrics.value
        : { ...DEFAULT_CHART_METRICS }
    )

    const autoSync = ref<boolean>(false)

    const isShowChart = ref<boolean>(false)
    const isLoadingChart = ref<boolean>(false)
    const onChangeProfile = ref<boolean>(false)
    const profileSelectedId = ref<number>(-2)
    const isFirstLoadReport = ref<boolean>(true)
    const METRIC_ORDER = 'metric_order'

    const getMetricOrder = (): string[] => {
      const savedOrder = localStorage.getItem(METRIC_ORDER)
      if (!savedOrder) return []

      try {
        return JSON.parse(savedOrder) as string[]
      } catch {
        localStorage.removeItem(METRIC_ORDER)
        return []
      }
    }

    const buildMetricLookup = (metrics: ReportColumn[]) => {
      const map = new Map<string, ReportColumn>()
      const keys = new Set<string>()

      for (const m of metrics) {
        if (m.key) {
          map.set(m.key, m)
          keys.add(m.key)
        }
      }

      return { map, keys }
    }

    const MetricReportColsSorted = computed<ReportColumn[]>(() => {
      metricOrderVersion.value

      const metrics = MetricReportCols.value
      const savedOrder = getMetricOrder()

      if (!savedOrder.length) return metrics

      // tạo lookup để tìm kiếm nhanh hơn
      const { map, keys } = buildMetricLookup(metrics)

      // kiểm tra các key hợp lệ và các key mới
      const savedSet = new Set(savedOrder)
      const validKeys = savedOrder.filter((k) => keys.has(k))
      const newKeys = Array.from(keys).filter((k) => !savedSet.has(k))

      // cập nhật storage nếu có thay đổi
      if (
        validKeys.length !== savedOrder.length ||
        keys.size !== savedOrder.length
      ) {
        localStorage.setItem(
          METRIC_ORDER,
          JSON.stringify([...validKeys, ...newKeys])
        )
      }

      return [...validKeys, ...newKeys]
        .map((k) => map.get(k)!)
        .filter(Boolean) as ReportColumn[]
    })

    const refreshMetricOrder = () => {
      metricOrderVersion.value += 1
    }

    const ReportColsOrdered = computed<ReportColumn[]>(() => {
      const nonMetrics = ReportCols.value.filter(
        (col) => !col.metric || col.info
      )
      const sortedMetrics = MetricReportColsSorted.value

      return [...nonMetrics, ...sortedMetrics]
    })

    watch(chartColSelected.value, async (newValue, _) => {
      localStorage.setItem(keyStoreChart, JSON.stringify(newValue))
    })

    //getter
    const payload = computed<reportPayload>(() => {
      return {
        filter: filter.value,
        group_by: group_by.value,
        page: page.value,
        search: search.value,
        size: size.value,
        sort: sort.value,
        time_interval: time_interval.value,
        timezone: timezone.value,
        search_type: searchType.value,
        auto_sync: autoSync.value,
        show_chart: isShowChart.value,
        profile:
          profileSelectedId.value !== -2 ? profileSelectedId.value : undefined, //Nếu là custom ko cần lưu profile
        cols: listColAccepted.value,
        orderBy: orderBy.value,
        charts: chartV2Payload.value,
        dateRange: dateRange.value,
        path: reportOptions.value.table,
      }
    })

    const payloadChart = computed<reportPayload>(() => {
      return {
        ...payload.value,
        type: 'chart',
      }
    })

    const payloadTable = computed<reportPayload>(() => {
      return {
        ...payload.value,
        type: 'table',
      }
    })

    const isToday = computed<boolean>(() => {
      return (
        filter.value.start_date === filter.value.start_date &&
        filter.value.start_date === date2.today()
      )
    })

    //action
    const assginWithoutDate = (f: filterType) => {
      filter.value.campaigns = f.campaigns
      filter.value.demand_source = f.demand_source
      filter.value.publisher = f.publisher
      filter.value.section_id = f.section_id
      filter.value.status = f.status
      filter.value.traffic_source = f.traffic_source
      filter.value.manager = f.manager
      filter.value.account_demand_id = f.account_demand_id
    }
    const resetFilter = () => {
      filter.value = {
        campaigns: [],
        demand_source: [],
        end_date: format(
          new Date(new Date().toUTCString().substring(0, 25)),
          'yyyy-MM-dd'
        ),
        publisher: [],
        section_id: [],
        start_date: format(
          new Date(new Date().toUTCString().substring(0, 25)),
          'yyyy-MM-dd'
        ),
        status: [],
        traffic_source: [],
        manager: [],
        account_demand_id: [],
        landing_page_id: [],
        geo: [],
        account_supply_id: [],
        ad_account: [],
        keyword_set_id: [],
        label: [],
        layout_id: [],
        domain: [],
        created_by: null,
        account_cp: null,
        pixel: [],
      }
    }
    const resetPayload = () => {
      resetFilter()
      group_by.value = ['campaign']
      page.value = 1
      search.value = ''
      searchType.value = 'campaign'
      size.value = reportSettingsNew.value.pageSize || 100
      sort.value = [{ field: 'cost', dir: 'desc' }]
      time_interval.value = 'day'
      timezone.value = 'UTC'
    }
    const resetReport = () => {
      prevReportData.value = undefined
      reportDataV2.value = {
        columns: [],
        items: [],
        plk: '',
        recordsTotal: 0,
        total: {},
      }
    }
    const fetchFilterByPlk = async (plk: string) => {
      const result = await ctr_payload_key.Key({ params: { q: plk } })
      if (!result?.status || !result.data) {
        resetFilter()
        return
      }

      return result?.data
    }

    const setDataByPlk = (data: any) => {
      if (data?.profile) {
        profileSelectedId.value = data?.profile
      } else {
        profileSelectedId.value = -2 //Reset về custom
      }

      if (data?.charts) {
        try {
          chartV2.value = {}

          for (const key in data.charts) {
            if (Object.prototype.hasOwnProperty.call(data.charts, key)) {
              const element = data.charts[key]
              chartV2.value[key] = {
                reportChart: {} as any,
                colSelected: element.colSelected || [],
                loading: true,
              }
            }
          }
        } catch (error) {
          console.error(error)
        }
      }

      //Set giá trị "" về null để hiện placeholder
      try {
        for (const key in data.filter) {
          if (Object.prototype.hasOwnProperty.call(data.filter, key)) {
            if (data.filter[key] === '') {
              //@ts-ignore
              data.filter[key] = null
            }
          }
        }
      } catch {}

      filter.value = data?.filter || {}

      group_by.value = data?.group_by || ['campaign']
      sort.value = data?.sort || [{ field: 'cost', dir: 'desc' }]
      searchType.value = data?.search_type || 'campaign'
      page.value = data?.page || 1
      size.value = data?.size || 100
      search.value = data?.search || ''
      time_interval.value = data?.time_interval || 'day'
      timezone.value = data?.timezone || 'UTC'
      orderBy.value = data?.orderBy || null
      dateRange.value = data?.dateRange || null

      dateFollowRange()

      if ('show_chart' in (data || {})) {
        isShowChart.value = !!data.show_chart
      }

      if (data?.auto_sync) {
        autoSync.value = true
      }

      notShowChart()

      initCols(data?.cols, true)
    }

    const dateFollowRange = () => {
      if (!dateRange.value) return
      const newDate = GetDateByRange(dateRange.value || '', timezone.value)

      if (newDate?.length && newDate.length === 2) {
        filter.value.start_date = newDate[0]
        filter.value.end_date = newDate[1]
      }
    }

    const initCols = (cols: any, forceGroup?: boolean) => {
      listColAccepted.value = []

      //Check để xóa bỏ các cột sai
      cols?.forEach((col: string) => {
        //Nếu là metric thì add vào
        if (MetricReportCols.value.find((metric) => metric.key === col)) {
          listColAccepted.value.push(col)
          return
        }

        //Nếu group đó có tồn tại và có trong group_by mới add vào
        if (
          GroupByReport.value.find((group) => group.key === col) &&
          group_by.value.includes(col)
        ) {
          listColAccepted.value.push(col)
          return
        }

        const infoReport = InfoReportCols.value.find((info) => info.key === col)

        if (infoReport) {
          const active = infoReport.active || []
          if (active.length) {
            for (let index = 0; index < active.length; index++) {
              const groupActive = active[index]
              if (group_by.value.includes(groupActive)) {
                listColAccepted.value.push(col)
                return
              }
            }
          }
        }
      })

      if (forceGroup) {
        group_by.value.forEach((element) => {
          if (!listColAccepted.value.includes(element)) {
            listColAccepted.value.push(element)
          }
        })
      }

      if (!listColAccepted.value?.length) {
        MetricReportCols.value.forEach((col) => {
          if (!col.key) return
          listColAccepted.value.push(col.key)
        })
      }
    }

    const handleURLQueries = (queries: { [key: string]: any }) => {
      if (!queries) return

      let isChange = false

      //Tạm thời để mỗi campaigns
      const accepts = ['campaigns', 'ad_account', 'account_supply_id', 'domain']
      const numberFields = ['campaigns', 'account_supply_id']

      let founds = []

      for (const key in queries) {
        if (Object.prototype.hasOwnProperty.call(queries, key)) {
          if (!accepts.includes(key)) {
            continue
          }

          if (!isChange) {
            isChange = true
          }

          founds.push(key)

          let newFilter = queries[key].split(',')
          if (numberFields.includes(key)) {
            // number
            newFilter = newFilter.map(Number)
          }

          //@ts-ignore
          filter.value[key] = newFilter
        }
      }

      if (queries['start_date'] && queries['end_date']) {
        founds = founds.concat(['start_date', 'end_date'])
        if (
          helper.isValidDate(queries['start_date']) &&
          helper.isValidDate(queries['end_date'])
        ) {
          isChange = true

          filter.value.start_date = queries['start_date']
          filter.value.end_date = queries['end_date']
        }
      }

      if (queries['page']) {
        isChange = true

        founds.push('page')
        page.value = parseInt(queries['page'], 10)
      }

      let isChangeGroup = false

      if (queries['group']) {
        isChange = true
        isChangeGroup = true

        founds.push('group')
        group_by.value = queries['group'].split(',')
      }

      if (queries['groupPlus']) {
        try {
          isChange = true
          isChangeGroup = true
          founds.push('groupPlus')
          group_by.value.push(queries['groupPlus'])
        } catch (error) {
          console.error(error)
        }
      }

      let isChangeCols = false

      if (reportSettingsNew.value.autoSaveReport) {
        if (queries['groupby']) {
          isChange = true
          isChangeGroup = true
          founds.push('groupby')
          group_by.value = queries['groupby']
            .split(',')
            .filter((key: string) => GroupByMap.value[key]) // lọc bỏ group_by không tồn tại
        }

        if (queries['cols']) {
          isChange = true
          isChangeCols = true
          founds.push('cols')
          listColAccepted.value = queries['cols'].split(',')
        }
      }

      if (isChangeGroup || isChangeCols) {
        initCols(listColAccepted.value, true)
      }

      const colP = queries['colsP']
      if (
        colP &&
        !listColAccepted.value.includes(colP) &&
        InfoReportCols.value.find((info) => info.key === colP)
      ) {
        listColAccepted.value.push(colP)
      }

      if (window.route.query?.sort === 'date desc') {
        sort.value = [
          {
            dir: 'desc',
            field: 'date',
          },
        ]
      }

      return isChange
    }

    //Ném các publisher status 3 (Rejected) xuống cuối //Khánh
    const changePositionRejectToBottom = (data: reportDataV2) => {
      if (!data?.items) return

      data.items.sort((a, b) => {
        if (a.publisher?.status === 3 && b.publisher?.status !== 3) return 1 // Ném `a` xuống cuối
        if (b.publisher?.status === 3 && a.publisher?.status !== 3) return -1 // Ném `b` xuống cuối
        return 0 // Không thay đổi thứ tự cho status 1, 2
      })
    }

    const prefetchPrevReportData = () => {
      // Only display the comparison feature if both update clicks are for today
      if (isToday.value && isTodaySave.value) {
        prevReportData.value = reportDataV2.value
      } else {
        // Clear to ensure that if it’s not today and today -> no previous data exists
        prevReportData.value = undefined
      }

      // Save the previous fetch data to compare
      isTodaySave.value = isToday.value
    }

    const convertLabelToValue = (label: string | undefined) => {
      const labelMapping = reportFilterState.value.State?.label?.options || []
      if (!label || label === 'Default') return 0
      const found = labelMapping?.find((item) => item.label === label)
      return found ? found.value : label
    }

    const keyMapping: Record<string, (data: any) => any> = {
      campaigns: (data) => data?.campaign_name?.id,
      ad_groups: (data) => data?.ad_group_name?.id,
      status: (data) => data?.status?.status,
      account_supply_id: (data) => data?.account_supply?.id,
      label: (data) => convertLabelToValue(data?.label),
      publisher: (data) => data?.publisher?.id,
      category: (data) => (data?.category ? [data?.category] : []),
      delivery_status: (data) =>
        data?.delivery_status_reasons ? [data?.delivery_status_reasons] : [],
    }

    const mergeDataToFilter = (data: any, baseFilter: any) => {
      const newFilter: any = {}

      for (const key in baseFilter) {
        if (key === 'cost') continue

        const val = keyMapping[key]?.(data) ?? data[key]

        const isValid =
          val !== null && val !== undefined && val !== '' && val !== 0

        if (Array.isArray(baseFilter[key])) {
          if (isValid) {
            newFilter[key] = Array.isArray(val) ? [...val] : [val]
          } else {
            newFilter[key] = []
          }
        } else {
          newFilter[key] = isValid ? val : baseFilter[key]
        }
      }

      return newFilter
    }

    const fetchCampaignDetail = async (data: any, key?: string) => {
      try {
        isFetchingCampaignDetail.value = true
        dataCampaignDetail.value = []

        const payloadClone: reportPayload = {
          ...payloadTable.value,
          filter: { ...payloadTable.value.filter },
          group_by: [...(payloadTable.value.group_by || [])],
          dateRange:
            key === 'date'
              ? DATE_RANGE.LAST_7_DAYS
              : payloadTable.value.dateRange,
          page: 1,
        }

        if (data) {
          payloadClone.filter = mergeDataToFilter(data, payloadClone.filter)
        }

        if (key && key === 'date') {
          payloadClone.filter.start_date = date2.last7Days()
          payloadClone.filter.end_date = date2.today()
          if (!payloadClone.group_by.includes('date')) {
            payloadClone.group_by.push('date')
          }
        }

        if (key && key === 'ad_group') {
          if (!payloadClone.group_by.includes('ad_group_id')) {
            payloadClone.group_by.push('ad_group_id')
          }
        }

        const result = await ctr_report.ReportNew(
          payloadClone,
          reportOptions.value.table
        )

        if (result && result?.status) {
          dataCampaignDetail.value = result?.data?.items || []
        }
      } catch (error) {
        console.error(error)
      } finally {
        isFetchingCampaignDetail.value = false
      }
    }

    const isComp = window.arb.isCompany()

    const appliedGroupBy = ref<string[]>([])
    const checkGroupBy = (type: string) =>
      computed(() => appliedGroupBy.value.includes(type))
    const isGroupByCampaign = checkGroupBy('campaign')
    const isGroupByKeyword = checkGroupBy('keyword')
    const isGroupByGeo = checkGroupBy('geo')

    const canBulk = computed(() => {
      const selectedCount =
        reportDataV2.value.items?.filter((i) => i.selected).length || 0
      return (
        selectedCount >= 2 &&
        reportSettingsNew.value.selectBox &&
        isComp &&
        (isGroupByCampaign.value ||
          isGroupByKeyword.value ||
          isGroupByGeo.value)
      )
    })

    const fetchReport = async () => {
      fmt.Println('fetchReport')
      prefetchPrevReportData()

      isFetchingReport.value = true
      const listAcceptColTemp = listColAccepted.value
      let result

      result = await ctr_report.ReportNew(
        payloadTable.value,
        reportOptions.value.table
      )

      reportDataV2.value = result?.data || {}

      //page về 1 -> retry lại, trường hợp lỗi page
      if (
        Math.ceil(reportDataV2.value.recordsTotal / size.value) < page.value &&
        page.value > 1
      ) {
        fmt.Println('page out of range, reset to 1')
        page.value = 1
        const result2 = await ctr_report.ReportNew(
          payloadTable.value,
          reportOptions.value.table
        )
        reportDataV2.value = result2?.data || {}
      }

      changePositionRejectToBottom(reportDataV2.value)

      replacePayloadKey(reportDataV2.value.plk)
      isFetchingReport.value = false

      // sync column accepted

      let temp: string[] = []

      ReportCols.value.forEach((col: any) => {
        temp.push(col.field)
      })
      appliedGroupBy.value = [...group_by.value]
      allListColAccepted.value = helper.clone(temp)
      if (!onChangeProfile.value && !profileSelectedId.value) {
        listColAccepted.value = helper.clone(temp)
      }

      if (!isFirstLoadReport.value) {
        listColAccepted.value = listAcceptColTemp
      }

      //verify require column with group by
      verifyRequiredColumn()

      onChangeProfile.value = false

      if (isFirstLoadReport.value) {
        isFirstLoadReport.value = false
      }

      savePayloadToStorage()
    }

    const verifyRequiredColumn = () => {
      for (const key in GroupByMap.value) {
        if (Object.prototype.hasOwnProperty.call(GroupByMap.value, key)) {
          if (
            group_by.value.includes(key) &&
            !listColAccepted.value.includes(key)
          ) {
            listColAccepted.value.push(key)
          }
        }
      }
    }

    const replacePayloadKey = (plk: string) => {
      if (!plk) return
      const oldURL = new URL(window.location.href)
      const debug = oldURL.searchParams.get('debug')
      const test = oldURL.searchParams.get('test')

      const url = new URL(window.location.origin + window.location.pathname)
      url.searchParams.set('plk', plk)
      if (debug !== null) {
        url.searchParams.set('debug', debug)
      }
      if (test !== null) {
        url.searchParams.set('test', test)
      }
      window.history.pushState({}, '', url.toString())
    }

    const chartV2 = ref<Record<string, ChartItemV2>>({})

    const isOneChart = computed(() => {
      return (
        Object.values(chartV2.value).filter(
          (v) => v !== undefined && v !== null
        ).length <= 1
      )
    })

    const isMaxChart = computed(() => {
      return (
        Object.values(chartV2.value).filter(
          (v) => v !== undefined && v !== null
        ).length >= MAX_ADD_CHART
      )
    })

    const chartV2Payload = computed(() => {
      const result: DataLoadChart = {}
      for (const key in chartV2.value) {
        if (Object.prototype.hasOwnProperty.call(chartV2.value, key)) {
          const element = chartV2.value[key]
          result[key] = {
            colSelected: {
              column: element.colSelected.column,
              spline: element.colSelected.spline,
            },
          }
        }
      }
      return result
    })

    const getAllSelectedMetrics = (colSelected: {
      column: string[]
      spline: string[]
    }) => {
      return [...(colSelected.column || []), ...(colSelected.spline || [])]
    }

    // // Hàm xóa chart
    const removeChartV2 = async (chartKey: string) => {
      if (isOneChart.value) return

      try {
        //@ts-ignore
        delete chartV2.value[chartKey]
      } catch {}
    }

    const toggleAutoSync = () => {
      autoSync.value = !autoSync.value
      localStorage.setItem(
        ReportV2.KEY_STORAGE_AUTO_SYNC,
        String(autoSync.value)
      )
    }

    const toggleShowChart = () => {
      isShowChart.value = !isShowChart.value
      saveForNewPlk()
    }

    const saveDataProfileChart = (data?: string) => {
      if (data) {
        localStorage.setItem(CHART_STORAGE_KEY, data)
      }
    }

    const notShowChart = () => {
      if (reportSettingsNew.value.smartChart && helper.mobileDetect()) {
        isShowChart.value = false
      }

      if (
        reportSettingsNew.value.smartChart &&
        (!group_by.value?.includes('date') ||
          filter.value.start_date === filter.value.end_date)
      ) {
        isShowChart.value = false
      }
    }

    const profileChangeHandle = async (id: number, fromMounted?: boolean) => {
      const profile = profileOptions.value.find((el) => el.id === id)

      if (!profile) return false

      if (profileSelectedId.value !== id) {
        profileSelectedId.value = id
      }

      if (profile.id === -2) {
        profile.charts = JSON.stringify({
          cew6kqAmqVW1752815253032: {
            colSelected: DEFAULT_CHART_METRICS,
          },
        })
      }

      let initFilter = true

      if (fromMounted && window.route.query?.mode === 'profile_cols') {
        initFilter = false
      }

      chartV2.value = {}
      if (profile?.charts) {
        const savedCharts = JSON.parse(profile?.charts)

        for (const key in savedCharts) {
          if (Object.prototype.hasOwnProperty.call(savedCharts, key)) {
            const element = savedCharts[key]

            chartV2.value[key] = {
              loading: false,
              reportChart: {
                title: '',
                xAxis: [],
                series: {},
                comparison: {},
              } as any,
              colSelected: {
                column: Array.isArray(element.colSelected?.column)
                  ? element.colSelected.column
                  : [],
                spline: Array.isArray(element.colSelected?.spline)
                  ? element.colSelected.spline
                  : [],
              },
            }
          }
        }
      }

      page.value = 1

      if (profile?.settings) {
        try {
          const settings = JSON.parse(profile.settings)

          isShowChart.value = settings.show_chart
          autoSync.value = settings.auto_sync

          if (initFilter) {
            dateRange.value = settings.dateRange || DATE_RANGE.TODAY
          }

          timezone.value = settings.timezone || 'UTC'
          time_interval.value = settings.time_interval || 'day'
          changeTimezone.value++

          if (settings.sort) {
            sort.value = settings.sort
          }
        } catch (error) {
          console.error(error)
        }
      }

      if (!isShowChart.value) isShowChart.value = false
      if (!autoSync.value) autoSync.value = false

      notShowChart()

      if (profile.group_by) {
        group_by.value = profile.group_by.split(',')
      }
      if (profile.column_display) {
        listColAccepted.value = profile.column_display.split(',')
      }

      if (initFilter) {
        dateFollowRange()

        let originFilters: Record<string, any> = {}

        try {
          originFilters = JSON.parse(profile.filters)
        } catch {
          originFilters = {}
        }

        reportFilterOpts.value.filter?.forEach((filterOpt) => {
          if (originFilters[filterOpt.key]) {
            if (
              filterOpt.multiple &&
              !Array.isArray(originFilters[filterOpt.key])
            ) {
              originFilters[filterOpt.key] = []
            } else {
              filter.value[filterOpt.key as keyof typeof filter.value] =
                originFilters[filterOpt.key]
            }
          } else {
            if (filterOpt.multiple) {
              filter.value[filterOpt.key as keyof typeof filter.value] =
                [] as any
            } else {
              filter.value[filterOpt.key as keyof typeof filter.value] =
                null as any
            }
          }
        })
      }

      if (fromMounted) return true
      saveForNewPlk()

      return true
    }

    const changeShowModalSettings = (value: boolean) => {
      showModalSettings.value = value
    }

    const changeReportSettings = (value: reportSettingsV2) => {
      try {
        reportSettingsNew.value = new reportSettingsV2(value)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchSearchTypeOptions = async () => {
      const result = await ctr_report.SearchType({
        path_url: helper.truePath(),
      })

      if (result?.status) {
        searchTypeOptions.value = result?.data || []
      }
    }

    const fetchPrefetch = async () => {
      const result = await ctr_report.ReportPrefetch()

      if (result?.status) {
        reportPermission.value = new ReportPermission(result?.data || {})
      }
    }

    const fetchCols = async (linkFetchCol?: string) => {
      const result = await ctr_report.ReportGetData(linkFetchCol)
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

      // Kiểm tra và loại bỏ metrics không tồn tại
      chartColSelected.value.column = chartColSelected.value.column.filter(
        (metric) => ReportCols.value.some((obj) => obj.key === metric)
      )

      chartColSelected.value.spline = chartColSelected.value.spline.filter(
        (metric) => ReportCols.value.some((obj) => obj.key === metric)
      )
    }

    const fetchFilterOpts = async (link: string, payload: any) => {
      reportFilterOpts.value.loading = true

      const result = await ctr_report.ReportGetData(link, payload)
      reportFilterOpts.value.changeData(result?.data || {})

      reportFilterOpts.value.filter?.forEach((filter) => {
        reportFilterState.value.NewState(filter.key)
      })
    }

    const fetchOpts = async (payload: any) => {
      const result = await ctr_report.ReportOpts(payload)
      reportOptions.value = new ReportOpts(result?.data?.opts || {})
    }

    const fetchChartSettings = async () => {
      const result = await ctr_report.ReportChartSettings()

      if (result?.status) {
        ReportChartSettings2.value = new ReportChartStruct(result?.data || {})
      }
    }

    const fetchCampaignSettings = async () => {
      const result = await ctr_report.ReportCampaignSettings()
      feSettings.value = new FeSettings(result?.data || {})
    }

    const getFullInfoByKey = (key?: string): ReportColumn | undefined => {
      if (!key) return
      for (let index = 0; index < ReportCols.value.length; index++) {
        const element = ReportCols.value[index]
        if (element.key === key) {
          return element
        }
      }

      return
    }

    const getTitleByKey = (key: string): string => {
      for (let index = 0; index < ReportCols.value.length; index++) {
        const element = ReportCols.value[index]
        if (element.key === key) {
          return element.title || ''
        }
      }

      return ''
    }

    const isSortDisabled = (key: string): boolean => {
      for (let index = 0; index < ReportCols.value.length; index++) {
        const element = ReportCols.value[index]
        if (element.key === key) {
          return element.sortDisabled || false
        }
      }

      return false
    }

    const getChartSetting = (key: string) => {
      return ReportChartSettings2.value.chart[key] || undefined
    }

    const fetchPermission = async () => {
      const result = await ctr_campaign.CampaignConfigs({
        logging: true,
        note: true,
        preview_ad: true,
      })

      permission.value = result?.data || {}
    }

    const filtersStringify = () => {
      try {
        const cleanFilter = Object.entries(filter.value).reduce(
          (acc, [key, value]) => {
            if (['start_date', 'end_date'].includes(key)) return acc
            // Skip empty values
            if (!value) return acc
            // Skip empty arrays
            if (Array.isArray(value) && value.length === 0) return acc

            acc[key] = value
            return acc
          },
          {} as Record<string, any>
        )

        if (helper.isEmpty(cleanFilter)) return ''

        return JSON.stringify(cleanFilter)
      } catch (error) {
        console.error(error)
        return ''
      }
    }

    const prepareProfileOption = async () => {
      const result = await ctr_report.ReportProfiles(helper.truePath())
      profileOptions.value = result?.data || []
    }

    const destroyNoti = (message: any) => {
      if (message) {
        return message.destroy()
      }
    }

    const callReportChart = async () => {
      reportChartDataV2.value = {}

      if (!reportOptions.value.table) return

      for (const key in chartV2.value) {
        if (Object.prototype.hasOwnProperty.call(chartV2.value, key)) {
          chartV2.value[key].loading = true
        }
      }

      let res = await ctr_report.ReportNew(
        payloadChart.value,
        reportOptions.value.table
      )
      reportChartDataV2.value = res?.data || {}

      reportChartDataV2Convert.value = Chart.processDataChart(
        reportChartDataV2.value
      )

      replacePayloadKey(reportChartDataV2.value.plk)

      savePayloadToStorage()
    }

    const renderChartV2 = async () => {
      if (!reportChartDataV2Convert.value) return

      const colFormatChart = helper.clone(MetricReportCols.value)
      Chart.processColFormatChart(colFormatChart)

      for (const key in chartV2.value) {
        if (Object.prototype.hasOwnProperty.call(chartV2.value, key)) {
          const chart = chartV2.value[key]

          renderThisChart(key, chart)
        }
      }
    }

    const renderThisChart = (key: string, chart: ChartItemV2) => {
      Chart.destroyChart(key)

      const rawSeries = reportChartDataV2Convert.value.series || {}

      const selectedMetrics = getAllSelectedMetrics(chart.colSelected)
      chart.series =
        selectedMetrics.reduce((acc: Record<string, any>, col) => {
          if (rawSeries[col]) acc[col] = rawSeries[col]
          return acc
        }, {}) || {}

      const chartOptions = {
        id: key,
        title: chart.reportChart.title,
        xAxis: reportChartDataV2Convert.value.xAxis,
        series: chart.series,
        height: null,
        colSelected: chart.colSelected,
      }

      Chart.renderChartV2(chartOptions)

      chart.loading = false
    }

    const addNewChartDefault = () => {
      if (!chartV2.value) chartV2.value = {}

      const newId = `c${helper.randomString()}${Date.now()}`

      const newChart = {
        reportChart: {
          title: '',
          xAxis: [],
          series: {},
          comparison: {},
        },
        colSelected: DEFAULT_CHART_METRICS,
        loading: false,
      }

      chartV2.value[newId] = newChart
    }

    const addNewChartV2 = async () => {
      if (!chartV2.value) chartV2.value = {}
      const newId = `c${helper.randomString()}${Date.now()}`

      let metricsExists: string[] = []

      for (const key in chartV2.value) {
        if (Object.prototype.hasOwnProperty.call(chartV2.value, key)) {
          const element = chartV2.value[key]

          try {
            metricsExists = metricsExists.concat(
              element.colSelected.column || [],
              element.colSelected.spline || []
            )
          } catch (error) {
            console.error(error)
          }
        }
      }

      const firstUnusedMetric = MetricReportColsForChart.value.find(
        (item) => !metricsExists.includes(item.key as string)
      )

      const newMetric = (firstUnusedMetric?.key as string) || 'cost'

      let typeChart = CHART_TYPE.SPLINE

      const settingChart = ReportChartSettings2.value.chart[newMetric]
      if (
        settingChart &&
        settingChart.cType &&
        settingChart.cType !== CHART_TYPE.SPLINE
      ) {
        ;(typeChart as any) = settingChart.cType as CHART_TYPE
      }

      const colInit = {
        column: (typeChart as any) === CHART_TYPE.COLUMN ? [newMetric] : [],
        spline: (typeChart as any) === CHART_TYPE.SPLINE ? [newMetric] : [],
      }

      const newChart = {
        reportChart: {
          title: '',
          xAxis: [],
          series: {},
          comparison: {},
        },
        colSelected: colInit,
        loading: false,
      }

      chartV2.value[newId] = newChart
    }

    const saveForNewPlk = async () => {
      const result = await ctr_report.SavePlk(payload.value)

      if (result?.data.key) {
        replacePayloadKey(result?.data.key)

        savePayloadToStorage()
      }
    }

    const savePayloadToStorage = () => {
      localStorage.setItem(
        ReportV2.KEY_STORAGE_SAVE_REPORT + path,
        JSON.stringify(payload.value)
      )
    }

    const getDateRange = () => {
      if (reportSettingsNew.value.dateOpen === DATE_RANGE.CURRENT) {
        return [filter.value.start_date, filter.value.end_date]
      }

      return GetDateByRange(
        reportSettingsNew.value.dateOpen || '',
        timezone.value
      )
    }

    const filterDataByColumns = (
      items: Record<string, any>[],
      allowedCols: string[]
    ): Record<string, any>[] => {
      return items.map((item) => {
        const filtered: Record<string, any> = {}
        for (const key in item) {
          if (allowedCols.includes(key)) {
            filtered[key] = item[key]
          }
        }
        return filtered
      })
    }

    const processFieldValue = (item: any, key: string) => {
      switch (key) {
        case 'campaign_name':
        case 'section':
          return item[key]?.name || ''

        case 'status':
          return item[key]?.status || ''

        case 'publisher':
          let showName = ''
          const pubData = item[key]
          if (pubData) {
            if (pubData?.first_name || pubData?.last_name) {
              showName = `${pubData?.first_name || ''} ${
                pubData?.last_name || ''
              }`.trim()
            }
            if (pubData?.email) {
              showName += showName ? ` (${pubData.email})` : pubData.email
            }
          }
          return showName

        case 'account_demand_id':
          return item['account_demand']?.name || ''

        case 'landing_page':
          return item['landing_page']?.name || ''
        case 'account_demand':
          return item['account_demand']
            ? {
                id: item['account_demand'].id || '',
                name: item['account_demand'].name || '',
              }
            : ''

        default:
          return item[key]
      }
    }
    const downloadJSON = async (
      copyToClipboard = false,
      downloadFullTable = false,
      rowData?: Record<string, any>
    ) => {
      let messageNoti
      try {
        messageNoti = window.message.loading('Loading data...', { duration: 0 })
        await helper.sleep(1000)

        let dataSource: any[] = []
        if (downloadFullTable) {
          // download toàn bộ data có ở table
          const newPayload = helper.clone(payload.value)
          const resp = await ctr_report.Report(newPayload)
          if (resp?.data?.items?.length) {
            dataSource = resp.data.items
          }
        } else if (rowData) {
          dataSource = [rowData]
        }

        // Đóng notification loading
        if (messageNoti) {
          destroyNoti(messageNoti)
          messageNoti = null
        }

        if (!dataSource.length) {
          window.message.error('No data to download!', { closable: true })
          return
        }

        // 2. Lọc theo allowedCols
        const newPayload = helper.clone(payload.value)

        newPayload.cols = (newPayload.cols || []).map((col: string) => {
          if (col === 'landing_page_id') return 'landing_page'
          if (col === 'account_demand_id') return 'account_demand'
          return col
        })

        const allowedCols = newPayload.cols || []
        const filteredData = allowedCols.length
          ? dataSource.map(
              (item) => filterDataByColumns([item], allowedCols)[0]
            )
          : dataSource

        // Kiểm tra sau khi lọc
        const validFiltered = filteredData.filter(
          (item) => item && Object.keys(item).length > 0
        )
        if (!validFiltered.length) {
          window.message.error('No allowed columns to export!', {
            closable: true,
          })
          return
        }

        const processedData = validFiltered.map((item) => {
          const processedSingle: Record<string, any> = {}
          Object.keys(item).forEach((key: string) => {
            const processedValue = processFieldValue(item, key)
            if (processedValue === null || processedValue === undefined) {
              return
            }

            let displayName = getTitleByKey(key) || key
            if (key === 'campaign_name') {
              displayName = 'Campaign'
              processedSingle[displayName] = processedValue

              if ('delivery_status' in (item[key] || {})) {
                processedSingle['Delivery Status'] =
                  item[key].delivery_status || ''
              }
              return
            }
            if (key === 'landing_page') {
              displayName = 'Landing Page'
              processedSingle[displayName] = processedValue
            }

            if (key.includes('_rt')) {
              displayName = `${displayName} Real-time`
            }

            processedSingle[displayName] = processedValue
          })
          return processedSingle
        })

        // Kiểm tra có data không
        if (
          !processedData.length ||
          processedData.every((obj) => !Object.keys(obj).length)
        ) {
          window.message.error('No valid data to export!', { closable: true })
          return
        }

        // 4. Xuất JSON
        const jsonStr = JSON.stringify(processedData, null, 2)

        if (copyToClipboard) {
          try {
            await navigator.clipboard.writeText(jsonStr)
            window.message.success('Data copied to clipboard!', {
              duration: 3000,
            })
          } catch {
            window.message.error(
              'Failed to copy data to clipboard!, Please try again.',
              {
                closable: true,
              }
            )
          }
          return
        }

        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-data-${
          new Date().toISOString().split('T')[0]
        }.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        window.message.success('JSON file downloaded successfully!', {
          duration: 3000,
        })
      } catch {
        if (messageNoti) {
          destroyNoti(messageNoti)
        }
        window.message.error('Failed to download JSON data!', {
          closable: true,
        })
      }
    }

    const quickSelectMap: Record<
      string,
      {
        getValue: (rowData: any) => any
        target: keyof typeof filter.value
      }
    > = {
      campaign: {
        getValue: (row) => row?.campaign_name?.id,
        target: 'campaigns',
      },
      traffic_source: {
        getValue: (row) => row?.traffic_source,
        target: 'traffic_source',
      },
      demand_source: {
        getValue: (row) => row?.demand_source,
        target: 'demand_source',
      },
      category: {
        getValue: (row) => row?.category,
        target: 'category',
      },
      label: {
        getValue: (row) => row?.label,
        target: 'label',
      },
      domain: {
        getValue: (row) => row?.domain,
        target: 'domain',
      },
      geo: {
        getValue: (row) => row?.geo,
        target: 'geo',
      },
      landing_page_id: {
        getValue: (row) => row?.landing_page?.id,
        target: 'landing_page_id',
      },
      account_supply_id: {
        getValue: (row) => row?.account_supply?.id,
        target: 'account_supply_id',
      },
      publisher: {
        getValue: (row) => row?.publisher?.id,
        target: 'publisher',
      },
      manage_id: {
        getValue: (row) => row?.manage_id?.id,
        target: 'manager',
      },
      traffic_source_acc_id: {
        getValue: (row) => row?.traffic_source_acc_id,
        target: 'ad_account',
      },
      layout_id: {
        getValue: (row) => row?.layout_id,
        target: 'layout_id',
      },
      tags: {
        // api report lỗi nên e chưa test được case này
        getValue: (row) => row?.tags,
        target: 'tag',
      },
    }

    const quickSelect = (option: any) => {
      console.log('options', option)

      const config = quickSelectMap[option.field]
      if (!config) return

      const value = config.getValue(option.rowData)
      if (!value) return

      filter.value[config.target] = [value] as any
    }

    return {
      changeTimezone,
      originalTitle,
      dateRange,
      isReload,
      isReloadChart,
      isReloadTable,
      reportSettingsNew,
      searchType,
      searchTypeOptions,
      isFirstLoadReport,
      showModalSettings,
      showReportBulkAction,
      permission,
      filter,
      group_by,
      page,
      search,
      size,
      width,
      sort,
      orderBy,
      ReportCols,
      reportOptions,
      MetricReportCols,
      InfoReportCols,
      GroupByReport,
      GroupByMap,
      prevReportData,
      prevReportDataNow,
      isFetchingCampaignDetail,
      dataCampaignDetail,
      reportDataV2,
      listColAccepted,
      payload,
      isFetchingReport,
      updateClicked,
      time_interval,
      timezone,
      chartColSelected,
      autoSync,
      isShowChart,
      isLoadingChart,
      onChangeProfile,
      profileSelectedId,
      allListColAccepted,
      downloadExcelNow,
      reportPermission,
      profileOptions,
      mapCampaignInfo,
      reportFilterOpts,
      reportFilterState,
      isReady,
      ReportChartSettings2,
      feSettings,
      updateSearchClicked,
      selectedProfile,

      isDefaultSortDate,
      hasPermissionNote,

      chartV2,
      selectedRowsMap,

      chartV2Payload,
      isOneChart,
      isMaxChart,
      IsConditionMustGoogleTaboolaCampaign,
      IsConditionMustGoogleTaboola,
      IsConditionMustTaboolaSection,
      isGroupByCampaign,
      isGroupByKeyword,
      isGroupByGeo,
      canBulk,
      MetricReportColsSorted,
      ReportColsOrdered,

      destroyNoti,
      saveDataProfileChart,

      removeChartV2,
      metricInfo,
      assginWithoutDate,
      resetFilter,
      fetchFilterByPlk,
      fetchCampaignDetail,
      fetchReport,
      resetReport,
      replacePayloadKey,
      resetPayload,
      verifyRequiredColumn,
      changeShowModalSettings,
      changeReportSettings,
      handleURLQueries,
      fetchSearchTypeOptions,
      toggleShowChart,
      toggleAutoSync,
      fetchPrefetch,
      fetchCols,
      fetchFilterOpts,
      fetchOpts,
      fetchChartSettings,
      getTitleByKey,
      getFullInfoByKey,
      isSortDisabled,

      getChartSetting,
      fetchPermission,
      filtersStringify,
      prepareProfileOption,
      initCols,
      profileChangeHandle,
      callReportChart,
      renderChartV2,
      addNewChartV2,
      renderThisChart,
      saveForNewPlk,
      addNewChartDefault,
      setDataByPlk,
      getDateRange,
      downloadJSON,
      newDataDefault,
      fetchCampaignSettings,
      quickSelect,
      dimensionInfo,
      toggleBulkAction,
      refreshMetricOrder,
    }
  })
