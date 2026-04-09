import {
  CheckboxSelectionCallback,
  ColDef,
  HeaderCheckboxSelectionCallback,
  ValueFormatterFunc,
} from 'ag-grid-community'

interface menuNewType {
  quickLogin?: string
  host?: string
  is_root?: boolean
  isDev?: boolean
  __pub?: boolean
  __com?: boolean
  autoUpdate?: boolean
  email?: string
  hj?: boolean
  cla?: string
  userName?: string
  userId?: number
  menu?: string
  layout?: string

  modeSettings?: string
  notify?: Record<string, string>
}

export interface menuNew extends menuNewType {
  title?: string
  name?: string
  key?: string
  url?: string
  show?: boolean
  href?: string
  profile?: boolean
  notHomePage?: boolean
  component?: string
  children?: menuNew[]
  keepAlive?: boolean
  renderIcon?: string
  activeMenu?: string

  parentId?: string
}

export interface LazyLoadItem {
  ajax: string
  fields: string[]
  inputs: LazyLoadInput[]
}

export interface LazyLoadInput {
  key: string
  type: string
  base?: string
  response?: string
}

export interface MoreInfoItem {
  key: string
  name: string
  default?: boolean
  type?: string
  color?: string
}

export interface ViewModelItem {
  key: string
  name?: string
  default?: boolean
}

export interface ColumnItem extends ColDef {
  field: string
  aliasKey?: string
  headerName?: string
  headerTooltip?: string
  headerComponentParams?: object
  type?: string
  link?: string
  width?: number
  sortable?: boolean
  sort?: 'asc' | 'desc' | null
  minWidth?: number
  flex?: number
  pinned?: 'left' | 'right' | boolean
  rightAlign?: string
  // children?: ColumnItem[];
  cellRenderer?: any
  cellRendererParams?: any
  valueFormatter?: string | ValueFormatterFunc<any, any, any>
  activeByGroup?: boolean
  comparator?: (
    valueA: any,
    valueB: any,
    nodeA: any,
    nodeB: any,
    isDescending: boolean
  ) => number

  tooltip?: string
  title?: string
  headerComponent?: Component
  tooltipComponent?: Component
  copy?: boolean
  duplicate?: boolean
  action?: string
  action2?: string
  replace?: string
  format?: string

  checkboxSelection?: boolean | CheckboxSelectionCallback<any, any, any>
  headerCheckboxSelection?:
    | boolean
    | HeaderCheckboxSelectionCallback<any, any, any>
  compareShowCol?: string
  defaultOff?: boolean
  isGroup?: boolean
  disable?: boolean
  editable?: boolean
  params?: boolean
  offCapitalize?: boolean

  actionInfo?: ActionInfo[]
  autoHeight?: boolean
  notShowEmpty?: boolean
  modal?: boolean
  decimal?: number
  condition?: boolean
  right?: boolean
}

export interface ActionInfo {
  url?: string
  action?: string
  title?: string
  icon: string
  aTag?: boolean
  delete?: boolean
  clone?: boolean
  copy?: boolean
  campaign_type?: boolean

  condition?: string
  accepts?: string[]
  campaign_type_accepts?: string[]
  plusCondition?: string[]
  plusQuery?: string
}
