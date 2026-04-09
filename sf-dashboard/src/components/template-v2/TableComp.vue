<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
import {
  ColDef,
  Column,
  RowSelectionOptions,
  SelectionColumnDef,
  themeAlpine,
} from 'ag-grid-community'
import SkeletonTable from '@/components/template-v2/skeleton/SkeletonTable.vue'
import { useLogicGoAndLeave } from '@/plugins/reuseable'
import storage from '@/plugins/storage'
import editHandle from '@/components/template-v2/Editable'

import useAccountAd from '@/store/useAccountAd'
import { useTemplateV2 } from '@/store/templateV2Store'
import { storeToRefs } from 'pinia'
import { RowClassParams, RowStyle, SortDirection } from 'ag-grid-community'
import { general } from '@/services/general'
import { exportToExcel } from '@/utils/export-excel'

const SelectAll = defineAsyncComponent(
  () => import('@/components/template-v2/SelectAll.vue')
)
const templateV2Store = useTemplateV2(helper.truePath())()

const accountAdStore = useAccountAd()

const isUnMount = ref<boolean>(false)

const prevColumnOrder = ref<string[]>([])

const selectionColumnDef = {
  width: 50,
  minWidth: 50,
  maxWidth: 50,
  suppressSizeToFit: true,
  resizable: false,
  pinned: 'left',
  lockPosition: true,
} as const satisfies Partial<SelectionColumnDef>

const rowData = computed(() => {
  if (!templateV2Store.rawDataV2) return []
  let rowData =
    templateV2Store.rawDataV2[templateV2Store.baseConfigs.PropTable()] || []

  if (
    rowData.length &&
    templateV2Store.baseConfigs.ServerSide() &&
    rowData.length > templateV2Store.pageSizeNow
  ) {
    if (helper.isLocal()) {
      //Tránh code api lỗi trả về full dữ liệu quá lớn dẫn đến treo trình duyệt
      // alert('Data is too large, please check API')
    }
    rowData = rowData.slice(0, templateV2Store.pageSizeNow)
  }

  if (
    !templateV2Store.rawDataV2?.total ||
    !helper.isObject(templateV2Store.rawDataV2?.total)
  ) {
    return rowData
  }

  rowData = helper.clone(rowData) //Clone ra tránh lỗi render nhiều row total

  //Render total row nếu có
  let totalRow = templateV2Store.rawDataV2?.total

  rowData.push(totalRow)
  return rowData
}) // Set rowData to Array of Objects, one Object per Row

const defaultColDef = {
  // set every column width
  sortable: false,
  minWidth: 100,
  resizable: true,
  suppressSizeToFit: true,
  flex: 1,
  sortingOrder: ['desc', 'asc'] as SortDirection[],
}

const payload = computed(() => {
  let rawFilterList = helper.clone(templateV2Store.filterList) || {}

  if (templateV2Store.aliasFilters) {
    for (const key in templateV2Store.aliasFilters) {
      if (
        Object.prototype.hasOwnProperty.call(templateV2Store.aliasFilters, key)
      ) {
        const element = templateV2Store.aliasFilters[key]

        if (rawFilterList[key]) {
          rawFilterList[element] = rawFilterList[key]
          rawFilterList[key] = undefined
        }
      }
    }
  }

  if (templateV2Store.datePicker.isMultiMonth) {
    rawFilterList['start_month'] = rawFilterList['start_month'].substring(0, 7)
    rawFilterList['end_month'] = rawFilterList['end_month'].substring(0, 7)
  }

  if (
    templateV2Store.datePicker.isSingleMonth &&
    templateV2Store.filterConfigs.datePickerMonth
  ) {
    try {
      rawFilterList['month'] = rawFilterList['month'].substring(0, 7)
    } catch (error) {
      console.error(error)
    }
  }

  if (templateV2Store.viewModelNow) {
    rawFilterList['filter_by'] = templateV2Store.viewModelNow
  }

  let pl: {
    filter: any
    customFilter?: any
    search?: string
    page?: number
    size?: number
    sort?: object
    group_by?: string[]
    columns?: string[]
    [key: string]: any
  } = {
    filter: rawFilterList,
    columns: columnsPayload.value,
  }

  if (templateV2Store.baseConfigs.ServerSide()) {
    pl.page = templateV2Store.pageNow
    pl.size = templateV2Store.pageSizeNow
  }

  if (templateV2Store.baseConfigs.searchInFilter) {
    pl.filter.search = templateV2Store.search.trim()
  } else {
    pl.search = templateV2Store.search.trim()
  }

  if (templateV2Store.customFilterV2) {
    pl.customFilter = templateV2Store.customFilterV2
  }

  if (templateV2Store.sortInfoV2.sortNow) {
    pl.sort = templateV2Store.sortInfoV2.sortNow
  }

  if (templateV2Store.groupByV2?.length) {
    pl.group_by = templateV2Store.groupByV2
  }

  try {
    if (templateV2Store.baseConfigs.defaultPayload) {
      for (const key in templateV2Store.baseConfigs.defaultPayload) {
        if (
          Object.prototype.hasOwnProperty.call(
            templateV2Store.baseConfigs.defaultPayload,
            key
          )
        ) {
          pl[key] = templateV2Store.baseConfigs.defaultPayload[key]
        }
      }
    }
  } catch {}

  return pl
})

