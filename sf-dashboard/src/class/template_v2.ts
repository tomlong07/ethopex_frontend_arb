import { RightAlignTypes } from '@/constants/templates'

export class ActionInfoV2 {
  url?: string
  action?: string
  title?: string
  icon?: string
  replace?: string
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

export class ColumnItemV2 {
  field: string = ''
  aliasKey?: string
  headerName?: string
  headerTooltip?: string
  headerComponentParams?: object
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
  //   valueFormatter?: string | ValueFormatterFunc<any, any, any>
  activeByGroup?: boolean
  //   comparator?: (
  //     valueA: any,
  //     valueB: any,
  //     nodeA: any,
  //     nodeB: any,
  //     isDescending: boolean
  //   ) => number

  title?: string
  //   headerComponent?: Component
  //   tooltipComponent?: Component
  copy?: boolean
  action?: string
  action2?: string
  replace?: string
  format?: string

  checkboxSelection?: boolean
  headerCheckboxSelection?: boolean
  compareShowCol?: string
  defaultOff?: boolean
  isGroup?: boolean
  disable?: boolean
  editable?: boolean
  params?: boolean
  offCapitalize?: boolean

  actionInfo?: ActionInfoV2[]
  autoHeight?: boolean
  notShowEmpty?: boolean
  modal?: boolean
  decimal?: number
  condition?: boolean
  right?: boolean
  options?: Array<{
    label: string
    value: string | number
    style?: Record<string, any>
  }>

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          switch (key) {
            case 'actionInfo':
              this[key as keyof this] = element.map(
                (item: any) => new ActionInfoV2(item)
              )
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }
  }

  Type() {
    if (this.right || (this.format && RightAlignTypes.includes(this.format))) {
      return 'rightAligned'
    }
    return
  }

  IsHeaderRealTime() {
    return this.headerName?.includes('RT') || false
  }

  HeaderRealTime() {
    return this.headerName?.replace('RT', '').trim() || ''
  }
}

export class ResponseColumnsV2 {
  columns?: ColumnItemV2[]
  all?: boolean
  instantUpdateGroup?: boolean
  fixedWidth?: string
  highlight?: Record<string, any[]>

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          switch (key) {
            case 'columns':
              this[key as keyof this] = element.map(
                (item: any) => new ColumnItemV2(item)
              )
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }
  }
}

export class ViewModelItemV2 {
  name?: string
  key?: string
  default?: boolean

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

export class TabInfoV2 {
  key: string = ''
  name: string = ''
  logo?: string
  defaultInfo?: { key: string; value: any }
  active?: boolean

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

export class LazyLoadItemV2 {
  ajax: string = ''
  fields: string[] = []
  inputs: LazyLoadInputV2[] = []

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          switch (key) {
            case 'inputs':
              this[key as keyof this] = element.map(
                (item: any) => new LazyLoadInputV2(item)
              )
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }
  }
}

export class LazyLoadInputV2 {
  key: string = ''
  type: string = ''
  base?: string
  response?: string

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
type StatusType =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'primary'
  | 'info'

export class MoreInfoItemV2 {
  key: string = ''
  name: string = ''
  default?: boolean
  type?: string
  color?: StatusType
  ajax?: string
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

export class QueryDefaultItemV2 {
  value: any
  multiple?: boolean
  number?: boolean

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

export class BackMapsV2 {
  name: string = ''
  query: string = ''
  url: string = ''
  current: boolean = false

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

export class ResponseConfigsV2 {
  offSearch?: boolean
  offUpdate?: boolean
  serverSideRender?: boolean
  hasPayloadKey?: boolean
  addButtonType?: string
  preload?: string[]
  download?: string
  method?: string
  autoSize?: boolean
  pageSize?: number
  rowHeight?: number
  searchInFilter?: boolean
  offMultipleSelectRow?: boolean
  sortDefault?: string
  prop?: string
  ajax?: string
  viewModel?: ViewModelItemV2[]
  tabInfo?: TabInfoV2[]
  lazyLoadV2?: string
  modalType?: string[]
  loadGridApi?: boolean
  allowViewTemplate?: boolean

  moreInfo?: MoreInfoItemV2[]
  moreInfoProp?: string
  downloadButton?: string
  featureButton?: string
  queryDefault?: Record<string, QueryDefaultItemV2>
  tabRadio?: boolean
  defaultPayload?: Record<string, any>

  addURLV2?: string
  addNameV2?: string
  offAdd?: boolean
  url?: string
  backMaps?: BackMapsV2[]

  totalField?: string
  offTotalShow?: boolean
  colV2?: string
  offOrder?: boolean
  plusInfo?: string
  enableCheckbox?: boolean

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (element === undefined || element === null) continue

