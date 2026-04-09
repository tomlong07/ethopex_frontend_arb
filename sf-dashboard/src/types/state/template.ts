import { SelectOption } from 'naive-ui'
import { ColumnItem } from './general'

export interface FilterItem {
  label: string
  key: string
  aliasKey?: string
  multiple: boolean
  input?: boolean
  type?: string
  options: SelectOption[]
  clientFilter: boolean
  custom?: boolean
  alone?: any
  ajax?: string
  customValue?: string
  customLabel?: string
  mode?: string
  post?: boolean
  uncategorized?: boolean
  filterColor?: boolean
  oneValue?: boolean
  responseField?: string
  payload?: string
}

export interface ResponseFilters {
  filters?: FilterItem[]
  datePicker?: string
  datePickerMonth?: string
  defaultYesterday?: boolean
  defaultAllTime?: boolean
  instantUpdate?: boolean
}

interface ViewModelItem {
  name?: string
  key?: string
  default?: boolean
}

export interface ResponseConfigs {
  offSearch?: boolean
  offUpdate?: boolean
  serverSideRender?: boolean
  hasPayloadKey?: boolean
  addButtonType?: string
  preload?: string[]
  download?: string
  downloadType?: string
  autoSize?: boolean
  pageSize?: number
  rowHeight?: number
  searchInFilter?: boolean
  offMultipleSelectRow?: boolean
  sortDefault?: string
  prop?: string
  ajax?: string
  viewModel?: ViewModelItem[]
  tabInfo?: TabInfo[]
  lazyLoad?: LazyLoadItem
  modalType?: string[]
  loadGridApi?: boolean

  moreInfo?: MoreInfoItem[]
  moreInfoProp?: string
  downloadButton?: string
  featureButton?: string
  queryDefault?: Record<string, QueryDefaultItem>
  tabRadio?: boolean
  defaultPayload?: Record<string, any>

  addURLV2?: string
  addNameV2?: string
  offAdd?: boolean
  url?: string
  backMaps?: BackMaps[]

  totalField?: string
  offTotalShow?: boolean
  colV2?: string
  offOrder?: boolean
  plusInfo?: string
  enableCheckbox?: boolean
}
export interface BackMaps {
  name: string
  query: string
  url: string
  current: boolean
}
interface QueryDefaultItem {
  value: any
  multiple?: boolean
  number?: boolean
}

export interface ResponseAsyncConfigs {
  actionBlackList?: string
  resetAllDomain?: string

  syncButton?: string

  themeVersion?: string
  performanceButton?: string
  clearPreview?: string
  generalAccount?: boolean
  addAccounts?: AddAccountStruct[]

  setGlobal?: boolean
}

export interface AddAccountStruct {
  url: string
  name: string
  icon: string
  text: string
  target?: string
}

export interface MoreInfoItem {
  key: string
  name: string
  default?: boolean
  type?: string
  color?: string
  ajax?: string
}

export interface LazyLoadInput {
  key: string
  type: string
  base?: string
  response?: string
}

export interface LazyLoadItem {
  ajax: string
  fields: string[]
  inputs: LazyLoadInput[]
}

export interface TabInfo {
  key: string
  name: string
  logo?: string
  defaultInfo?: { key: string; value: any }
  active?: boolean
}

export interface ResponseColumns {
  columns?: ColumnItem[]
  all?: boolean
  instantUpdateGroup?: boolean
  fixedWidth?: string
  highlight?: Record<string, any[]>
}