const columnDefsComp = computed(() => {
  let cols: ColDef[] = []

  templateV2Store.columns.forEach((element) => {
    const thisConfig = templateV2Store.thisColConfig(element.field as string)

    if (thisConfig?.isGroup) {
      if (templateV2Store.groupByV2?.includes(element.field as string)) {
        cols.push(element)
      }
      return
    }

    if (templateV2Store.columnSettings.includes(element.field as string)) {
      cols.push(element)
    }
  })

  //bỏ flex
  return cols.map((col) => {
    const { flex, ...rest } = col

    return rest
  })
})

//sử dụng biến để tránh lỗi, và trường hợp chưa update cột đã reactive ở aggrid
const columnDefs = ref<ColDef[]>(columnDefsComp.value)

const columnsPayload = computed(() => {
  return columnDefs.value.map((col) => {
    return col.field
  }) as string[]
})

const switchFetchData = async () => {
  let result: any

  templateV2Store.controllerV2 = new AbortController()

  if (templateV2Store.baseConfigs.AjaxAPI()) {
    result = await general.fetchTable(
      templateV2Store.baseConfigs.AjaxAPI(),
      payload.value,
      {
        signal: templateV2Store.controllerV2.signal,
      }
    )
  }

  if (!result?.status) {
    if (result?.errors && result?.errors.length > 0) {
      window.message.error(
        `Fetch Data Failed: ${result?.errors[0].message || ''} `
      )
    }
  }

  if (templateV2Store.baseConfigs.hasPayloadKey) {
    if (result?.data?.plk) {
      replacePayloadKey(result?.data?.plk)
    }
  }

  return result
}

const handleRefresh = () => {
  templateV2Store.reInitTable()
}

const fetchData = async () => {
  try {
    templateV2Store.isFetching = true

    if (templateV2Store.itemSelectedV2?.length) {
      templateV2Store.itemSelectedV2 = []
    }
    //Cancel request table trước nếu có
    templateV2Store.controllerV2?.abort()

    const startTime = performance.now()

    //Cập nhật trường này để cell reactive theo groupBy (cell sẽ bind theo groupByUpdate)

    templateV2Store.groupByV2Update = templateV2Store.groupByV2 || []
    try {
      let colsData = storage.getDataSave()

      if (colsData) {
        templateV2Store.columnSettings = colsData as string[]
      }
    } catch (error) {
      console.error(error)
    }

    reAssignColumns()

    let response = await switchFetchData()

    if (templateV2Store.baseConfigs.autoSize) {
      helper.addStyleOnce(
        templateV2Store.idTable,
        `#${templateV2Store.idTable} .ag-cell.ag-cell-auto-height {height: auto;}`
      )
    }

    //trường hợp cancel request
    if (response == 'canceled') return

    templateV2Store.rawDataV2 = response?.data || {}

    //nếu load quá nhanh cần timeout cái fetching để table hiển thị đúng
    if (performance.now() - startTime < 300) await helper.sleep(100)

    acceptInstantFeatures()
  } finally {
    templateV2Store.isFetching = false

    addTotalText()
    onAfterTableRender()
  }
}

