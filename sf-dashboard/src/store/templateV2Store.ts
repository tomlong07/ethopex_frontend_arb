import {
  CellFormaterV2,
  CellRenderParamsV2,
  TooltipTemplateV2,
} from '@/aggrid/cellv2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import storage from '@/plugins/storage'

import { ctr_user } from '@/services/ctr_user'

import ctr_asset_group from '@/services/ctr_asset_group'
import {
  FilterItem,
  ResponseAsyncConfigs,
  ResponseFilters,
} from '@/types/state/template'
import { SortTable } from '@/types/state/template-v2'
import date2 from '@/utils/date2'
import icons from '@/utils/icons'
import { ColDef, GridApi, SortDirection } from 'ag-grid-community'
import { AxiosRequestConfig } from 'axios'
import { NIcon, SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import ctr_demand_source from '@/services/ctr_demand_source'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { general } from '@/services/general'
import { ctr_rule } from '@/services/ctr_rule'
import { ctr_filter } from '@/services/ctr_filter'
import { ctr_table_settings } from '@/services/ctr_table_settings'
import { StatusList } from '@/options/domain_manager'
import { ctr_order_column } from '@/services/ctr_order_column'
import {
  ColumnItemV2,
  ResponseColumnsV2,
  ResponseConfigsV2,
} from '@/class/template_v2'
import { exportToExcel } from '@/utils/export-excel'
import LinkFromAPI from '@/components/campaign/cell/LinkFromAPI.vue'
import useGeneralStore from '@/store/useGeneralStore'
import useNotifySystem from './details/useNotifySystem'

export const useTemplateV2 = (path: string) =>
  defineStore(`useTemplateV2${path}`, () => {
    const idTable = 'table_' + path.replaceAll('/', '_')

    const baseConfigs = ref<ResponseConfigsV2>(new ResponseConfigsV2())
    const asyncConfigs = ref<ResponseAsyncConfigs>({})
    const filterConfigs = ref<ResponseFilters>({})
    const columnConfigs = ref<ResponseColumnsV2>(new ResponseColumnsV2())

    const loadingColumns = ref<boolean>(true)
    const componentMap = ref<any>(undefined)

    const filterList = ref<{ [key: string]: any }>({})
    const filterOptions = ref<Record<string, SelectOption[]>>({})
    const baseOptions = ref<Record<string, SelectOption[]>>({})

    const prefetchDone = ref<boolean>(false)

    const search = ref<string>('')

    const pageSizeNow = ref<number>(1)
    const pageNow = ref<number>(1)

    const columnSettings = ref<string[]>([])

    const initTableV2 = ref<number | null>(null)

    const isFetching = ref<boolean>(true)

    const reAssignColumns = ref<number>(0) //Sử dụng để gán lại columns, trường hợp async columns bị chậm

    const initDownloadV2 = ref<number | null>(null)
    const isDownloading = ref<boolean>(false)

    const sortInfoV2 = ref<SortTable>(new SortTable())

    const plkInfo = ref<any>()

    const viewModelNow = ref<string | undefined>(undefined)

    const rawDataV2 = ref<any>(null)

    const groupByV2 = ref<string[]>([])
    const groupByV2Update = ref<string[]>([])

    const stopWatch = ref<any>(null)

    const itemSelectedV2 = ref<any[]>([])
    const isSelectAll = ref<boolean>(false)
    const showSelectedAlert = ref<boolean>(true)

    const gridApiV2 = ref<GridApi | null>(null)

    const gridAlive = ref<boolean>(false)

    const allowInstant = ref<boolean>(false)

    const customFilterV2 = ref<Record<string, any>>({})

    const controllerV2 = ref<AbortController | null>(null)

    const lazyControllerV2 = ref<AbortController | null>(null)

    const trafficOptions = ref<SelectOption[]>([])
    const demandOptions = ref<SelectOption[]>([])
    const profileOptions = ref<any[]>([])
    const ruleTypeOptions = ref<SelectOption[]>([])
    const creativeTypeOptions = ref<SelectOption[]>([])

    const defaultView = ref<any | null>(null)

    const totalItems = computed(() => {
      const totalField = baseConfigs.value.totalField
      const data = rawDataV2.value || {}

      return totalField
        ? data[totalField] ?? 0
        : data.records_total ?? data.recordsTotal ?? 0
    })

    const backRouter = computed(() => {
      const hasQueries =
        baseConfigs.value.backMaps?.filter(
          (el) => window.route.query[el.query]
        ) || []

      if (!hasQueries.length) return []

      return hasQueries.concat(
        baseConfigs.value.backMaps?.filter((el) => el.current) || []
      )
    })

    const profileShow = computed(() => {
      return profileOptions.value.map(({ id, name }) => ({
        value: id,
        label: name,
      }))
    })

    const trafficOptionAccept = computed(() => {
      return trafficOptions.value.map((item) => item.value)
    })

    const addUrlNow = computed(() => {
      return baseConfigs.value.AddPageURL(path)
    })

    const nameAddNow = computed(() => {
      if (!addUrlNow.value) return ''

      if (baseConfigs.value.addNameV2) return baseConfigs.value.addNameV2

      let name = ''

      try {
        const arrName = addUrlNow.value
          ?.replaceAll(/add|\/+/g, '')
          .split(/[-_]/)
        name = arrName.map(helper.capitalizeFirstLetter).join(' ')
      } catch (error) {
        console.error(error)
      }

      return 'Add ' + (name || 'New')
    })

    const hasFeatureButton = computed(() => {
      return (
        asyncConfigs.value.syncButton ||
        asyncConfigs.value.actionBlackList ||
        asyncConfigs.value.resetAllDomain ||
        asyncConfigs.value.clearPreview
      )
    })

    const onMultipleSelectRow = computed(() => {
      return !baseConfigs.value.offMultipleSelectRow
    })

    const columnsHasCopy = computed(() => {
      return (
        columnConfigs.value.columns
          ?.filter((element) => {
            return element.copy
          })
          .map((element) => {
            return element.field
          }) || []
      )
    })

    const isHasBoxFilter = computed(() => {
      return (
        filterConfigs.value.filters?.length ||
        baseConfigs.value.HasSearch() ||
        baseConfigs.value.HasUpdateButton()
      )
    })

    const datePicker = computed(() => {
      return {
        hasDatePicker:
          (filterConfigs.value.datePicker &&
            filterConfigs.value.datePicker !== '') ||
          false,
        isDefault: filterConfigs.value.datePicker === 'default' || false,
        isThisMonth: filterConfigs.value.datePicker === 'this_month' || false,
        isSingleMonth: filterConfigs.value.datePicker === 'month' || false,
        isMultiMonth: filterConfigs.value.datePicker === 'multimonth' || false,
      }
    })

    const aliasColumns = computed(() => {
      let obj: { [key: string]: string } = {}
      if (columnConfigs.value.columns?.length) {
        columnConfigs.value.columns?.forEach((element) => {
          if (element.aliasKey) obj[element.field] = element.aliasKey
        })
      }

      return obj
    })

    const aliasFilters = computed(() => {
      const obj: { [key: string]: string } = {}
      if (filterConfigs.value.filters?.length) {
        filterConfigs.value.filters?.forEach((element) => {
          if (element.aliasKey) obj[element.key] = element.aliasKey
        })
      }

      return obj
    })

    const columnsAccept = computed(() => {
      return columnConfigs.value.columns?.map((col) => col.field) ?? []
    })

    const columns = computed(() => {
      let colsItems = [] as ColDef[]
      if (columnConfigs.value.columns?.length) {
        columnConfigs.value.columns.forEach((element) => {
          element = new ColumnItemV2(element)
          if (element.modal) return
          const col = { field: element.field } as ColDef

          col.cellRendererParams = {
            isGroup: element.isGroup, // Prop tùy chỉnh
            baseType: element.field,
            baseColV2: baseConfigs.value.colV2,
          }

          if (element.headerName) {
            //nếu tên chứa RT thì thay bằng icon realtime
            if (element.IsHeaderRealTime()) {
              col.headerName = element.HeaderRealTime()
              col.headerComponentParams = {
                template: TooltipTemplateV2(
                  element.HeaderRealTime(),
                  element.Type()
                ),
              }
            } else {
              col.headerName = element.headerName
            }
          }

          if (element.width) col.width = element.width

          if (element.sortable) col.sortable = element.sortable

          if (element.sort) col.sort = element.sort

          if (element.minWidth) col.minWidth = element.minWidth

          if (element.flex) col.flex = element.flex

          if (element.pinned) col.pinned = element.pinned

          if (element.editable) col.editable = element.editable

          if (element.autoHeight) col.autoHeight = element.autoHeight

          if (baseConfigs.value.ServerSide()) {
            col.comparator = () => {
              return 0
            }
          }

          if (element.title) {
            col.headerTooltip = element.title
            col.headerComponent = defineComponent({
              setup(props: any) {
                const sortIcon = ref<string | null>(null)
                // Hàm cập nhật icon
                const updateSortIcon = () => {
                  const sortState = props.params.column.getSort()
                  if (sortState === 'asc') {
                    sortIcon.value = icons.sortascaggrid()
                  } else if (sortState === 'desc') {
                    sortIcon.value = icons.sortdescaggrid()
                  } else {
                    sortIcon.value = null // Không có sort
                  }
                }

                // Cập nhật ngay khi component được mount
                updateSortIcon()

                // Lắng nghe sự kiện sort thay đổi
                onMounted(() => {
                  props.params.column.addEventListener(
                    'sortChanged',
                    updateSortIcon
                  )
                })

                return () =>
                  h(
                    'div',
                    {
                      onClick: props.params.progressSort,

                      class: 'flex items-center gap-2 ml-auto',
                    },
                    [
                      sortIcon.value
                        ? h('span', { innerHTML: sortIcon.value }) // Render trực tiếp SVG sắp xếp
                        : null,
                      h('span', {}, props.params.displayName || 'N/A'),
                      h(NIcon, { component: QuestionCircleRegular, size: 12 }),
                    ]
                  )
              },
            })
          }

          if (
            (baseConfigs.value.colV2 || baseConfigs.value.AjaxAPI()) &&
            componentMap.value
          ) {
            const cellNow = componentMap.value(element)
            if (cellNow) col.cellRenderer = cellNow
          }

          const cellParams = CellRenderParamsV2(element)

          if (cellParams) col.cellRendererParams = cellParams

          const formatterV2 = CellFormaterV2(element)
          if (formatterV2) col.valueFormatter = formatterV2

          col.type = element.Type()

          if (element.link && !element.params) {
            col.cellRenderer = LinkFromAPI
            if (col.cellRendererParams) {
              col.cellRendererParams.columnConfig = { link: element.link }
            } else {
              col.cellRendererParams = { columnConfig: { link: element.link } }
            }
          }
          colsItems.push(col)
        })
      }

      return colsItems
    })

    const groupBy = computed(() => {
      const colsItems = [] as ColumnItemV2[]

      if (columnConfigs.value.columns?.length) {
        columnConfigs.value.columns?.forEach((element) => {
          if (!element.isGroup) {
            return
          }
          colsItems.push(element)
        })
      }

      return colsItems
    })

    const reInitTable = () => {
      initTableV2.value = Date.now()
    }

    const downloadTableNow = () => {
      initDownloadV2.value = Date.now()
    }

    const fetchPermissionFilters = async () => {
      const result = await ctr_permission_settings.PermissionFilters(path)

      filterConfigs.value = result.data?.options || {}

      initDefaultFilters()
    }

    const fetchPermissionConfigs = async () => {
      const result = await ctr_permission_settings.PermissionConfigs(path)

      baseConfigs.value = new ResponseConfigsV2(result.data || {})

      pageSizeNow.value = baseConfigs.value.PageSizeDefault()
    }

    const fetchPermissionColumns = async () => {
      loadingColumns.value = true
      const result = await ctr_permission_settings.PermissionColumns(path)

      columnConfigs.value = new ResponseColumnsV2(result.data?.options || {})

      loadingColumns.value = false
    }

    const fetchPermissionAsyncConfigs = async () => {
      const result = await ctr_permission_settings.PermissionAsync(path)

      asyncConfigs.value = result.data || {}
    }

    const initDefaultFilters = () => {
      filterConfigs.value.filters?.forEach((element) => {
        filterOptions.value[element.key] = []
        baseOptions.value[element.key] = []

        if (element.multiple) {
          filterList.value[element.key] = []
        } else {
          filterList.value[element.key] = null
        }
      })

      switch (true) {
        case datePicker.value.isDefault:
          switch (true) {
            case filterConfigs.value.defaultAllTime:
              filterList.value['start_date'] = date2.allTime()
              filterList.value['end_date'] = date2.today()
              break

            case filterConfigs.value.defaultYesterday:
              filterList.value['start_date'] = date2.yesterday()
              filterList.value['end_date'] = date2.yesterday()
              break

            default:
              filterList.value['start_date'] = date2.today()
              filterList.value['end_date'] = date2.today()
              break
          }

          break

        case datePicker.value.isThisMonth:
          filterList.value['start_date'] = date2.startMonth()
          filterList.value['end_date'] = date2.endMonth()
          break

        case datePicker.value.isSingleMonth:
          filterList.value['month'] = date2.startMonth()

        case datePicker.value.isMultiMonth:
          if (filterConfigs.value.defaultAllTime) {
            filterList.value['start_month'] = date2.allTime()
            filterList.value['end_month'] = date2.endMonth()
            break
          }

          filterList.value['start_month'] = date2.startMonth()
          filterList.value['end_month'] = date2.endMonth()

          break
        default:
          break
      }
    }

    const changeSortInfo = (field: string, dir: SortDirection = null) => {
      sortInfoV2.value.field = field
      if (dir) sortInfoV2.value.dir = dir
    }

    const prefetchAfterRun = () => {
      prefetchDone.value = true

      changeSortInfo(baseConfigs.value.sortDefault || '')

      if (baseConfigs.value.viewModel?.length) {
        for (
          let index = 0;
          index < baseConfigs.value.viewModel.length;
          index++
        ) {
          if (baseConfigs.value.viewModel[index].default) {
            viewModelNow.value = baseConfigs.value.viewModel[index].key
            break
          }
        }
      }

      if (columnConfigs.value.columns?.length) {
        groupByV2.value = []

        columnConfigs.value.columns.forEach((e) => {
          if (!e.isGroup || e.defaultOff) return

          groupByV2.value.push(e.field)
        })

        //Sử dụng để tránh trường hợp cell reactive ngay sau khi update groupBy (nó sẽ đc cập nhật khi update table)
        groupByV2Update.value = helper.clone(groupByV2.value)
      }

      defaultView.value = {
        filterList: helper.clone(filterList.value),
        columnSettings: helper.clone(columnSettings.value),
        groupByV2: helper.clone(groupByV2.value),
        groupByV2Update: helper.clone(groupByV2Update.value),
        customFilterV2: helper.clone(customFilterV2.value),
        search: search.value,
        sortInfoV2: helper.clone(sortInfoV2.value),
      }
    }

    const changeTableInfo = (opts: {
      conditionKey: Record<string, any>
      key: string
      value: any
    }) => {
      if (
        !rawDataV2.value ||
        !opts.conditionKey ||
        helper.isEmpty(opts.conditionKey)
      ) {
        return
      }

      const items = rawDataV2.value[baseConfigs.value.PropTable()]

      if (!items.length) return

      let newRawData = helper.clone(rawDataV2.value)

      try {
        let items = newRawData[baseConfigs.value.PropTable()]

        loop1: for (let index = 0; index < items.length; index++) {
          const element = items[index]

          for (const key in opts.conditionKey) {
            if (Object.prototype.hasOwnProperty.call(opts.conditionKey, key)) {
              if (element[key] !== opts.conditionKey[key]) {
                continue loop1
              }
            }
          }
          newRawData[baseConfigs.value.PropTable()][index][opts.key] =
            opts.value
        }
        rawDataV2.value = newRawData
      } catch (error) {
        console.error(error)
      }
    }

    const removeRowFromTable = (key: string, value: any) => {
      const prop = baseConfigs.value.PropTable()
      if (rawDataV2.value?.[prop]) {
        rawDataV2.value[prop] = rawDataV2.value[prop].filter(
          (i: any) => i[key] !== value
        )
      }
    }

    const colActionByKey = (key: string) => {
      if (!columnConfigs.value.columns?.length || !key) return ''

      return columnConfigs.value.columns.find((col) => col.field === key)
        ?.action
    }

    const getItemSelectByKey = (key: string) => {
      if (!itemSelectedV2.value.length || !key) return []

      return itemSelectedV2.value
        .filter((item) => !!item[key])
        .map((item) => {
          return item[key]
        })
    }

    const coreFilterOptions = async (
      opts: FilterItem,

      opts2: {
        first?: boolean
        q?: string
        f?: string
      } = {
        first: false,
        q: '',
        f: '',
      }
    ) => {
      if (!opts.key) return

      if (opts.options?.length) return helper.clone(opts.options)

      //Nếu cho ajax -> gọi ajax
      if (opts.ajax) {
        let optsAjax: AxiosRequestConfig = {
          url: opts.ajax,
          method: opts.post ? 'POST' : 'GET',
          params: {
            q: opts2.q,
            f: opts2.f,
            fi: opts2.first ? '1' : undefined,
          },
        }

        if (opts.post && opts.payload) {
          try {
            optsAjax.data = JSON.parse(opts.payload)
          } catch (error) {
            console.error(error)
          }
        }

        const response = await general.fetchDataByOpts(optsAjax)

        switch (opts.mode) {
          //Mode array ["abc", "def"]
          case 'array':
            return (
              response?.data?.map((item: any) => ({
                label: item,
                value: item,
              })) || []
            )
        }

        const valueKey = opts?.customValue || 'value'
        const labelKey = opts?.customLabel || 'label'

        let data: any[] = []

        try {
          data = opts.responseField
            ? helper.getNestedValue(response, opts.responseField)
            : response?.data || []
        } catch (error) {
          console.error(error)
          data = []
        }

        if (opts.mode === 'account_status') {
          return data.flatMap((item: any) =>
            StatusList.map((status) => ({
              label: `${item[labelKey]} - ${status.label}`,
              value: `${item[valueKey]}:${status.value}`,
            }))
          )
        }

        const options = [
          ...(opts.uncategorized
            ? [{ label: 'Uncategorized', value: -1 }]
            : []),
          ...data.map((item: any) => ({
            label: item[labelKey],
            value: item[valueKey],
          })),
        ]

        return options
      }

      let response: any = null
      switch (opts.key) {
        case 'account_manager':
          response = await ctr_user.GetAllAgency()

          return (
            response?.data?.agencies?.map((item: any) => ({
              label: item.email,
              value: item.id,
            })) || []
          )
        case 'demand_source':
          response = await ctr_demand_source.GetAllDemandSource()

          return (
            response?.data?.demand_sources?.map((item: any) => ({
              label: item.name,
              value: item.value,
            })) || []
          )
        case 'type':
          response = await ctr_rule.GetRuleType()

          return (
            response?.data?.map((item: any) => ({
              label: item.name,
              value: item.value,
            })) || []
          )
        case 'rule_id':
          response = await ctr_rule.GetAllRule()

          return (
            response?.data?.map((item: any) => ({
              label: item.name + ' (Id : ' + item.id + ' )',
              value: item.id,
            })) || []
          )
        case 'section_id':
          response = await ctr_filter.FilterSection({
            params: { q: opts2.q },
          })

          return (
            response?.data?.map((item: any) => ({
              label: item.section_name,
              value: item.section_id,
            })) || []
          )
        case 'manager':
          response = await ctr_filter.FilterManager({
            params: { q: opts2.q },
          })

          return (
            response?.data?.map((item: any) => ({
              label: item.email,
              value: item.id,
            })) || []
          )
        case 'account_demand_id':
          response = await ctr_demand_source.GetAccount({
            object: 'adsense',
          })
          try {
            return (
              response?.data?.accounts?.map((item: any) => ({
                label: item.name,
                value: item.id,
              })) || []
            )
          } catch {
            return []
          }
        case 'role':
          response = await ctr_user.GetAllRole()

          return (
            response?.data?.roles?.map((item: any) => ({
              label: item.name,
              value: item.id,
            })) || []
          )

        case 'pages':
          const generalStore = useGeneralStore()
          const notifySystemStore = useNotifySystem()
          
          notifySystemStore.setPageOptions(generalStore.menuRouter || [])
          
          return notifySystemStore.pageOptions.map((item: any) => ({
            label: item.name,
            value: item.url,
          })) || []

      }
    }

    const getFilterOptions = async (
      opts: FilterItem,

      opts2: {
        first?: boolean
        q?: string
        f?: string
      } = {
        first: false,
        q: '',
        f: '',
      }
    ) => {
      const options = await coreFilterOptions(opts, opts2)

      if (!options) return

      if (opts.type === 'varchar') {
        options.forEach((element: any) => {
          element.value = String(element.value)
        })
      }

      filterOptions.value[opts.key] = options

      //Lưu base options để trường hợp search ở clientFilter
      if (opts.clientFilter && opts2.first) {
        baseOptions.value[opts.key] = helper.clone(
          filterOptions.value[opts.key]
        )
      }
    }

    const fetchChooseCols = async (pathName?: string) => {
      const result = await ctr_table_settings.Get({
        router: pathName ? pathName : window.location.pathname,
        type: 'cols',
      })

      let oldDataColumns = result?.data?.columns || `{}`
      try {
        oldDataColumns = JSON.parse(oldDataColumns)
      } catch {
        oldDataColumns = {}
      }

      try {
        let dataToSave: string[] = []

        const isNotEmpty = Object.keys(oldDataColumns).length > 0

        if (!isNotEmpty) {
          // Nếu chưa có settings cũ, chỉ thêm các cột KHÔNG có defaultOff: true
          columns.value?.forEach((item) => {
            const colConfig = thisColConfig(item.field as string)
            if (!colConfig?.defaultOff) {
              dataToSave.push(item.field as string)
            }
          })
        } else {
          columns.value.forEach((element) => {
            if (oldDataColumns.hasOwnProperty(element.field as string)) {
              if (oldDataColumns[element.field as string]) {
                dataToSave.push(element.field as string)
              }
            } else {
              // New columns are checked by default (tick true)
              dataToSave.push(element.field as string)
              // dataToSave.push('')
            }
          })
        }
        columnSettings.value = dataToSave
      } catch (error) {
        console.error(error)
      }

      stopWatch.value = storage.initWatchCols(columnSettings, columns, pathName) //watch lưu vào storage
    }

    const replaceHeader = (key: string) => {
      return key
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
    }

    const buildAssetGroupPayload = (options: any = {}) => {
      return {
        filter: {
          publisher: options.publishers || [],
          status: options.statuses || [],
          account_supply: options.accountSupplies || [],
        },
        columns: options.columns || [
          'action',
          'publisher',
          'status',
          'ad_accounts',
        ],
        search: options.search || '',
        customFilter: options.customFilter || {},
        sort: options.sort || [
          {
            field: 'id',
            dir: 'desc',
          },
        ],
      }
    }

    const downloadAssetGroupNow = async () => {
      if (!baseConfigs.value.IsDownloadAssetGroup()) return
      const result = await ctr_asset_group.GetAllAssetGroup(
        buildAssetGroupPayload()
      )

      if (!result?.status || !result?.data?.items?.length) {
        window.message.error('No data to export')
        return
      }

      const items = result.data.items

      // 1. Xác định header động
      // Lấy keys cấp 1 (trừ accounts và ad_accounts)
      const firstItem = items[0] || {}
      const baseKeys = Object.keys(firstItem).filter(
        (k) => k !== 'accounts' && k !== 'ad_accounts'
      )

      let accountKeys: string[] = []
      const sampleAcc = items.find(
        (i: any) => Array.isArray(i.accounts) && i.accounts.length > 0
      )?.accounts[0]
      if (sampleAcc) {
        accountKeys = Object.keys(sampleAcc)
      }

      const rawHeader = [...baseKeys, ...accountKeys]
      const header = rawHeader.map(replaceHeader)

      // 2. Chuẩn bị dữ liệu export dạng phẳng
      const exportData: any[][] = [header]

      items.forEach((item: any, index: number) => {
        if (index > 0) {
          // eslint-disable-next-line unicorn/no-new-array
          const emptyRow = new Array(header.length).fill('')
          exportData.push(emptyRow)
        }
        const baseValues = baseKeys.map((k) => item[k] ?? '')

        if (
          item.accounts &&
          Array.isArray(item.accounts) &&
          item.accounts.length > 0
        ) {
          item.accounts.forEach((acc: any) => {
            const accValues = accountKeys.map((k) => acc[k] ?? '')
            exportData.push([...baseValues, ...accValues])
          })
        } else {
          const emptyAccValues = accountKeys.map(() => '')
          exportData.push([...baseValues, ...emptyAccValues])
        }
      })

      // 3. Xuất ra Excel
      await exportToExcel(exportData, 'report.xlsx')

      window.message.success('Export successful')
    }

    const saveOrderColumn = async (columns: string[] | undefined) => {
      return await ctr_order_column.SaveOrderColumn({
        path: path,
        columns: columns,
      })
    }

    const thisColConfig = (key: string) => {
      if (!key) return null
      const columns = columnConfigs.value.columns
      if (!Array.isArray(columns) || !columns.length) return null

      return columns.find((col) => col.field === key) || null
    }

    // Helper: kiểm tra DOM của grid còn tồn tại và còn attached vào document
    const isGridPresent = () => {
      try {
        const el = document.getElementById(idTable)
        return !!el && document.contains(el)
      } catch {}
      {
        return false
      }
    }

    const resetToDefaultView = () => {
      if (!defaultView.value) return

      filterList.value = helper.clone(defaultView.value.filterList)
      columnSettings.value = helper.clone(defaultView.value.columnSettings)
      groupByV2.value = helper.clone(defaultView.value.groupByV2)
      groupByV2Update.value = helper.clone(defaultView.value.groupByV2Update)
      customFilterV2.value = helper.clone(defaultView.value.customFilterV2)
      search.value = defaultView.value.search
      sortInfoV2.value = new SortTable(
        helper.clone(defaultView.value.sortInfoV2)
      )
    }

    return {
      idTable,
      baseConfigs,
      filterConfigs,
      columnConfigs,

      filterList,
      filterOptions,
      baseOptions,
      search,
      columnSettings,
      initTableV2,
      plkInfo,
      initDownloadV2,
      isDownloading,
      prefetchDone,
      sortInfoV2,
      viewModelNow,
      rawDataV2,
      itemSelectedV2,
      asyncConfigs,
      isFetching,
      pageSizeNow,
      pageNow,
      isSelectAll,
      showSelectedAlert,
      gridApiV2,
      allowInstant,
      customFilterV2,
      controllerV2,
      lazyControllerV2,
      trafficOptions,
      demandOptions,
      profileOptions,
      ruleTypeOptions,
      creativeTypeOptions,
      componentMap,
      loadingColumns,
      stopWatch,

      reAssignColumns,

      datePicker,

      //Computed
      columns,
      isHasBoxFilter,

      columnsHasCopy,
      onMultipleSelectRow,
      groupBy,
      groupByV2,
      groupByV2Update,
      hasFeatureButton,
      addUrlNow,
      nameAddNow,
      trafficOptionAccept,
      profileShow,

      aliasColumns,
      aliasFilters,
      backRouter,
      totalItems,

      columnsAccept,

      reInitTable,
      downloadTableNow,
      fetchPermissionFilters,
      fetchPermissionConfigs,
      fetchPermissionAsyncConfigs,
      fetchPermissionColumns,
      prefetchAfterRun,
      changeSortInfo,
      changeTableInfo,
      removeRowFromTable,
      colActionByKey,
      getItemSelectByKey,
      getFilterOptions,
      fetchChooseCols,
      downloadAssetGroupNow,
      saveOrderColumn,
      thisColConfig,
      resetToDefaultView,
      // Helpers
      isGridPresent,
      gridAlive,
    }
  })
