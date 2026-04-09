import {
  ALIGN_FORMATTER,
  CHART_TYPE,
  COLOR_FORMATTER,
  TypeFormatter,
} from '@/enum/report-v2'
import { SelectOption } from 'naive-ui'

export interface filterType {
  status?: string[]
  delivery_status?: string[]
  start_date?: string
  end_date?: string
  campaigns?: number[]
  traffic_source?: string[]
  demand_source?: string[]
  section_id?: string[]
  publisher?: number[]
  manager?: number[]
  account_demand_id?: number[]
  account_supply_id?: number[]
  ad_account?: string[]
  landing_page_id?: number[]
  geo?: string[]
  keyword_set_id?: number[]
  domain?: string[]
  label?: number[]
  layout_id?: number[]
  created_by?: string | null
  account_cp?: string | null
  promotion_status?: string[]
  pixel?: number[]
  category?: string[]
  tag?: string[]
}
export interface sortType {
  field: string
  dir: string
}
export interface reportChartType {
  title: string
  xAxis: any[]
  series: {}
  comparison: {} | null
}

export interface reportSettings {
  changeCompare: boolean
  autoUpdate: boolean
  pageSize: number
  campaignViewMode: boolean
  saveLastView: boolean
  selectBox: boolean
  widthOfChart: number
  defaultSortDate: boolean
  CampDownLoadJson: boolean
  accountByProfile?: boolean
  dateOpen: string
}

export interface DataLoadChart {
  [key: string]: {
    colSelected: { column: string[]; spline: string[] }
  }
}

export class ReportPermission {
  export: boolean = false
  chartCustom: boolean = false
  dateBonus: SelectOption[] = []
  note?: boolean
  autoProfile?: boolean
  special?: boolean

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }
}

class ClientFilterData {
  loading: boolean = false
  options: SelectOption[] = []

  search: boolean = false //Cở đánh dấu vừa search xong để khi blur get lại list options ko cache chỗ search

  constructor() {}
}

export class ReportFilterStateManager {
  State: { [key: string]: ClientFilterData } = {}

  constructor() {}

  NewState(key: string) {
    this.State[key] = new ClientFilterData()
  }
}

export class ReportFilterOpts {
  filter: FilterOpts[] = []

  loading: boolean = false

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  changeData(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }
}

export interface FilterOpts {
  key: string

  url?: string
  method?: string
  name?: string
  'label-field'?: string
  'value-field'?: string
  multiple?: boolean
  clearable?: boolean

  options?: SelectOption[]
  client?: boolean
  dataField?: string
  payload?: string
  documentTitle?: boolean
  all?: boolean
}

export class ReportOpts {
  filter?: string
  col?: string
  table?: string
  profile?: boolean
  orderBy?: SelectOption[]
  groupBy?: SelectOption[]
  constructor(obj?: any) {
    if (obj) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          this[key as keyof this] = obj[key]
        }
      }
    }
  }

  hasFilter(): boolean {
    return this.filter ? true : false
  }
  isReportCampPreview(): boolean {
    return this.col === '/report/cols-campaign-preview'
  }
}

export class ReportColumn {
  key?: string
  title?: string
  headerTooltip?: string
  type?: TypeFormatter
  metric?: boolean
  info?: boolean
  group?: boolean
  symbol?: string
  leftSymbol?: boolean
  precision?: number
  realtime?: boolean
  color?: COLOR_FORMATTER
  align?: ALIGN_FORMATTER
  sortDisabled?: boolean
  active?: string[]
  zombies?: string[] //auto on/off
  aOff?: string[] //auto off
  hideCol?: boolean
  maxWidth?: number

  isBottom?: boolean //để lấy data ở row total
  defaultOn?: boolean
  defaultOff?: boolean

  cColor?: string //chart color
  cType?: CHART_TYPE //chart type
  format?: string
  percentByMetric?: string
  tooltipPercentByMetric?: string

  cssClass?: string
  chartEx?: string //Ko hiển thị ở chart
  groupYAxis?: string
  condition?: string
  notification?: boolean //để hiển thị thông báo

  action?: string

  constructor(obj?: any) {
    if (obj) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          this[key as keyof this] = obj[key]
        }
      }
    }
  }

  InitDefault() {
    switch (this.type) {
      case TypeFormatter.TypeMoney:
        if (!this.leftSymbol) this.leftSymbol = true
        if (!this.symbol) this.symbol = '$'
        if (!this.metric) this.metric = true
        if (!this.precision) this.precision = 2
        break

      case TypeFormatter.TypePercent:
        if (!this.symbol) this.symbol = '%'
        if (!this.metric) this.metric = true
        if (!this.precision) this.precision = 2
        break

      case TypeFormatter.TypeNumber:
        if (!this.metric) this.metric = true
        if (!this.precision) this.precision = 0
        break
    }
  }

  IsHasColor() {
    return this.color ? true : false
  }

  ClassColor(isNegative: boolean) {
    if (!this.IsHasColor()) return ''
    if (this.IsColorDefault()) {
      return isNegative ? 'text-red-500' : 'text-green-700'
    }

    if (this.IsColorV2()) {
      return isNegative ? 'text-green-700' : 'text-red-500'
    }

    return ''
  }

  IsColorDefault() {
    return this.color === COLOR_FORMATTER.ColorDefault
  }

  IsColorV2() {
    return this.color === COLOR_FORMATTER.ColorVer2
  }
  IsColorV3() {
    return this.color === COLOR_FORMATTER.ColorVer3
  }

  IsMetric() {
    return this.metric ? true : false
  }

  IsGroup() {
    return this.group ? true : false
  }

  IsRealTime() {
    return this.realtime || this.key?.includes('_rt') ? true : false
  }

  KeyFormat() {
    //ưu tiên lấy format
    let k = this?.format || this?.key

    return k
  }

  IsConditionMustGoogleTaboolaCampaign() {
    return this.condition === '__ts1'
  }

  IsConditionMustGoogleTaboola() {
    return this.condition === '__ts3'
  }

  IsConditionMustTaboolaSection() {
    return this.condition === '__ts2'
  }
}