//Tìm đến row total và thêm text Total vào ô đầu tiên (nếu ô đó trống ko có dữ liệu)
const addTotalText = async () => {
  await nextTick()

  try {
    const allCells = document
      .querySelector('.highlight-total-row')
      ?.querySelectorAll('.ag-cell')

    if (!allCells) return

    for (let index = 0; index < allCells?.length; index++) {
      const element = allCells[index]
      if (!element.textContent) {
        element.innerHTML = '<div class="font-bold">Total</div>'
        return
      }
    }
  } catch {}
}

const reAssignColumns = () => {
  columnDefs.value = columnDefsComp.value.map((item) => {
    const { sort, ...rest } = item
    return rest
  })
}

const acceptInstantFeatures = () => {
  if (templateV2Store.allowInstant) return
  //Instant update table khi click đổi date, group by ... -> chỉ khả dụng khi đã render table lần đầu tiên
  //Tránh gửi nhiều ajax lúc đầu
  templateV2Store.allowInstant = true
}

const handleStopEdit = (event: any) => {
  const target = event.target as Element

  if (!target.closest('#myGrid')) {
    if (templateV2Store.gridApiV2) {
      templateV2Store.gridApiV2.stopEditing()
    }
  }
}

onUnmounted(() => {
  if (templateV2Store.baseConfigs.loadGridApi) {
    document.removeEventListener('click', handleStopEdit)
  }
  try {
    // Đánh dấu grid không còn alive trước khi clear reference để tránh gọi API
    templateV2Store.gridAlive = false
    if (templateV2Store.gridApiV2) {
      // Giải phóng reference để tránh việc component con gọi API khi grid đang teardown
      templateV2Store.gridApiV2 = null
    }
  } catch (e) {
    console.error('[TableComp] onUnmounted - error clearing gridApiV2', e)
  }
  isUnMount.value = true

  removeWindowScroll()
})

onMounted(() => {
  if (templateV2Store.baseConfigs.loadGridApi) {
    document.addEventListener('click', handleStopEdit)
  }
  activeWindowScroll()
})

const removeWindowScroll = () => {
  window.removeEventListener('scroll', onWindowScroll)
  window.removeEventListener('resize', syncPosition)
}

const activeWindowScroll = () => {
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  window.addEventListener('resize', syncPosition)
}

onDeactivated(removeWindowScroll)

onActivated(() => {
  activeWindowScroll()
  onAfterTableRender()
})

const replacePayloadKey = (plk: string) => {
  if (isUnMount.value) {
    return
  }
  const currentRoute = window.router.currentRoute.value
  const currentQuery = { ...currentRoute.query }

  // Nếu có rule_id thì giữ toàn bộ query, chỉ ghi đè plk // fix cho satisfy
  if ('rule_id' in currentQuery) {
    window.router.push({
      path: currentRoute.path,
      query: {
        ...currentQuery,
        plk,
      },
    })
  } else {
    // Nếu không có rule_id thì chỉ push plk
    window.router.push({
      path: currentRoute.path,
      query: {
        plk,
        debug: currentQuery.debug || undefined,
      },
    })
  }
}

const pageCount = computed<number>(() => {
  if (templateV2Store.rawDataV2 === undefined) return 1

  const totalRecords = templateV2Store.totalItems
  const pageSizeValue = templateV2Store.pageSizeNow

  if (totalRecords % pageSizeValue === 0) {
    return totalRecords / pageSizeValue
  }

  return Math.floor(totalRecords / pageSizeValue) + 1
})

watch(
  () => templateV2Store.initTableV2,
  async () => {
    await helper.sleep(100)
    templateV2Store.pageNow = 1

    fetchData()
  }
)

watch(
  () => templateV2Store.reAssignColumns,
  async () => {
    reAssignColumns()
  }
)

