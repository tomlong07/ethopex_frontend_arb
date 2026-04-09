import { DATE_RANGE } from '@/enum/report-v2'
import { ctr_report_supply_keyword } from '@/services/ctr_report_supply_keyword'
import date2 from '@/utils/date2'
import { GridApi, SortChangedEvent } from 'ag-grid-community'
import { defineStore } from 'pinia'

// Khai báo interface
interface Ifilter {
  start_date: string
  end_date: string
}

export default defineStore('useReportSupplyKeyword', () => {
  // !! State
  const isFetchingReport = ref<boolean>(false)
  const isColumnDisplay = ref<boolean>(true)
  const isGroupBy = ref<boolean>(true)
  const filter = ref<Ifilter>({
    start_date: date2.today(),
    end_date: date2.today(),
  })

  const timezone = ref<string>('UTC')
  const timeInterval = ref<string>('day')
  const pagination = ref({
    page: 1,
    size: 100,
    total: 0,
  })
  const sortModel = ref<{ field: string; dir: 'asc' | 'desc' }[]>([
    { field: 'date', dir: 'asc' },
  ])

  const dateRange = ref<DATE_RANGE | null>(DATE_RANGE.TODAY)

  const metricsColumn = ref<any[]>([
    {
      key: 'supply_impression',
      title: 'Supply Impressions',
      headerTooltip: 'Number of impressions from the supply source',
      IsRealTime: () => false,
    },
    {
      key: 'all_traffic',
      title: 'Traffics',
      headerTooltip: 'Total number of visits',
      IsRealTime: () => false,
    },
    {
      key: 'traffic_by_prelanding',
      title: 'Traffics By Prelanding',
      headerTooltip: 'Number of visits through the Prelanding page',
      IsRealTime: () => false,
    },
    {
      key: 'ctr_traffic_by_prelanding',
      title: 'CTR',
      headerTooltip:
        'The ratio between Traffic By Prelanding and Total Traffic',
      IsRealTime: () => false,
    },
  ])
  const listMetricsColumnAccepted = ref<string[]>([
    'supply_impression',
    'all_traffic',
    'traffic_by_prelanding',
    'ctr_traffic_by_prelanding',
  ])

  const groupByColumn = ref<any[]>([
    {
      key: 'date',
      title: 'Date',
      headerTooltip: 'Group data by Date',
      IsRealTime: () => false,
    },
    {
      key: 'domain',
      title: 'Domain',
      headerTooltip: 'Group data by Domain',
      IsRealTime: () => false,
    },
    {
      key: 'supply_keyword',
      title: 'Supply Keyword',
      headerTooltip: 'Group data by Supply Keyword',
      IsRealTime: () => false,
    },
  ])
  const listGroupByColumnAccepted = ref<string[]>([
    'date',
    'domain',
    'supply_keyword',
  ])

  const gridApi = ref<GridApi | null>(null)
  const columnDefs = ref<any[]>([])

  const gridOptions = {
    rowHeight: 50,
    paginationAutoPageSize: false,
    suppressPaginationPanel: false,
  }
  const dataReportTable = ref<[]>([])

  // !! Lifecycle hook
  const pageCount = computed(() => {
    return Math.ceil(pagination.value.total / pagination.value.size)
  })

  const defaultColDef = computed(() => {
    return {
      resizable: true,
      sortable: true,
    }
  })

  // !! Func
  const onGridReady = (event: any) => {
    gridApi.value = event.api
  }
  const handleSortChanged = (event: SortChangedEvent) => {
    const sortedColumns = event.api
      .getColumnState()
      .filter((col) => col.sort != null)
      .map((col) => ({
        field: col.colId,
        dir: col.sort as 'asc' | 'desc',
      }))

    sortModel.value = sortedColumns
    onUpdateReport()
  }

  const applySelectedColumns = () => {
    const selectedGroupCols =
      groupByColumn.value?.filter((c) =>
        listGroupByColumnAccepted.value?.includes(c.key)
      ) || []

    const selectedMetricCols =
      metricsColumn.value?.filter((c) =>
        listMetricsColumnAccepted.value?.includes(c.key)
      ) || []

    if (!selectedGroupCols.length && !selectedMetricCols.length) return

    columnDefs.value = [...selectedGroupCols, ...selectedMetricCols].map(
      (c) => {
        const col: any = {
          headerName: c.title || c.key,
          field: c.key,
          flex: 1,
          sortable: true,
        }

        const sortConfig = sortModel.value.find((s) => s.field === c.key)
        if (sortConfig) {
          col.sort = sortConfig.dir
        }
        if (c.key === 'domain') {
          col.cellStyle = { cursor: 'pointer' }
          col.onCellClicked = (params: any) => openDomainLink(params.value)
        }

        if (c.key === 'ctr_traffic_by_prelanding') {
          col.valueFormatter = (params: any) => {
            if (params.value == null) return '0%'
            return `${(params.value * 100).toFixed(2)}%`
          }
        }

        if (
          [
            'supply_impression',
            'all_traffic',
            'traffic_by_prelanding',
          ].includes(c.key)
        ) {
          col.valueFormatter = (params: any) => formatNumber(params.value)
        }

        return col
      }
    )
  }

  const openDomainLink = (domain: string) => {
    if (!domain) return
    const url = `https://${domain}`
    window.open(url, '_blank')
  }

  const formatNumber = (value: number | string) => {
    if (value == null) return '0'
    return Number(value).toLocaleString('en-US')
  }

  const updateDate = (date: string[]) => {
    filter.value.start_date = date[0]
    filter.value.end_date = date[1]
  }

  const updateDateRange = (value: DATE_RANGE) => {
    dateRange.value = value
  }

  const updateTimezone = (tz: string) => {
    timezone.value = tz
  }

  const resetTzDefault = () => {
    timezone.value = 'UTC'
  }

  const toggleAllMetrics = () => {
    const allKeys = metricsColumn.value.map((c) => c.key)
    const isAllSelected = allKeys.every((key) =>
      listMetricsColumnAccepted.value.includes(key)
    )

    listMetricsColumnAccepted.value = isAllSelected ? [] : allKeys
  }

  const onUpdateReport = async () => {
    try {
      isFetchingReport.value = true
      const payload = {
        filter: filter.value,
        time_interval: timeInterval.value,
        timezone: timezone.value,
        type: 'table',
        page: pagination.value.page,
        size: pagination.value.size,
        dateRange: dateRange.value,
        cols: listMetricsColumnAccepted.value,
        group_by: listGroupByColumnAccepted.value,
        sort: sortModel.value,
      }
      const result = await ctr_report_supply_keyword.ReportSupplyKeyword(
        payload
      )
      if (result?.status) {
        applySelectedColumns()
        dataReportTable.value = result.data.items || []
        pagination.value.total = result.data.recordsTotal || 0
      } else {
        dataReportTable.value = []
        pagination.value.total = 0
      }
    } finally {
      isFetchingReport.value = false
    }
  }

  const handlePageChange = (page: number) => {
    pagination.value.page = page
    onUpdateReport()
  }

  const handlePageSizeChange = (size: number) => {
    pagination.value.size = size
    pagination.value.page = 1
    onUpdateReport()
  }

  return {
    isFetchingReport,
    isColumnDisplay,
    isGroupBy,
    filter,
    timezone,
    timeInterval,
    pagination,
    dateRange,
    metricsColumn,
    listMetricsColumnAccepted,
    groupByColumn,
    listGroupByColumnAccepted,
    gridOptions,
    columnDefs,
    dataReportTable,

    pageCount,
    defaultColDef,

    onGridReady,
    handleSortChanged,
    updateDate,
    updateDateRange,
    updateTimezone,
    resetTzDefault,
    toggleAllMetrics,
    onUpdateReport,
    handlePageChange,
    handlePageSizeChange,
  }
})
