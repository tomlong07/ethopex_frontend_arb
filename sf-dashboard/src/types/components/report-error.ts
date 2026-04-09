import date2 from '@/utils/date2'

export interface SelectFilter {
  campaigns: string[]
  geo: string[]
  traffic_source: string[]
  demand_source: string[]
  user_id: string[]
  section: string[]
  device: string[]
}

export interface PayloadReportError {
  startDate: string
  endDate: string
  timeZone: string
  time_interval?: string
  target_dimension?: string
  selects?: SelectFilter
  top?: number
  orderBy?: string
}

export interface ChartSeries {
  total_error_count?: number[]
  error_page_1?: number[]
  error_page_2?: number[]
  rate_error_page_1?: number[]
  rate_error_page_2?: number[]
  [key: string]: number[] | undefined
}

export interface ProcessedChartData {
  xAxis: string[]
  series: ChartSeries
}

export interface TransformedDataItem {
  time: string
  total_error_count: number
  error_page_1: number
  error_page_2: number
  rate_error_page_1?: number
  rate_error_page_2?: number
}

export interface TransformedDataSrc {
  items: TransformedDataItem[]
}
export class ReportErrSettings {
  showTable: boolean = true
  showChart: boolean = true
  widthOfTable: number = 50

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (element !== undefined && element !== null) {
            this[key as keyof this] = element
          }
        }
      }
    }
  }

  isDisplayTable(): boolean {
    return this.showTable
  }

  isDisplayChart(): boolean {
    return this.showChart
  }

  isDisplayBoth(): boolean {
    return this.showTable && this.showChart
  }
}

export class ReportErrParams {
  topValue: number = 10
  orderBy: string = 'revenue'
  interval: string = 'day'
  timeZone: string = 'UTC'
  startDate: string = date2.today()
  endDate: string = date2.today()
  defaultDemension: string[] = [
    'landing_page',
    'campaign',
    'domain',
    'category',
    'country',
    'traffic_source',
  ]

  selectDropList: { [key: string]: any } = {
    campaign: 'All',
    geo: 'All',
    traffic_source: 'All',
    demand_source: 'All',
    user_id: 'All',
    section: 'All',
    device: 'All',
  }

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (element !== undefined && element !== null) {
            this[key as keyof this] = element
          }
        }
      }
    }
  }
  setDefaultParams = () => {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
      interval: this.interval,
      timeZone: this.timeZone,
      orderBy: this.orderBy,
      topValue: this.topValue,
      defaultDimension: this.defaultDemension,
      selectDropList: this.selectDropList,
    }
  }
}