const downloadAccountData = async (newValue: any) => {
  const messLoading = window.message.loading('Downloading...')

  let newPl = helper.clone(payload.value)
  newPl.size = 1000

  const response = await general.fetchTable(
    templateV2Store.baseConfigs.AjaxAPI(),
    newPl
  )

  try {
    const fullData =
      response?.data[templateV2Store.baseConfigs.PropTable()] || []
    const exportData = []

    const headers: string[] = columnsPayload.value.filter(
      (element) => element && element != ''
    ) as string[]
    const headersName: string[] = []

    columnsPayload.value.forEach((col) => {
      if (col) {
        const colSetting = columnDefsComp.value.find(
          (element) => element.field === col
        )
        if (colSetting?.headerName) {
          headersName.push(colSetting.headerName)
        } else {
          headersName.push(col)
        }
      }
    })

    exportData.push(headersName)

    fullData?.forEach((element: any) => {
      let row: any[] = []
      headers.forEach((e: string) => {
        switch (e) {
          case 'labels':
            const labelsData = element[e]
            if (labelsData) {
              const lables = labelsData.map((obj: any) => obj.label)

              try {
                row.push(lables.join(','))
              } catch {
                row.push('')
              }
            } else {
              row.push('')
            }

            break

          case 'categories':
            const data = element[e]
            if (data) {
              try {
                const dataJson = JSON.parse(JSON.stringify(data)) || []

                const names: string[] = []

                dataJson.forEach((element: string) => {
                  for (
                    let index = 0;
                    index < accountAdStore.categoryOptions.length;
                    index++
                  ) {
                    if (element === accountAdStore.categoryOptions[index].id) {
                      names.push(
                        accountAdStore.categoryOptions[index].name as string
                      )
                      break
                    }
                  }
                })

                row.push(names.join(', '))
              } catch {
                row.push('')
              }
            } else {
              row.push('')
            }

            break

          default:
            if (Array.isArray(element[e])) {
              if (element[e].length > 1000) {
                row.push(
                  'This data not full: ' + element[e].slice(0, 1000).join(', ')
                )
                break
              }

              row.push(element[e].join(', '))
              break
            }
            if (helper.isObject(element[e])) {
              row.push(JSON.stringify(element[e]))
              break
            }
            row.push(element[e])
            break
        }
      })
      exportData.push(row)
    })

    await exportToExcel(exportData, 'data.xlsx')
  } catch (error) {
    console.error(error)
  }

  messLoading.destroy()
  templateV2Store.isDownloading = false
}

watch(
  () => templateV2Store.initDownloadV2,
  async (newValue, oldValue) => {
    if (newValue) {
      downloadAccountData(newValue)
    }
  }
)

const onSortChanged = (event: any) => {
  if (templateV2Store.baseConfigs.ClientSide()) return

  if (event.source === 'api') {
    return
  }

  templateV2Store.rawDataV2 = {}

  templateV2Store.isFetching = true

  const sortedColumns = event.api
    .getAllDisplayedColumns()
    .filter((col: any) => col.getSort())

  if (sortedColumns.length == 0) {
    return
  }

  const sortedColumn = sortedColumns[0] // Assuming you only have one sorted column

  let colId = sortedColumn.getColId()
  let colDir = sortedColumn.getSort()

  if (templateV2Store.aliasColumns && templateV2Store.aliasColumns[colId]) {
    colId = templateV2Store.aliasColumns[colId]
  }

  templateV2Store.changeSortInfo(colId, colDir)

  fetchData()
}

const onFirstDataRendered = (params: any) => {
  if (templateV2Store.sortInfoV2.isEmpty()) return

  let newDefs = columnDefsComp.value

  for (let index = 0; index < columnDefsComp.value.length; index++) {
    const element = columnDefsComp.value[index]

    if (element.field == templateV2Store.sortInfoV2.field) {
      newDefs[index].sort = templateV2Store.sortInfoV2.dir
    } else {
      if (element.hasOwnProperty('sort')) {
        newDefs[index].sort = undefined
      }
    }
  }

  nextTick(() => {
    params.api.setGridOption('columnDefs', newDefs)
    // templateV2Store.gridApiV2?.sizeColumnsToFit()
  })
}

const updatePage = (newVal: number) => {
  templateV2Store.pageNow = newVal

  if (templateV2Store.baseConfigs.ClientSide() && templateV2Store.gridApiV2) {
    templateV2Store.gridApiV2.paginationGoToPage(templateV2Store.pageNow - 1)
  }

  if (templateV2Store.baseConfigs.ServerSide()) fetchData()
}