          switch (key) {
            case 'viewModel':
              this[key as keyof this] = element.map(
                (item: any) => new ViewModelItemV2(item)
              )
              break
            case 'tabInfo':
              this[key as keyof this] = element.map(
                (item: any) => new TabInfoV2(item)
              )
              break

            case 'moreInfo':
              this[key as keyof this] = element.map(
                (item: any) => new MoreInfoItemV2(item)
              )
              break
            case 'queryDefault':
              const obj: Record<string, QueryDefaultItemV2> = {}
              for (const k in element) {
                if (Object.prototype.hasOwnProperty.call(element, k)) {
                  obj[k] = new QueryDefaultItemV2(element[k])
                }
              }
              this.queryDefault = obj
              break
            case 'backMaps':
              this[key as keyof this] = element.map(
                (item: any) => new BackMapsV2(item)
              )
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }
  }

  AddPageURL(path: string): string {
    if (this.offAdd) return ''
    return this.addURLV2 || path + '/add'
  }

  AjaxAPI() {
    return this.ajax || ''
  }

  IsModalRole() {
    return this.modalType?.includes('role') || false
  }

  IsModalPayment() {
    return this.modalType?.includes('payment') || false
  }

  IsModalAccountAd() {
    return this.modalType?.includes('account_ad') || false
  }

  IsModalAccountAdBulk() {
    return this.modalType?.includes('account_ad_bulk') || false
  }

  IsModalManagerFbBusiness() {
    return this.modalType?.includes('manager_facebook_business') || false
  }

  IsModalAddBonus() {
    return this.modalType?.includes('add_bonus') || false
  }

  IsModalDomainManager() {
    return this.modalType?.includes('domain_manager') || false
  }

  IsModalRecommendation() {
    return this.modalType?.includes('recommendation') || false
  }

  IsModalSatifyPerformance() {
    return this.modalType?.includes('google_performance') || false
  }

  IsModalCrawlKeyword() {
    return this.modalType?.includes('crawl_keyword') || false
  }

  IsModalLandingLink() {
    return this.modalType?.includes('landing_page') || false
  }

  IsModalAssetGroup() {
    return this.modalType?.includes('asset_group') || false
  }

  IsModalUserMd12() {
    return this.modalType?.includes('user_md_12') || false
  }

  IsModalSatisfy() {
    return this.modalType?.includes('satisfy') || false
  }

  IsModalCrawl() {
    return this.modalType?.includes('crawl_modal') || false
  }

  IsModalPromptLog() {
    return this.modalType?.includes('prompt_log_detail') || false
  }

  HasModal() {
    return this.modalType && this.modalType?.length > 0
  }

  HasFeatureButton() {
    return !!this.featureButton
  }

  FeatureTargeting() {
    return this.featureButton === 'targeting' || false
  }

  FeatureAccountAd() {
    return this.featureButton === 'account_ad' || false
  }

  DownloadReportTargeting() {
    return this.downloadButton === 'targeting' || false
  }

  CopyWhiteList() {
    return this.downloadButton === 'whitelist' || false
  }

  HasDownloadButton() {
    return !!this.downloadButton
  }
  IsModalSocialName() {
    return this.modalType?.includes('social_name') || false
  }

  PropTable() {
    return this.prop || 'items'
  }

  PageSizeDefault() {
    return this.pageSize || 50
  }

  IsButtonAddAccount() {
    return this.addButtonType === 'addAccount' || false
  }

  IsButtonAddCamp() {
    return this.addButtonType === 'addCamp' || false
  }

  ServerSide() {
    return this.serverSideRender || false
  }

  ClientSide() {
    return !this.ServerSide()
  }

  HasPreload() {
    return this.preload?.length
  }

  PreloadLayout() {
    return this.preload?.includes('layouts') || false
  }

  PreloadRole() {
    return this.preload?.includes('roles/pre-create') || false
  }

  PreloadCategory() {
    return this.preload?.includes('category')
  }

  PreloadTrafficSource() {
    return this.preload?.includes('traffic_source') || false
  }

  PreloadDemandSource() {
    return this.preload?.includes('demand_source') || false
  }

  PreloadProfile() {
    return this.preload?.includes('profile') || false
  }

  PreloadRuleType() {
    return this.preload?.includes('rule_type') || false
  }

  PreloadCreativeType() {
    return this.preload?.includes('cre_type') || false
  }

  PreloadInterval() {
    return this.preload?.includes('interval') || false
  }

  IsHasDownload() {
    return !!this.download
  }

  IsDownloadFollowTable() {
    return this.download === '1'
  }

  IsDownloadAssetGroup() {
    return this.download === 'asset_group'
  }

  HasUpdateButton() {
    return !this.offUpdate
  }

  HasSearch() {
    return !this.offSearch
  }

  HasCheckBox() {
    return !!this.enableCheckbox
  }
}
