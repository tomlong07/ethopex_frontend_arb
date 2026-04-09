import { ONOFF } from '@/enum/campaign'
import { SelectOption } from 'naive-ui'

interface base {
  name?: string
  status: string
}

interface adsenseAccountConfigBase extends base {
  gam_id: string
  pub_id: string
  api_key: string
  generation?: string
  layout_config: layoutWrapper
  position?: PositionConfig
}

interface PositionDetail {
  status: ONOFF
  top: number
  bottom: number
}

interface PositionConfig {
  mobile: PositionDetail[]
  desktop: PositionDetail[]
}

export interface adsenseAccountConfigInput extends adsenseAccountConfigBase {
  channels: string
}

export interface adsenseAccountConfigPayload extends adsenseAccountConfigBase {
  channels: string[]
}

export interface domainManagerConfigType extends base {
  domain: string
  adsense_accounts: number[]
  config: string
  adsense_content_arb: string | undefined
  gam_id: string
  id: number
  labels: string[]
  type?: string[]
  brand_id?: number
  custom_ads_txt?: string
  logo?: string
}

interface layoutWrapper {
  s2s: layOutConfigType[]
  n2s: layOutConfigType[]
}

export interface layOutConfigType {
  status: string | null
  layout: number | null
  style_id: string
  type: string
  traffic_source: string
}

export interface reCapchaConfigType {
  id?: number
  public_key: string
  secret_key: string
  domains: string[]
  email: string
  disabled?: boolean
}

export interface recapchaAPIType {
  publicKey: string
  limitTime: number
}

export interface HeaderKeywordSetType {
  name: string
  width: string
  offSort?: boolean
  dataType?: string
  key?: string
}

export interface DateTimeType {
  startDate: string
  endDate: string
}

export interface ByDimensionSettings {
  settingTop?: SettingTop
  settingSelect?: SettingSelect
  settingMetric?: SettingMetric
  info?: InfoData[]
}

export interface DimensionMetricSettings {
  auto?: string[]
  show?: string[]
  filter?: string[]
  fixedInterval?: string
  offOrder?: boolean
  fixedTop?: number
  fixedOrder?: SelectOption[]
  sortData?: string
  prop?: string
  defaultOrderBy?: string
}

interface SettingTop {
  date?: string
  interval?: InfoData[]
  timeZone?: string
}

interface SettingSelect {
  selects?: string[]
  dimensions?: string[]
  defaultDimension?: string
  metricsByDimension?: { [key: string]: DimensionMetricSettings }
}

interface SettingMetric {
  metrics?: string[]
  defaultMetrics?: string[]
}

export interface InfoData extends IdName, ChartData {
  top?: number
  type?: string
  default?: boolean
  decimal?: number
  ajax?: string
  method?: string
  remote?: boolean
  multiple?: boolean
  isNumber?: boolean
  debug?: boolean
  class?: string
}

interface IdName {
  id: string
  name: string
}

interface ChartData {
  chart: string
  color: string
  yAxis: number
}

export interface PayloadDimension {
  startDate: string
  endDate: string
  interval: string
  timeZone: string
  metrics?: string[]
  dimensions?: string[]
  selects?: { [key: string]: any }
  debug?: boolean
}

export interface FilterType {
  item: string
  index: number
  q?: string
  loadingSearch?: boolean
  loading?: boolean
  first?: boolean
}