const updatePageSize = (newVal: number) => {
  templateV2Store.pageNow = 1

  templateV2Store.pageSizeNow = newVal

  if (templateV2Store.baseConfigs.ClientSide() && templateV2Store.gridApiV2) {
    templateV2Store.gridApiV2.paginationGoToPage(templateV2Store.pageNow - 1)
    templateV2Store.gridApiV2.setGridOption(
      'paginationPageSize',
      templateV2Store.pageSizeNow >= 1 ? templateV2Store.pageSizeNow : 10
    )
  }

  if (templateV2Store.baseConfigs.ServerSide()) fetchData()
}
const resizeColumnsToFit = (params: any) => {
  if (!params.clientHeight || !params.clientWidth) {
    return
  }

  const allColumns = params.api.getAllDisplayedColumns()
  if (!allColumns || allColumns.length === 0) {
    return
  }

  params.api.sizeColumnsToFit()
}

let horizontalScrollEl: HTMLElement | null = null

const onAfterTableRender = () => {
  requestAnimationFrame(() => {
    horizontalScrollEl = document.querySelector(
      '.ag-body-horizontal-scroll'
    ) as HTMLElement
    onWindowScroll()
  })
  restoreScrollWhenStable()
}

const onGridReady = (params: any) => {
  if (
    templateV2Store.baseConfigs.autoSize ||
    templateV2Store.baseConfigs.ClientSide() ||
    templateV2Store.baseConfigs.loadGridApi
  ) {
    templateV2Store.gridApiV2 = params.api
    templateV2Store.gridAlive = true
    resizeColumnsToFit(params)
  }
  onAfterTableRender()
}

const gridWrapperRef = ref<HTMLElement>()
const FIX_ON = 50 // px
const FIX_OFF = 30 // px

let isFixed = false
let lastScrollLeft = 0

const restoreScrollLeft = () => {
  if (!horizontalScrollEl) return
  horizontalScrollEl.scrollLeft = lastScrollLeft
}
// ẩn hiện scroll ngang nếu có
const onWindowScroll = () => {
  if (!gridWrapperRef.value || !horizontalScrollEl) return
  const gridRect = gridWrapperRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const distanceToBottom = gridRect.bottom - viewportHeight

  if (isFixed) {
    if (distanceToBottom < FIX_OFF) {
      lastScrollLeft = horizontalScrollEl.scrollLeft
      isFixed = false
      horizontalScrollEl.classList.remove('ag-horizontal-fixed')
      horizontalScrollEl.style.left = ''
      // horizontalScrollEl.style.width = ''
    } else {
      horizontalScrollEl.classList.add('ag-horizontal-fixed')
      syncPosition()
    }
    return
  }

  if (distanceToBottom > FIX_ON) {
    isFixed = true
    horizontalScrollEl.classList.add('ag-horizontal-fixed')
    syncPosition()
    requestAnimationFrame(() => {
      restoreScrollLeft()
    })
  }
}

const syncPosition = () => {
  if (!gridWrapperRef.value || !horizontalScrollEl) return

  const rect = gridWrapperRef.value.getBoundingClientRect()
  horizontalScrollEl.style.left = `${rect.left}px`
  horizontalScrollEl.style.width = `${rect.width}px`
}

const onRowSelected = (event: any) => {
  if (templateV2Store.gridApiV2) {
    templateV2Store.itemSelectedV2 = templateV2Store.gridApiV2.getSelectedRows()

    if (!templateV2Store.itemSelectedV2?.length) {
      templateV2Store.isSelectAll = false
    }
  }
}

const onCellCopy = (params: any) => {
  const field = params.colDef?.field
  if (!field || !templateV2Store.columnsHasCopy.includes(field)) {
    return
  }

  const value = params.value
  helper.copyText(value)
  window.message.success('Copied to clipboard!')
}

const getRowStyle = (params: RowClassParams): RowStyle | undefined => {
  if (!params.data || !templateV2Store.columnConfigs.highlight) {
    return undefined
  }

  const isHighlighted = Object.entries(
    templateV2Store.columnConfigs.highlight
  ).some(([key, value]) => params.data[key] === value)

  return isHighlighted ? { backgroundColor: '#ffeeba' } : undefined
}

const getRowClass = (params: RowClassParams) => {
  let classArr = ['flex', 'items-center']

  if (
    templateV2Store.rawDataV2?.total &&
    helper.isObject(templateV2Store.rawDataV2?.total)
  ) {
    const lastRowIndex = params.api.getDisplayedRowCount() - 1
    if (params.node.rowIndex === lastRowIndex) {
      // Nếu hàng là hàng cuối cùng, áp dụng lớp CSS tùy chỉnh cho ô đầu tiên
      classArr.push('highlight-total-row')
    }
  }

  return classArr.join(' ')
}

const onCellValueChanged = async (params: any) => {
  const ok = editHandle(params)

  if (!ok) {
    handleRefresh()
  }
}

const handleColMoved = async (event: any) => {
  const displayedCols = event.api.getAllDisplayedColumns()
  const displayedOrder = displayedCols
    .map((col: Column) => col.getColDef().field)
    .filter(Boolean)

  // Lấy cột ẩn
  const hiddenColumns = templateV2Store.columnsAccept.filter(
    (field: string) => !displayedOrder.includes(field)
  )

  const newColumnOrder = [...displayedOrder, ...hiddenColumns]

  if (prevColumnOrder.value.length === 0) {
    prevColumnOrder.value = [...toRaw(templateV2Store.columnsAccept)]
  }

  const oldDisplayedOrder = prevColumnOrder.value.filter((field: string) =>
    displayedOrder.includes(field)
  )

  if (JSON.stringify(oldDisplayedOrder) === JSON.stringify(displayedOrder)) {
    return
  }

  prevColumnOrder.value = [...newColumnOrder]

  const result = await templateV2Store.saveOrderColumn(newColumnOrder)

  if (result.status) {
    const widthMap = new Map()
    displayedCols.forEach((col: Column) => {
      widthMap.set(col.getColDef().field, col.getActualWidth())
    })

    const filteredColumns = result.data.columns.map((col: any) => {
      const colConfig = templateV2Store.thisColConfig(col.field)
      const actualWidth = widthMap.get(col.field) || colConfig?.minWidth || 100
      const oldMinWidth = colConfig?.minWidth || 0
      const isWidthChanged = Math.abs(actualWidth - oldMinWidth) > 1

      if (isWidthChanged) {
        const { flex, minWidth, ...rest } = col
        return rest
      }

      return col
    })
    templateV2Store.columnConfigs.columns = filteredColumns

    reAssignColumns()
  }
}

//Làm thế này để lấy đc Ref
const { isFetching } = storeToRefs(templateV2Store)

useLogicGoAndLeave(isFetching, handleRefresh)

//  :suppressRowVirtualisation="templateV2Store.pageSizeNow <= 100"
//  :suppressColumnVirtualisation="templateV2Store.pageSizeNow <= 100"
//  để ctrl F của trình duyệt hoạt động đc ko do dom của aggrid xóa bỏ mà ko search đc

const rowSelectionConfig = computed<
  RowSelectionOptions | 'single' | 'multiple'
>(() => {
  return {
    mode: 'multiRow',
    enableSelectionWithoutKeys: templateV2Store.onMultipleSelectRow,
    enableClickSelection: true,
    checkboxes: templateV2Store.baseConfigs?.HasCheckBox(),
    headerCheckbox: templateV2Store.baseConfigs?.HasCheckBox(),
  }
})

const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})

//tính lại scroll khi render xong ag grid
const restoreScrollWhenStable = () => {
  let lastWidth = 0
  let stableCount = 0

  const check = () => {
    if (!horizontalScrollEl) return
    const width = horizontalScrollEl.scrollWidth

    if (width === lastWidth) {
      stableCount++
    } else {
      stableCount = 0
      lastWidth = width
    }

    // cần 2 frame liên tiếp không đổi width
    if (stableCount >= 2) {
      horizontalScrollEl.scrollLeft = lastScrollLeft
      return
    }

    requestAnimationFrame(check)
  }

  requestAnimationFrame(check)
}

const onGridSizeChanged = (params: any) => {
  resizeColumnsToFit(params)
}

const onColumnResized = (params: any) => {
  if (!params.finished) return

  params.api.getColumns().forEach((col: any) => {
    col.getColDef().width = col.getActualWidth()
  })

  const gridElement = document.querySelector(
    `#${templateV2Store.idTable}`
  ) as HTMLElement

  if (!gridElement) return

  const gridWidth = gridElement.offsetWidth
  const allColumns = params.api.getColumns()
  const totalColumnsWidth = allColumns.reduce((sum: number, col: any) => {
    return sum + col.getActualWidth()
  }, 0)

  // Nếu có khoảng trắng thì fit
  if (totalColumnsWidth < gridWidth) {
    params.api.sizeColumnsToFit()
  }
}
</script>
<template>
  <SkeletonTable
    v-show="templateV2Store.isFetching || !templateV2Store.prefetchDone"
  />
  <div
    v-if="!templateV2Store.isFetching && templateV2Store.prefetchDone"
    class="w-full relative custom-dark-mode-table"
    ref="gridWrapperRef"
  >
    <div
      class="text-xs text-gray-500 border p-2 flex gap-4"
      v-if="
        (templateV2Store.totalItems ||
          templateV2Store.rawDataV2?.total_campaign) &&
        !templateV2Store.baseConfigs.offTotalShow
      "
    >
      <span
        >{{ templateV2Store.totalItems.toLocaleString('en-US') }} Items</span
      >
      <span v-if="templateV2Store.rawDataV2?.total_campaign"
        >{{ templateV2Store.rawDataV2?.total_campaign }} Campaigns</span
      >
    </div>
    <SelectAll v-if="templateV2Store.columnConfigs.all" />

    <div
      v-if="!columnDefs.length"
      class="text-center border-x italic text-xs text-gray-500 p-4"
    >
      Please select at least one column.
    </div>
    <div class="ag-wrapper">
      <ag-grid-vue
        :id="templateV2Store.idTable"
        :theme="customTheme"
        class="ag-theme-alpine"
        :animate-rows="true"
        dom-layout="autoHeight"
        :row-height="templateV2Store.baseConfigs.rowHeight"
        :column-defs="columnDefs"
        :row-data="rowData"
        :default-col-def="defaultColDef"
        :enable-cell-text-selection="true"
        :server-side-sorting="templateV2Store.baseConfigs.ServerSide()"
        :suppress-multi-sort="true"
        :pagination="templateV2Store.baseConfigs.ClientSide()"
        :suppress-pagination-panel="true"
        :suppressRowVirtualisation="templateV2Store.pageSizeNow <= 100"
        :suppressColumnVirtualisation="templateV2Store.pageSizeNow <= 100"
        :paginationPageSize="templateV2Store.pageSizeNow"
        :rowSelection="rowSelectionConfig"
        :selectionColumnDef="selectionColumnDef"
        :suppressMovableColumns="templateV2Store.baseConfigs?.offOrder"
        :tooltipShowDelay="500"
        :getRowClass="getRowClass"
        :getRowStyle="getRowStyle"
        :suppressDragLeaveHidesColumns="true"
        :always-show-vertical-scroll="true"
        @row-selected="onRowSelected"
        @grid-ready="onGridReady"
        @sortChanged="onSortChanged"
        @firstDataRendered="onFirstDataRendered"
        @cell-double-clicked="onCellCopy"
        @cell-value-changed="onCellValueChanged"
        @dragStopped="handleColMoved"
        @grid-size-changed="onGridSizeChanged"
        @columnResized="onColumnResized"
      >
      </ag-grid-vue>
    </div>

    <!-- pagination -->
    <n-pagination
      v-model:page="templateV2Store.pageNow"
      v-model:page-size="templateV2Store.pageSizeNow"
      show-size-picker
      class="bg-card py-3 justify-end items-center"
      :page-count="pageCount"
      :page-sizes="[10, 20, 30, 50, 100, 500]"
      :on-update:page="updatePage"
      :on-update:page-size="updatePageSize"
      show-quick-jumper
    >
      <template #goto> Go to </template>
    </n-pagination>
  </div>
</template>
<style lang="scss">
.ag-wrapper {
  position: relative;
}

// bỏ border right
.ag-pinned-left-header {
  border-right: none !important;
}

.ag-cell.ag-cell-last-left-pinned:not(
    .ag-cell-range-right,
    .ag-cell-range-single-cell,
    .ag-cell-focus:not(.ag-cell-range-selected):focus-within
  ) {
  border-right: none !important;
}

.ag-horizontal-fixed {
  position: fixed;
  bottom: 1px;
  z-index: 10;
  will-change: transform;
}

.ag-header-cell-comp-wrapper {
  .svg-inline--fa {
    height: 8px;
    color: green;
    padding-left: 5px;
  }
}
.Blink {
  animation: blinker 0.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
}
@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.highlight-total-row {
  .ag-cell-value {
    font-weight: bold;
  }
}
</style>
