<script setup lang="ts">
import {
  CellComponent,
  ColumnComponent,
  TabulatorFull as Tabulator,
  RowComponent,
  ColumnDefinition,
  Options,
} from 'tabulator-tables'
import { useDialog } from 'naive-ui'

import { debounceV2 } from '@/utils/index'

import { useReportV2 } from '@/store/report/report-v2'

import { filterType, ReportColumn } from '@/types/state/report'

import icons from '@/utils/icons'

import PreviewAdTaboola from '@/components/report-v3/PreviewAdTaboola.vue'

import { exportToExcel } from '@/utils/export-excel'
import {
  formatForShow,
  formatterNow,
} from '@/components/report-v3/report-formatter'
import { styleNowV2 } from '@/components/report-v3/report-style'
import { titleFormatterNow } from '@/components/report-v3/report-title-formatter'
import { headerTooltipNow } from '@/components/report-v3/report-header-tooltip'
import { tooltipNow } from '@/components/report-v3/report-tooltip'
import {
  campaignMenuClick,
  clickMenuNow,
} from '@/components/report-v3/report-click-menu'
import helper from '@/utils/helper'
import ReportPaginationV2 from './ReportPaginationV2.vue'
import SkeletonV2 from '../skeleton/SkeletonV2.vue'
import { ctr_logging } from '@/services/ctr_logging'
import date2 from '@/utils/date2'
import { TS } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import BulkAction from './reportBulkAction/BulkAction.vue'
import BulkButton from './reportBulkAction/BulkButton.vue'
import Logging from '@/utils/Log'
import { withQuickSelectFormatter } from './report-quick-select'

const ModalBidding = helper.createAsyncComponent(
  () => import('@/components/report-v3/ModalBidding.vue')
)

const ModalBudgetFacebook = helper.createAsyncComponent(
  () => import('@/components/report-v3/ModalBudgetFacebook.vue')
)

const PreviewAdFacebook = defineAsyncComponent(
  () => import('@/components/report-v3/PreviewAdFacebook.vue')
)

const DuplicateChangeCampaignType = defineAsyncComponent(
  () => import('@/components/campaign/modal/DuplicateChangeCampaignType.vue')
)

const SortDirectionPopup = defineAsyncComponent(
  () => import('@/components/report-v3/SortDirectionPopup.vue')
)

const sortPopup = ref({
  visible: false,
  field: '',
  position: { x: 0, y: 0 },
})

const tableID = 'rp-table'
const isMobile = helper.mobileDetect()
const isTablet = helper.isTabletOrSmallOrTouchDevice()

const modalBiddingComp = ref<InstanceType<typeof ModalBidding>>()
const modalBudgetFacebookComp = ref<InstanceType<typeof ModalBudgetFacebook>>()

const dialog = useDialog()

const reportStoreV2 = useReportV2(helper.truePath())()

const isStickyCampaign = ref<boolean>(
  localStorage.getItem('stickyCampaignCol') === 'true'
)
const isStickyDate = ref<boolean>(
  localStorage.getItem('stickyDateCol') === 'true'
)
const isStickyActionCamp = ref<boolean>(
  localStorage.getItem('stickyActionCampCol') === 'true'
)
const columns = computed<any[]>(() => {
  if (!reportStoreV2.reportDataV2.items?.length) return []

  let base: ColumnDefinition[] = reportStoreV2.ReportColsOrdered.filter(
    (item) =>
      item.key &&
      !item.hideCol &&
      reportStoreV2.listColAccepted.includes(item.key)
  ).map((item) => ({ field: item.key })) as any[]
  // Thêm cột checkbox vào đầu danh sách cột
  if (reportStoreV2.reportSettingsNew.selectBox && window.arb.isCompany()) {
    base.unshift({
      title: '',
      field: 'selected',
      maxWidth: 45,
      hozAlign: 'center',
      headerSort: false,
      cssClass: 'p-checkbox',
      resizable: false,
      frozen: true,
    })
  }

  base.forEach((item) => {
    const originalField = item.field

    if (!originalField) return

    if (['bidding', 'cpc', 'budget'].includes(originalField)) {
      item.cellClick = function (e: any, cell: CellComponent) {
        const data = cell.getRow().getData()
        if (!data.traffic_source) {
          window.message.error('Missing traffic_source')
          return
        }

        if (
          ![TS.TABOOLA, TS.GOOGLE, TS.FACEBOOK].includes(data.traffic_source)
        ) {
          window.message.warning(
            `This feature currently only supports 'Google', 'Taboola', 'Facebook'.`
          )
          return
        }

        if (!data.campaign_name) return

        switch (true) {
          case data.traffic_source === TS.FACEBOOK:
            modalBudgetFacebookComp.value?.setCell(cell)
            modalBudgetFacebookComp.value?.changeDataRow(data)
            break

          default:
            modalBiddingComp.value?.setCell(cell)
            modalBiddingComp.value?.changeDataRow(data)
            break
        }
      }
    }

    if (originalField === 'ad_group_budget') {
      item.cellClick = function (e: any, cell: CellComponent) {
        const data = cell.getRow().getData()
        const ts = data.traffic_source || data.ad_group?.traffic_source
        if (!ts) {
          window.message.error('Missing traffic_source')
          return
        }

        if (![TS.FACEBOOK].includes(ts)) {
          window.message.warning(
            `This feature currently only supports 'Facebook'.`
          )
          return
        }

        if (!data.campaign_name) return

        switch (true) {
          case ts === TS.FACEBOOK:
            modalBudgetFacebookComp.value?.setCell(cell)
            modalBudgetFacebookComp.value?.changeDataRow(data)
            break

          default:
            break
        }
      }
    }

    const columnInfoAPI =
      reportStoreV2.getFullInfoByKey(item.field) ||
      new ReportColumn({ key: item.field })

    item.title = columnInfoAPI.title || item.field || ''

    const styleV2 = styleNowV2(columnInfoAPI)
    // eslint-disable-next-line no-unused-expressions
    styleV2 && (item = Object.assign(item, styleV2))

    if (columnInfoAPI?.metric) {
      item.formatter = formatForShow(
        new ReportColumn(columnInfoAPI),
        null,
        reportStoreV2.prevReportDataNow
      )
      if (item.field) {
        item.bottomCalc = () => {
          return reportStoreV2.reportDataV2?.total?.[item.field as string] ?? ''
        }

        item.bottomCalcFormatter = formatForShow(
          new ReportColumn(columnInfoAPI),
          reportStoreV2.reportDataV2,
          reportStoreV2.prevReportDataNow
        ) as any
      }
    }

    const formatter = formatterNow(columnInfoAPI)
    // eslint-disable-next-line no-unused-expressions
    formatter &&
      (item.formatter = reportStoreV2.reportSettingsNew.quickSelect
        ? withQuickSelectFormatter(formatter, columnInfoAPI)
        : formatter)

    if (['action_camp', 'landing_page_id'].includes(originalField)) {
      const clickMenu = clickMenuNow(columnInfoAPI, dialog)
      // eslint-disable-next-line no-unused-expressions
      clickMenu && (item.clickMenu = clickMenu as any)

      if (originalField === 'action_camp') {
        if (isStickyActionCamp.value) {
          item.frozen = true
        }
        item.title = `<div class="flex items-center action-checkbox gap-2">
          Action
          <input type="checkbox" class="selected-box freeze-toggle ml-auto"
            data-field="${item.field}"
            ${isStickyActionCamp.value ? 'checked' : ''}>
        </div>`
      }
    }

    if (originalField === 'action_camp') {
      item.cellClick = (e: any, cell: CellComponent) => {
        const target = e.target as HTMLElement
        const row = cell.getRow()

        if (target.closest('.week-data')) {
          showWeekData(row)
        }

        if (target.closest('.ad-group-data')) {
          showAdGroupData(row)
        }
      }
    }

    if (originalField === 'date') {
      item.formatter = (cell: CellComponent) => {
        const value = cell.getValue()
        return reportStoreV2.reportSettingsNew.showFullDate
          ? helper.formatFullDate(
              value,
              reportStoreV2.time_interval,
              reportStoreV2.timezone
            )
          : value
      }
    }

    const titleFormatter = titleFormatterNow(columnInfoAPI)
    // eslint-disable-next-line no-unused-expressions
    titleFormatter && (item.titleFormatter = titleFormatter)

    const headerTooltip = headerTooltipNow(columnInfoAPI)
    // eslint-disable-next-line no-unused-expressions
    headerTooltip && (item.headerTooltip = headerTooltip as any)

    const tooltip = tooltipNow(columnInfoAPI)
    // eslint-disable-next-line no-unused-expressions
    tooltip && (item.tooltip = tooltip as any)

    // XỬ LÝ RIÊNG CHO CỘT CAMPAIGN VÀ SELECTED
    if (item.field === 'campaign') {
      // Set frozen trước khi set title
      if (isStickyCampaign.value) {
        item.frozen = true
      }
      // Set title với checkbox
      item.title = `<div class="flex items-center campaign-checkbox gap-2">Campaign<input type="checkbox" class="selected-box freeze-toggle ml-auto" data-field="${
        item.field
      }" ${isStickyCampaign.value ? 'checked' : ''}></div>`
    }
    if (item.field === 'date') {
      if (isStickyDate.value) item.frozen = true
      item.title = `<div class="flex items-center date-checkbox gap-2">Date<input type="checkbox" class="selected-box freeze-toggle ml-auto" data-field="${
        item.field
      }" ${isStickyDate.value ? 'checked' : ''}></div>`
    }

    if (item.field === 'selected') {
      item.title = `<div class="flex items-center">&nbsp;<input type="checkbox" class="selected-box" data-field="${item.field}"></div>`
    }

    if (isStickyCampaign.value) {
      if (['status', 'action_camp'].includes(originalField)) {
        item.frozen = true
      }
    }

    // Comment to prevent TailwindCSS from purging this class because it’s actually used (returned from backend)
    /* bg-amber-50/70 bg-green-50/70 */
    // eslint-disable-next-line no-unused-expressions
    columnInfoAPI?.cssClass && (item.cssClass = columnInfoAPI.cssClass)

    // eslint-disable-next-line no-unused-expressions
    columnInfoAPI?.sortDisabled && (item.headerSort = false)

    // eslint-disable-next-line no-unused-expressions
    columnInfoAPI?.maxWidth && (item.maxWidth = columnInfoAPI?.maxWidth)

    item.sorter = (() => {}) as any // To disable the default sorting of Tabulator
  })

  if (isMobile || isTablet) {
    base.forEach((element) => {
      element.resizable = false
    })
  }

  // Sắp xếp cột để giữ cột selected ở đầu, sau đó ưu tiên cột frozen
  if (
    isStickyCampaign.value ||
    isStickyDate.value ||
    isStickyActionCamp.value
  ) {
    base = base.sort((a, b) => {
      // 1. Ưu tiên cột selected lên đầu
      if (a.field === 'selected') return -1
      if (b.field === 'selected') return 1

      // 2. Nếu có isStickyActionCamp thì đẩy action_camp xuống cuối
      if (isStickyActionCamp.value) {
        if (a.field === 'action_camp') return 1
        if (b.field === 'action_camp') return -1
      }

      // 3. Sau đó ưu tiên frozen
      return (b.frozen ? 1 : 0) - (a.frozen ? 1 : 0)
    })
  }

  fmt.Info('columns', base)

  return base
})

const page = computed<number>(() => reportStoreV2.page)
const size = computed<number>(() => reportStoreV2.size)
const filterComputed = computed<filterType>(() => reportStoreV2.filter)
const filterDateComputed = computed<string[]>(() => [
  reportStoreV2.filter?.start_date || '',
  reportStoreV2.filter?.end_date || '',
])
const groupByComputed = computed<string[]>(() => reportStoreV2.group_by)
const timeIntervalComputed = computed<string>(() => reportStoreV2.time_interval)

const timeZoneComputed = computed<string>(() => reportStoreV2.timezone)
const tableIsLoading = ref<boolean>(true)
const tableIsRendering = ref<boolean>(true) //Thêm biến này khác với biến tableIsLoading để xử lý việc hiển thị skeleton khi table đang render
const tabulator = ref<null | Tabulator>(null)
const table = ref<string | HTMLElement>('')
const isFirstPageChange = ref<boolean>(true)
const isFirstInit = ref<boolean>(true)
const preSort = ref<string>('')

const adjustColumnWidths = async () => {
  await helper.sleep(100)

  const tableElement = document.querySelector(`#${tableID}`)

  if (!tableElement || !tabulator.value) return

  const columns = tabulator.value.getColumns()

  const columnsShow = columns.filter((col) => col.isVisible())
  if (!columnsShow) return

  const columnsWithoutMaxwidth = columnsShow.filter(
    (col) => !col.getDefinition().maxWidth
  )

  if (!columnsWithoutMaxwidth) return

  const totalTableWidth = tableElement.clientWidth

  let totalColumnWidth = columnsShow.reduce(
    (sum, col) => sum + col.getWidth(),
    0
  )

  if (totalColumnWidth >= totalTableWidth) return

  const extraWidth =
    (totalTableWidth - totalColumnWidth) / columnsWithoutMaxwidth.length

  console.info('Each column will extra width: ', extraWidth)

  columnsWithoutMaxwidth.forEach((col) => {
    col.setWidth(col.getWidth() + extraWidth)
  })
}

const addStickyScrollBar = () => {
  if (
    !reportStoreV2.reportDataV2.items ||
    reportStoreV2.reportDataV2.items.length === 0
  ) {
    $('#sticky-scroll-holder').remove()
    return
  }
  $(function ($) {
    try {
      $('#sticky-scroll-holder').remove() // Remove any existing holder
    } catch {}
    const scrollbar = $('<div id="sticky-scroll-holder"><div></div></div>')
      .appendTo($(document.body))
      .hide()
      .css({
        overflowX: 'auto',
        position: 'fixed',
        width: '100%',
        bottom: 48,
      })

    const fakeContent = scrollbar.find('div')
    let active = $<HTMLElement>([])
    let lastScroll: number | null = null // Khai báo rõ kiểu

    function getOffsets(el: any) {
      return {
        top: el.offset().top,
        bottom: el.offset().top + el.height(),
      }
    }

    function findActive() {
      scrollbar.show()
      active = $<HTMLElement>([])

      $('.tabulator-tableholder').each(function () {
        const el = $(this)
        const scrollbarOffsets = getOffsets(scrollbar)

        if (
          getOffsets(el).top < scrollbarOffsets.top &&
          getOffsets(el).bottom > scrollbarOffsets.bottom
        ) {
          fakeContent.width(el[0].scrollWidth).height(1)
          active = el
        }
      })

      fitScrollbar(active)
      return active
    }

    function fitScrollbar(active: any) {
      if (!active.length) return scrollbar.hide()
      scrollbar.css({
        left: active.offset().left,
        width: active.width(),
      })

      fakeContent.width(active[0].scrollWidth).height(1)
      return
    }

    function handleScroll() {
      if (!active.length || scrollbar.scrollLeft() === lastScroll) return
      lastScroll = scrollbar.scrollLeft() as number
      active.scrollLeft(lastScroll)
    }

    function updateScrollPosition() {
      if (!active.length || active.scrollLeft() === lastScroll) return
      lastScroll = active.scrollLeft() as number
      scrollbar.scrollLeft(lastScroll)
    }

    function onScrollChange() {
      const oldActive = active
      active = findActive()

      if (!active.is(oldActive)) {
        oldActive.off('scroll', updateScrollPosition)
        active.on('scroll', updateScrollPosition)
      }

      updateScrollPosition()
    }

    scrollbar.on('scroll', handleScroll)
    $(window).on('scroll resize', onScrollChange)

    onScrollChange()
  })
}
const isSelectAll = ref(false)
const generateRowKey = (data: any): string | null => {
  const groupByFields = groupByComputed.value || []

  if (!groupByFields.length) return null

  const idFieldMap: Record<string, string> = {
    campaign: 'campaign_name',
    ad_id: 'ad_id',
    account_demand_id: 'account_demand',
    publisher: 'publisher',
  }

  // Lấy directFields hoàn toàn động từ reportStoreV2.ReportCols
  const getDirectFields = (): Set<string> => {
    const dynamicFields = new Set<string>()

    // Chỉ lấy các field có group: true từ ReportCols
    if (reportStoreV2.ReportCols && Array.isArray(reportStoreV2.ReportCols)) {
      reportStoreV2.ReportCols.forEach((col: any) => {
        if (col.group === true && col.key) {
          dynamicFields.add(col.key)
        }
      })
    }

    return dynamicFields
  }

  const directFields = getDirectFields()

  const values = groupByFields
    .map((field) => {
      let value = ''

      // Nếu là field đặc biệt cần lấy .id
      if (idFieldMap[field]) {
        value = data?.[idFieldMap[field]]?.id || ''
      }
      // Nếu là field động từ ReportCols
      else if (directFields.has(field)) {
        value = data?.[field] || ''
      }
      // Mặc định
      else {
        value = data?.[field] != null ? String(data[field]) : ''
      }

      return value
    })
    .filter((value) => value !== '')

  if (values.length === 0) {
    return null
  }
  return values.join('-')
}
const updateSelection = (
  row: RowComponent,
  selected: boolean,
  forceUpdateHighlight = true
) => {
  const data = row.getData()
  const rowKey = generateRowKey(data)
  data.selected = selected
  try {
    row.update({ selected })
  } catch (error) {
    Logging.error('[updateSelection] Error updating row data:', error)
  }

  // Chỉ cập nhật class highlight nếu được cho phép (mặc định true)
  if (forceUpdateHighlight) {
    const rowEl = row.getElement()
    if (selected) {
      rowEl.classList.add('tabulator-selected')
    } else {
      rowEl.classList.remove('tabulator-selected')
    }
  }

  // eslint-disable-next-line no-unused-expressions
  selected
    ? reportStoreV2.selectedRowsMap.set(rowKey, true)
    : reportStoreV2.selectedRowsMap.delete(rowKey)

  // const items = reportStoreV2.reportDataV2.items
  // if (items) {
  //   const itemIndex = items.findIndex((item) => generateRowKey(item) === rowKey)
  //   if (itemIndex !== -1) {
  //     items[itemIndex].selected = selected
  //   }
  // }
}

const initEvents = () => {
  if (reportStoreV2.reportSettingsNew.selectBox) {
    tabulator.value?.on('rowClick', (e, row: RowComponent) => {
      const rowElement = row.getElement()
      const isInsideFooter = rowElement.closest('.tabulator-footer') !== null
      // const isTotalRow = rowElement.classList.contains('tabulator-calcs-bottom')

      // // Ngăn hành động nếu là hàng tổng, footer hoặc click vào ô action_camp
      if (isInsideFooter) {
        e.stopPropagation()
        e.preventDefault()
        return
      }
      const data = row.getData()
      const cell =
        tabulator.value?.getColumn('selected') && row.getCell('selected')
      const cellElement = cell?.getElement() || null
      const targetElement = e.target as HTMLElement

      const isCheckboxClick = cellElement
        ? !!targetElement.closest('.n-checkbox') ||
          !!targetElement.querySelector('.n-checkbox')?.contains(targetElement)
        : false

      if (isCheckboxClick) {
        updateSelection(row, !data.selected)
      } else if (!data.selected) {
        // Chỉ highlight nếu chưa được chọn, và không cho phép remove highlight
        updateSelection(row, true, false)
      }
    })
  } else {
    tabulator.value?.on('rowClick', (e, row: RowComponent) => {
      const data = row.getData()
      updateSelection(row, !data.selected)
    })
  }

  // Sự kiện headerClick giữ nguyên
  tabulator.value?.on('headerClick', function (e, column: ColumnComponent) {
    const field = column.getField() || ''
    if (!field || reportStoreV2.isSortDisabled(field)) {
      return
    }
    if (field === 'selected') {
      isSelectAll.value = !isSelectAll.value
      const headerCheckbox = column
        .getElement()
        .querySelector('.selected-box') as HTMLInputElement
      if (headerCheckbox) {
        headerCheckbox.checked = isSelectAll.value
      }
      // Cập nhật tất cả các hàng
      setTimeout(() => {
        const rows = tabulator.value?.getRows() || []
        const updatedItems = [...(reportStoreV2.reportDataV2.items || [])]

        rows.forEach((row, index) => {
          const data = row.getData()
          const rowKey = generateRowKey(data)

          updateSelection(row, isSelectAll.value)

          const itemIndex = updatedItems.findIndex(
            (item) => generateRowKey(item) === rowKey
          )
          if (itemIndex !== -1) {
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              selected: isSelectAll.value,
            }
          }
        })

        reportStoreV2.reportDataV2.items = updatedItems
      }, 0)
      return
    }
    if (!reportStoreV2.reportSettingsNew.sortDirection) {
      tableIsLoading.value = true
      if (field) {
        let dirTemp = 'desc'
        if (field === preSort.value) {
          dirTemp = reportStoreV2.sort[0].dir === 'desc' ? 'asc' : 'desc'
        } else {
          dirTemp = 'desc'
        }
        reportStoreV2.sort[0] = {
          dir: dirTemp,
          field: field,
        }
        replaceTableData()
        fmt.Println('event headerClick')
        preSort.value = field
      }
      tableIsLoading.value = false
    } else {
      const target = e.target as HTMLElement
      if (
        target.classList.contains('freeze-toggle') ||
        target.closest('.freeze-toggle')
      ) {
        return
      }

      const rect = column.getElement().getBoundingClientRect()
      sortPopup.value = {
        visible: true,
        field: field,
        position: {
          x: rect.left,
          y: rect.bottom + 5,
        },
      }
    }
  })

  tabulator.value?.on('tableBuilt', () => {
    const headerCheckbox = document.querySelector(
      '.selected-box'
    ) as HTMLInputElement
    if (headerCheckbox) {
      headerCheckbox.checked = isSelectAll.value
    }

    addStickyScrollBar()
    adjustColumnWidths()
    setupContextMenu()
    eventLongPressInMobile()
    eventCopyKeyword()
    syncStickyCheckboxState()
  })

  tabulator.value?.on('dataProcessing', function () {
    fmt.Time('dataProcessing')
    tableIsRendering.value = true
  })

  tabulator.value?.on('dataProcessed', function () {
    tableIsRendering.value = false
    fmt.TimeEnd('dataProcessing')
  })
}

const handleSortSelect = (dir: 'asc' | 'desc') => {
  const field = sortPopup.value.field
  if (!field) return

  tableIsLoading.value = true

  reportStoreV2.sort[0] = {
    dir: dir,
    field: field,
  }

  replaceTableData()
  preSort.value = field

  sortPopup.value.visible = false
  tableIsLoading.value = false
}

const initEventCopy = ref(false)
const initEventLongPress = ref(false)
const initEventContextMenu = ref(false)

const syncStickyCheckboxState = () => {
  const stickyMap = [
    {
      selector: '.campaign-checkbox .selected-box',
      value: isStickyCampaign.value,
    },
    { selector: '.date-checkbox .selected-box', value: isStickyDate.value },
    {
      selector: '.action-checkbox .selected-box',
      value: isStickyActionCamp.value,
    },
  ]

  stickyMap.forEach(({ selector, value }) => {
    const el = document.querySelector<HTMLInputElement>(selector)
    if (el) el.checked = value
  })
}

const eventCopyKeyword = () => {
  if (initEventCopy.value) return
  initEventCopy.value = true
  const tableElement = document.querySelector(`#${tableID}`)
  if (!tableElement) return

  tableElement.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    if (!target.classList.contains('kw-class') || !target.textContent) return

    helper.copyText(target.textContent || '')

    window.message.success('Success')
  })
}

const eventLongPressInMobile = () => {
  if (initEventLongPress.value) return
  initEventLongPress.value = true

  const tableElement = document.querySelector(`#${tableID}`)
  if (!tableElement) return
  let pressTimer: number | undefined
  let moved = false

  tableElement.addEventListener('touchstart', (e) => {
    moved = false

    pressTimer = setTimeout(() => {
      if (!moved) {
        e.preventDefault()
        initMenu(e)
      }
    }, 600) as unknown as number
  })

  const cancel = () => {
    clearTimeout(pressTimer)
  }

  tableElement.addEventListener('touchend', cancel)
  tableElement.addEventListener('touchmove', () => {
    moved = true // The user is swiping => not trigger long press
    clearTimeout(pressTimer)
  })
  tableElement.addEventListener('touchcancel', cancel)
}

//XỬ LÝ RIGHT-CLICK
const setupContextMenu = () => {
  if (initEventContextMenu.value) return
  initEventContextMenu.value = true
  const tableElement = document.querySelector(`#${tableID}`)
  if (!tableElement) return

  tableElement.addEventListener('contextmenu', () => {
    tableElement.addEventListener('contextmenu', handleContextMenuEvent)
  })

  if (!(tableElement as any)._contextMenuBound) {
    tableElement.addEventListener('contextmenu', handleContextMenuEvent)
    ;(tableElement as any)._contextMenuBound = true
  }
}

// HÀM HIỂN THỊ CONTEXT MENU CHÍNH
const handleContextMenuEvent = (e: Event) => {
  const mouseEvent = e as MouseEvent
  if (mouseEvent.type !== 'contextmenu') return
  const target = e.target as HTMLElement

  if (
    target.closest('.tabulator-header') ||
    target.closest('.tabulator-col-resize-handle') ||
    target.closest('.tabulator-calcs') ||
    target.closest('.tabulator-footer')
  ) {
    return
  }
  initMenu(e)
}

const initMenu = (e: Event) => {
  if (!reportStoreV2.group_by.includes('campaign')) return

  e.preventDefault()
  e.stopPropagation()
  const target = e.target as HTMLElement
  const cellElement = target.closest('.tabulator-cell') as HTMLElement
  if (!cellElement) {
    console.error('No cell element found')
    return
  }
  const field = cellElement.getAttribute('tabulator-field')
  if (!field) {
    console.error('No field attribute found')
    return
  }
  // THAY ĐỔI: Thêm rowIndex vào tham số của clickMenu
  const clickMenu = (e: any, cell: any, rowIndex: number, rowKey: string) =>
    campaignMenuClick(e, cell, dialog, rowIndex, rowKey) // Truyền rowIndex để dùng trong campaignMenuClick
  if (clickMenu) {
    const rowElement = cellElement.closest('.tabulator-row') as HTMLElement
    let rowData = {}
    let tabulatorRow: any = null
    let rowIndex = -1
    let rowKey = ''
    if (rowElement && tabulator.value) {
      try {
        // Lấy RowComponent chuẩn từ element của Tabulator
        tabulatorRow = tabulator.value.getRow(rowElement)

        if (tabulatorRow) {
          rowData = tabulatorRow.getData()
          rowKey = generateRowKey(rowData) || ''

          // console.warn(
          //   `Click debug => Campaign name: ${rowData?.campaign_name?.name}, ID: ${rowData?.campaign_name?.id}, RowKey: ${rowKey}`
          // )

          // Tìm index thực tế trong store (không dựa vào vị trí DOM)
          if (reportStoreV2.reportDataV2.items) {
            rowIndex = reportStoreV2.reportDataV2.items.findIndex(
              (item: any) => generateRowKey(item) === rowKey
            )
          }
        }
      } catch (error) {
        console.error('Could not get row data:', error)
      }
    }
    const fakeCell = {
      getData: () => rowData,
      getValue: () => {
        const data = rowData as any
        return data[field] || ''
      },
      getColumn: () => ({
        getField: () => field,
        getDefinition: () => ({ field }),
      }),
      getElement: () => cellElement,
      getRow: () =>
        tabulatorRow || {
          getData: () => rowData,
          getElement: () => rowElement,
          update: (data: any) => {
            if (tabulatorRow) {
              try {
                tabulatorRow.update(data)
              } catch (error) {
                Logging.error(
                  '[fakeCell.getRow.update] Error updating row data:',
                  error
                )
              }
            }
          },
          getIndex: () => rowIndex,
        },
    }
    // THAY ĐỔI: Truyền rowIndex vào clickMenu

    const menuItems = clickMenu(e, fakeCell, rowIndex, rowKey)
    if (menuItems && Array.isArray(menuItems)) {
      showContextMenu(e as MouseEvent, menuItems, fakeCell)
    }
  } else {
    console.error('No click menu found for field:', field)
  }
}

// THÊM FUNCTION ĐỂ HIỂN THỊ CONTEXT MENU
const showContextMenu = (e: MouseEvent, menuItems: any[], cell: any) => {
  // Remove existing menu
  const existingMenu = document.querySelector('.tabulator-menu')

  if (existingMenu) {
    existingMenu.remove()
  }
  // Create menu element
  const menu = document.createElement('div')
  menu.className = 'tabulator-menu'
  menu.style.cssText = `
    position: absolute;
    top: ${e.pageY}px;
    left: ${e.pageX}px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    min-width: 200px;
  `

  // Add menu items
  menuItems.forEach((item) => {
    const menuItem = document.createElement('div')
    menuItem.className = 'tabulator-menu-item'
    menuItem.style.cssText = `
      cursor: pointer;
      border-bottom: 1px solid #eee;
    `
    menuItem.innerHTML = item.label || 'Menu Item'

    // Add hover effect
    menuItem.addEventListener('mouseenter', () => {
      menuItem.style.backgroundColor = '#f5f5f5'
    })
    menuItem.addEventListener('mouseleave', () => {
      menuItem.style.backgroundColor = 'white'
    })

    // Add click handler
    menuItem.addEventListener('click', (clickEvent) => {
      if (item.action) {
        item.action(clickEvent, cell)
      } else if (item.label?.includes('href')) {
        const href = helper.extractHref(item.label)
        if (href) {
          window.open(href, '_blank')
        }
      }
      menu.remove()
    })

    menu.appendChild(menuItem)
  })
  // Add to document
  document.body.appendChild(menu)

  const rect = menu.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let left = e.pageX
  let top = e.pageY

  if (rect.right > viewportWidth) {
    left = Math.max(0, e.pageX - rect.width)
  }

  const forceUp = (menuItems as any).__forceUp
  if (forceUp) {
    top = Math.max(0, e.pageY - rect.height)
    menu.classList.add('force-upward')
  } else if (rect.bottom > viewportHeight) {
    top = Math.max(0, e.pageY - rect.height)
  }

  menu.style.left = `${left}px`
  menu.style.top = `${top}px`
  menu.style.visibility = 'visible'

  // Remove menu when clicking outside
  const removeMenu = (event: Event) => {
    if (!menu.contains(event.target as Node)) {
      menu.remove()
      document.removeEventListener('click', removeMenu)
    }
  }
  setTimeout(() => {
    document.addEventListener('click', removeMenu)
  }, 100)
  // const rect = menu.getBoundingClientRect()
  // if (rect.right > window.innerWidth) {
  //   menu.style.left = `${e.pageX - rect.width}px`
  // }
  // if (rect.bottom > window.innerHeight) {
  //   menu.style.top = `${e.pageY - rect.height}px`
  // }
}

onMounted(() => {
  // Existing freeze toggle logic
  const handleFreezeToggle = (event: Event) => {
    event.stopPropagation()
    const target = event.target as HTMLElement
    const field = target.dataset?.field
    if (field === 'date') {
      localStorage.setItem('stickyDateCol', `${!isStickyDate.value}`)
      isStickyDate.value = !isStickyDate.value
    }
    if (field === 'campaign') {
      localStorage.setItem('stickyCampaignCol', `${!isStickyCampaign.value}`)
      isStickyCampaign.value = !isStickyCampaign.value
    }
    if (field === 'action_camp') {
      localStorage.setItem(
        'stickyActionCampCol',
        `${!isStickyActionCamp.value}`
      )
      isStickyActionCamp.value = !isStickyActionCamp.value
    }
    try {
      replaceTableData()
      fmt.Println('handleFreezeToggle')
    } catch (error) {
      console.error('Error in replaceTableData:', error)
    }
  }
  // Use vanilla JavaScript instead of jQuery
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('freeze-toggle')) {
      handleFreezeToggle(e)
    }
  })
})

onActivated(() => {
  //Hiện lại

  $('#sticky-scroll-holder').removeClass('hidden')
})

onDeactivated((opts?: Record<string, any>) => {
  //ẩn đi
  $('#sticky-scroll-holder').addClass('hidden')
})

const isAnt = window.arb.isAnt()

onBeforeUnmount(() => {
  //remove fake scroll bar when leave page

  $('#sticky-scroll-holder').remove()
  // Remove context menu listener
  const tableElement = document.querySelector(`#${tableID}`)
  if (tableElement) {
    tableElement.removeEventListener('contextmenu', handleContextMenuEvent)
  }
  // Remove any existing context menu
  const existingMenu = document.querySelector('.tabulator-menu')
  if (existingMenu) existingMenu.remove()
})

const initTable = () => {
  //Init bảng khi đã chuyển trang thì stop

  if (!table.value) return
  try {
    const tabulatorSetting: Options = {
      layout: 'fitDataFill',
      data: reportStoreV2.reportDataV2?.items || [], //link data to table
      reactiveData: true, //enable data reactivity
      placeholder: '<div class="w-full">No Data Available</div>',
      debugInvalidOptions: false,
      // selectable: true, //make rows selectable
      movableColumns: isMobile || isTablet ? false : true,
      rowHeight: rowHeightCellSpacing.value,

      headerSortElement: function (column, dir) {
        switch (true) {
          case reportStoreV2.sort[0].field === column.getField() &&
            reportStoreV2.sort[0].dir === 'asc':
            return icons.sortasc()

          case reportStoreV2.sort[0].field === column.getField() &&
            reportStoreV2.sort[0].dir === 'desc':
            return icons.sortdesc()

          default:
            return icons.sort()
        }
      },
      rowFormatter: function (row) {
        const data = row.getData()

        const rowElement = row.getElement()

        // Check if the row is the total row
        const isTotalRow = rowElement.classList.contains(
          'tabulator-calcs-bottom'
        )

        if (isTotalRow) {
          const cells = rowElement.querySelectorAll('.tabulator-cell')

          cells.forEach((cell) => {
            if (cell instanceof HTMLElement) {
              const text = cell.innerText.replace(/\u00A0/g, '').trim()

              if (text === '') {
                cell.style.pointerEvents = 'none'
              }
            }
          })

          return
        }

        if (data?.section?.is_block_global)
          row.getElement().style.backgroundColor = 'darksalmon'
        if (data?.status?.status === 'off')
          row.getElement().style.opacity = '0.5'

        //Bôi màu các publisher Rejected //Khánh
        if (data?.publisher?.status === 3) {
          row.getElement().classList.add('highlight-status-3')
        }

        if (
          !reportStoreV2.reportSettingsNew.isProfitLossColoringDisabled &&
          !reportStoreV2.reportOptions.isReportCampPreview()
        ) {
          if (data?.profit > 0) {
            row.getElement().classList.add('profit-positive')
          } else {
            row.getElement().classList.add('highlight-status-3')
          }
        }

        if (data.selected) {
          rowElement.classList.add('tabulator-selected')
        } else {
          rowElement.classList.remove('tabulator-selected')
        }

        if (isAnt) {
          if (data?.profit < 0) {
            rowElement.classList.add('ant-color-negative')
          }
        }
      },

      columnDefaults: {
        vertAlign: 'middle',
      } as ColumnDefinition,

      columns: columns.value as ColumnDefinition[],
    }

    fmt.Info('tabulatorSetting', tabulatorSetting)
    tabulator.value = new Tabulator(table.value, tabulatorSetting)
    tabulator.value.on('tableBuilt', () => {
      tabulator.value?.getColumns().forEach((col) => {
        const field = col.getField()
        if (reportStoreV2.group_by?.includes(field)) {
          col.getElement().classList.add('columns-group-by')
        }
      })
    })
  } catch (error) {
    fmt.Error(error)
  }
}
window.addEventListener('resize', async () => {
  if (tabulator.value) {
    adjustColumnWidths()
  }
})

onActivated(async () => {
  if (isFirstInit.value) return
  adjustColumnWidths() // Điều chỉnh lại width sau khi reflow hoàn tất
})

const cleanupSelectedRowsMap = () => {
  const validKeys = new Set<string>()

  reportStoreV2.reportDataV2.items?.forEach((item: any) => {
    const key = generateRowKey(item)
    if (key) validKeys.add(key)
  })

  const keysToDelete: string[] = []
  reportStoreV2.selectedRowsMap.forEach((value, key) => {
    if (!validKeys.has(key)) keysToDelete.push(key)
  })

  keysToDelete.forEach((key) => {
    reportStoreV2.selectedRowsMap.delete(key)
  })
}

const fetchLoggingCampaign = async () => {
  if (!isAnt) return

  const isGroupByCampaign = reportStoreV2.group_by?.find(
    (item) => item === 'campaign'
  )

  const isAction_camp = reportStoreV2.listColAccepted?.find(
    (item) => item === 'action_camp'
  )

  let campaignEmpty: Map<number, any[]> = new Map()

  if (isGroupByCampaign && isAction_camp) {
    const campaignIds =
      reportStoreV2.reportDataV2?.items
        ?.map((item: any) => `${item?.campaign_name?.id}`)
        .filter(Boolean) || []

    if (campaignIds.length > 0) {
      const payload = {
        campaign_ids: campaignIds,
        start_date: `${date2.today(reportStoreV2.timezone)} 00:00:00`,
        // start_date: `2025-09-01 00:00:00`,
        end_date: `${date2.today(reportStoreV2.timezone)} 23:59:59`,
      }
      const loggingResult = await ctr_logging.Campaign(payload)

      ;(loggingResult?.data || []).forEach((log: any) => {
        if (!campaignEmpty.has(log.object_id)) {
          campaignEmpty.set(log.object_id, [])
        }
        campaignEmpty.get(log.object_id)!.push(log)
      })

      reportStoreV2.reportDataV2?.items?.forEach((item: any) => {
        const campaignMeta = campaignEmpty.get(item.campaign_name.id) || []

        if (campaignMeta.length > 0) {
          item.loggingToolTip =
            campaignMeta?.filter((item) => item.type !== 'add') || []
        }
      })
    }
  }
}
const replaceTableDataIsChange = ref(0)
//using to initial and replace data for table
const replaceTableData = debounceV2(async () => {
  fmt.Println('replaceTableData')
  fmt.Time('all')
  fmt.Time('fetch')
  if (isFirstPageChange.value) isFirstPageChange.value = false

  tableIsLoading.value = true

  //destroy table if group by is changed. Replace data for table if not
  if (!isFirstInit.value) tabulator.value?.destroy()

  await reportStoreV2.fetchReport()

  //ham xoa key cu
  cleanupSelectedRowsMap()

  if (reportStoreV2.reportDataV2.items) {
    reportStoreV2.reportDataV2.items = reportStoreV2.reportDataV2.items.map(
      (item: any) => {
        const newKey = generateRowKey(item)
        // const isSelected = newKey
        //   ? reportStoreV2.selectedRowsMap.has(newKey)
        //   : false
        return {
          ...item,
          selected: reportStoreV2.selectedRowsMap.has(newKey),
          loggingToolTip: null,
        }
      }
    )
  }

  fmt.TimeEnd('fetch')

  fmt.Time('initTable')
  initTable()
  fmt.TimeEnd('initTable')

  fmt.Time('initEvents')

  initEvents()
  fmt.TimeEnd('initEvents')

  isFirstInit.value = false
  tableIsLoading.value = false
  fmt.TimeEnd('all')
  await nextTick()

  replaceTableDataIsChange.value += 1
}, 300)

defineExpose({
  replaceTableData,
})

watch(
  () => replaceTableDataIsChange.value,
  (value) => {
    fetchLoggingCampaign()
  }
)

watch(
  [filterComputed, groupByComputed, timeZoneComputed, timeIntervalComputed],
  async () => {
    if (!isFirstPageChange.value && reportStoreV2.autoSync) {
      replaceTableData()
      fmt.Println('watch')
    }
  },
  { deep: true, immediate: true }
)
watch(
  [filterDateComputed],
  () => {
    if (
      !isFirstPageChange.value &&
      (reportStoreV2.autoSync || reportStoreV2.reportSettingsNew.autoUpdate)
    ) {
      fmt.Println('filterDateComputed')

      replaceTableData()
    }
  },
  { deep: true, immediate: true }
)

watch([page, size], () => {
  if (!isFirstPageChange.value && !reportStoreV2.autoSync) {
    fmt.Println('page, size„')

    replaceTableData()
  }
})

watch(
  () => reportStoreV2.updateClicked,
  () => {
    fmt.Println('updateClicked')

    replaceTableData()
  }
)

watch(
  () => reportStoreV2.downloadExcelNow,
  () => {
    downloadExcelFile()
  }
)
watch(
  () => reportStoreV2.isReloadTable,
  () => {
    if (tabulator.value) tabulator.value.redraw(true)
  }
)
const isGroupByDate = computed(() => reportStoreV2.group_by.includes('date'))
const isSmartSticky = computed(
  () => reportStoreV2.reportSettingsNew.smartStickyDate
)

const shouldSticky = computed(() => isGroupByDate.value && isSmartSticky.value)
watch(shouldSticky, (val) => {
  if (val) {
    isStickyDate.value = true
    localStorage.setItem('stickyDateCol', `${isStickyDate.value}`)
  }
})

const resetTitle = computed(() => {
  return reportStoreV2.filter['campaigns']
})
watch(
  () => resetTitle.value,
  (newValue, oldValue) => {
    if (newValue?.length === 0) {
      document.title = reportStoreV2.originalTitle
    }
  }
)
// Hàm để tạo và tải xuống file Excel
const downloadExcelFile = async () => {
  const ignoredColumns = ['action_camp', 'whitelist', 'cpc_adjustment']

  try {
    const fullData = reportStoreV2.reportDataV2.items
    const exportData = []

    const headersName: string[] = []

    const headers = reportStoreV2.ReportCols.filter(
      (element) =>
        element.key &&
        reportStoreV2.listColAccepted.includes(element.key) &&
        !ignoredColumns.includes(element.key)
    ).map((element) => {
      const key = element.key === 'campaign' ? 'campaign_name' : element.key
      headersName.push(reportStoreV2.getTitleByKey(element.key as string))
      return key as string
    })

    exportData.push(headersName)

    fullData?.forEach((element) => {
      const row = headers.map((e: string) => {
        switch (e) {
          case 'campaign_name':
          case 'section':
            return element[e]?.name || ''
          case 'status':
            return element[e]?.status || ''

          case 'ad_id':
            return element[e]?.name || element[e]?.id || ''

          case 'bidding':
            return element.campaign_name?.bidding || ''

          case 'cpc':
            return element?.campaign_name?.cpc || ''

          case 'budget':
            return element?.campaign_name?.budget || ''

          case 'landing_page_id':
            return (
              element['landing_page']?.name || element['landing_page']?.id || ''
            )

          case 'ab_test_domain':
            return element?.campaign_name?.ab_test_domain || ''

          case 'delivery_status':
            return element?.campaign_name?.delivery_status || ''

          case 'publisher':
            let showName = ''

            const pubData = element[e]
            if (pubData) {
              if (pubData?.first_name || pubData?.last_name) {
                showName = `${pubData?.first_name} ${pubData?.last_name}`
              }
              if (pubData?.email) {
                showName += ` (${pubData.email})`
              }
            }

            return showName || ''
          case 'account_demand_id':
            return element['account_demand']?.name || ''

          default:
            return element[e]
        }
      })

      exportData.push(row)
    })

    await exportToExcel(exportData, 'report.xlsx')
  } catch (error) {
    console.error(error)
  }
}

const rowHeightCellSpacing = computed(() => {
  const mapping: Record<string, number> = {
    compact: 29,
    normal: 39,
    wide: 49,
  }
  return mapping[reportStoreV2.reportSettingsNew?.cellSpacing ?? 39]
})

const acceptedColumns = computed(() => {
  const reportCols = reportStoreV2.ReportCols ?? []

  const accepted = reportStoreV2.listColAccepted ?? []

  if (!Array.isArray(reportCols) || !Array.isArray(accepted)) {
    return []
  }

  return reportCols.filter((col) => {
    if (!col || typeof col.key === 'undefined' || col.key === null) {
      return false
    }

    return accepted.includes(col.key)
  })
})

const currentType = ref<'date' | 'ad_group'>('date')

const keyMapping = computed<Record<string, string>>(() => ({
  campaign: currentType.value === 'date' ? 'date' : 'ad_group_id',
  status: 'ad_group.status',
  section: 'section.id',
}))

const getValueByPath = (obj: any, path: string) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj)

const formatValue = (
  value: any,
  type: string,
  precision: number = 2
): string => {
  if (value == null) return ''
  if (value === 0) return '-'

  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  const formatters: Record<string, (v: any) => string> = {
    money: (v) => `$${numberFormatter.format(Number(v))}`,
    percent: (v) => `${Number(v).toFixed(precision)}%`,
    number: (v) => numberFormatter.format(Number(v)),
  }

  return (formatters[type] || ((v) => String(v)))(value)
}

const mappedDataByColumns = computed(() => {
  const cols = acceptedColumns.value
  const rows = reportStoreV2.dataCampaignDetail ?? []

  return rows.map((row: any) => {
    const formattedRow: Record<string, any> = {}

    cols.forEach((col: any) => {
      const rawValue = getValueByPath(row, keyMapping.value[col.key] || col.key)
      const formattedValue = formatValue(rawValue, col.type, col.precision)
      formattedRow[col.key] = formattedValue
    })
    formattedRow.campaign_id = row?.campaign_name?.id ?? null
    formattedRow.ad_group_name = row?.ad_group?.name ?? null
    formattedRow.ad_group_id = row?.ad_group?.ad_group_id ?? null
    return formattedRow
  })
})

const columnsInfo = computed(() => {
  if (!tabulator.value) return []

  const alignMap: Record<string, string> = {
    left: 'start',
    center: 'center',
    right: 'end',
  }
  return tabulator.value.getColumns().map((col) => {
    const field = col.getField()
    const actualWidth = col.getWidth()
    const hozAlignRaw = col.getDefinition().hozAlign || 'left'
    const vertAlign = col.getDefinition().vertAlign || 'top'

    return {
      field,
      width: actualWidth,
      hozAlign: alignMap[hozAlignRaw] || 'start',
      vertAlign,
    }
  })
})

const getPaddingByField = (field: string): string => {
  if (field === 'status') return '0px 8px 0 0'
  return ['publisher', 'date', 'campaign'].includes(field)
    ? '8px 6px'
    : '8px 14px'
}

const renderRowValues = (dataList: any[], title?: string) => {
  if (!dataList || dataList.length === 0) return '<em>No data</em>'

  let html = '<div class="font-mono text-sm">'
  const rowHeight = rowHeightCellSpacing.value
  if (title) {
    html += `
      <div class="flex tabulator-row"
           style="background:#fff; border-bottom:1px solid #dee2e6; font-weight:600;">
        <div class="flex items-center" style="padding:12px; position: sticky;left: 0; z-index: 20;">
          <h4 class="font-semibold">${title}</h4>
          <button class="ml-2 text-gray-400 hover:text-gray-600 close-btn">✖</button>
        </div>
      </div>
    `
  }
  dataList.forEach((row, rowIndex) => {
    let rowBgColor = ''
    let hoverBg = ''

    const profitValue = row['profit']
    if (profitValue != null) {
      const numericProfit =
        parseFloat(profitValue.toString().replace(/[$,]/g, '')) || 0
      if (numericProfit > 0) {
        rowBgColor = '#daf2d0'
        hoverBg =
          'linear-gradient(rgba(200,200,200,0.3), rgba(200,200,200,0.3)), #daf2d0'
      } else if (numericProfit < 0) {
        rowBgColor = '#fae2d5'
        hoverBg =
          'linear-gradient(rgba(200,200,200,0.3), rgba(200,200,200,0.3)), #fae2d5'
      }
    }

    let borderBottom = ''
    if (rowIndex === dataList.length - 1) {
      borderBottom = 'border-bottom: 1px solid #dee2e6;'
    }

    html += `<div class="flex tabulator-row" style="background:${rowBgColor}; ${borderBottom}" onmouseover="this.style.background='${hoverBg}'" onmouseout="this.style.background='${rowBgColor}'">`

    let leftOffset = 0

    columnsInfo.value.forEach((col, index) => {
      let value = row[col.field] ?? ''

      if (col.field === 'campaign') {
        const campaignMap: Record<'date' | 'ad_group', any> = {
          date: row?.campaign,
          ad_group: row?.ad_group_name,
        }
        value = campaignMap[currentType.value] || 'N/A'
      }

      if (col.field === 'publisher') {
        const name =
          [value?.first_name, value?.last_name].filter(Boolean).join(' ') ||
          'Unknown Name'
        const email = value?.email || 'Unknown'
        value = `<div style="white-space: pre-line;">${name}\n${email}</div>`
      }

      if (col.field === 'status') {
        value = ''

        if (
          currentType.value !== 'date' &&
          shouldShowStatusSwitch(row?.ad_group_id)
        ) {
          const isOn = row[col.field] === 'on'
          value = `<div class="switch ${
            isOn ? 'switch-on' : 'switch-off'
          }"></div>`
        }
      }

      let stickyStyle = ''
      if (
        index < (isStickyActionCamp.value ? 3 : 4) &&
        isStickyCampaign.value
      ) {
        stickyStyle = `position: sticky; left: ${leftOffset}px; z-index: ${
          1 + index
        }; background: inherit`
        leftOffset += col.width
      }

      if (index === columnsInfo.value.length - 1 && isStickyActionCamp.value) {
        stickyStyle = `position: sticky; right: 0; z-index: 1; background: inherit;`
      }

      html += `
        <div
          class="overflow-hidden flex items-center text-ellipsis whitespace-nowrap justify-${
            col.hozAlign
          }"
          style="
            position: relative;
            width:${col.width}px;
            color:#414141;
            font-size:12px;
            font-family:Inter, sans-serif;
            padding:${getPaddingByField(col.field)};
            height:${rowHeight}px;
            ${stickyStyle};
          "
        >
          ${value}
        </div>
      `
    })

    html += `</div>`
  })

  html += '</div>'
  return html
}

const closeCampaignDetail = (
  rowElem: HTMLElement & { _detail?: HTMLElement }
) => {
  if (rowElem._detail) {
    rowElem._detail.remove()
    rowElem._detail = undefined
    rowElem.removeAttribute('data-has-detail')
  }
  const holder = document.querySelector<HTMLElement>(
    '.table-report1 .tabulator .tabulator-tableholder'
  )
  if (holder) holder.style.overflowY = ''
}

const showCampaignDetail = async (
  row: RowComponent,
  title: string,
  bgColor: string,
  borderColor: string
): Promise<void> => {
  const rowElem = row?.getElement() as HTMLElement & { _detail?: HTMLElement }
  const data = row?.getData()
  const campaignId = data?.campaign_name?.id

  document
    .querySelectorAll<HTMLElement>('.expand-content.active')
    .forEach((el) => el.remove())
  document
    .querySelectorAll<HTMLElement>('[data-has-detail="true"]')
    .forEach((el) => {
      el.removeAttribute('data-has-detail')
    })

  if (
    rowElem._detail &&
    rowElem._detail.id === `detail-${currentType.value}-${campaignId}`
  ) {
    closeCampaignDetail(rowElem)
    return
  }

  closeCampaignDetail(rowElem)

  const detail = document.createElement('div')
  detail.id = `detail-${currentType.value}-${campaignId}`
  detail.className = `expand-content ${bgColor} border-l-4 ${borderColor} active`
  detail.innerHTML = `<div class="p-4 text-gray-500">⏳ Loading...</div>`
  rowElem.after(detail)
  rowElem._detail = detail
  rowElem.setAttribute('data-has-detail', 'true')

  const holder = document.querySelector<HTMLElement>(
    '.table-report1 .tabulator .tabulator-tableholder'
  )
  if (holder) holder.style.overflowY = 'auto'

  await reportStoreV2.fetchCampaignDetail(data, currentType.value)

  const dataList = mappedDataByColumns.value

  if (dataList.length > 0) {
    detail.replaceChildren()
    detail.innerHTML = renderRowValues(dataList, title)
    const closeBtn = detail.querySelector<HTMLButtonElement>('.close-btn')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeCampaignDetail(rowElem))
    }
    const toggles = detail.querySelectorAll<HTMLDivElement>('.switch')

    toggles.forEach((toggle, idx) => {
      const item = dataList[idx]
      const campaign_id = item?.campaign_id
      const ad_group_id = item?.ad_group_id
      toggle.addEventListener('click', (e) => {
        e.stopPropagation()
        const isOn = toggle.classList.contains('switch-on')
        const status = isOn ? 'on' : 'off'
        changeStatus(campaign_id, ad_group_id, status, toggle)
      })
    })
  } else {
    detail.innerHTML = `<div class="p-4"><em>No data</em></div>`
  }
}

const shouldShowStatusSwitch = (adGroupId: unknown): boolean => {
  return typeof adGroupId === 'string' && /^\d+$/.test(adGroupId)
}

const changeStatus = async (
  campaign_id: number,
  ad_group_id: number,
  status: string,
  toggle?: HTMLDivElement
) => {
  if (!ad_group_id) {
    window.message.warning('ID does not exist')
    return
  }

  const newStatus = status === 'on' ? 'off' : 'on'
  const message = `Are you sure you want to change status to ${newStatus}?`
  if (!window.confirm(message)) return

  const loading = window.message.loading(
    'Changing is in process. Please wait...'
  )

  try {
    const result = await ctr_campaign.ChangeStatusAdGroup({
      id: campaign_id,
      status: newStatus,
      campaign_id: campaign_id,
      ad_group_id: ad_group_id,
    })

    if (result?.status) {
      if (toggle) {
        toggle.classList.remove('switch-on', 'switch-off')
        toggle.classList.add(newStatus === 'on' ? 'switch-on' : 'switch-off')
      }

      window.message.success('Status updated successfully')
    } else {
      window.message.error('Failed to update status')
    }
  } catch {
    window.message.error('Error occurred while changing status')
  } finally {
    loading.destroy()
  }
}

const showWeekData = async (row: RowComponent): Promise<void> => {
  currentType.value = 'date'
  await showCampaignDetail(
    row,
    'Data from the last 7 days',
    'bg-blue-50',
    'border-blue-500'
  )
}

const showAdGroupData = async (row: RowComponent): Promise<void> => {
  currentType.value = 'ad_group'
  await showCampaignDetail(
    row,
    'Data by Ad Group',
    'bg-green-50',
    'border-green-500'
  )
}

const isLoadTableDataInChunks = computed(
  () => size.value > 100 && reportStoreV2.reportDataV2?.items?.length > 100
)
</script>

<template>
  <div id="test-report">
    <div
      :class="[
        'table-report1',
        {
          'no-content': !reportStoreV2.reportDataV2?.items?.length,
          'table-report-overview': isLoadTableDataInChunks,
        },
      ]"
    >
      <div v-show="tableIsLoading || tableIsRendering">
        <SkeletonV2 />
      </div>
      <div class="bg-white">
        <div v-show="!tableIsLoading" :id="tableID" ref="table"></div>
      </div>

      <PreviewAdFacebook />

      <PreviewAdTaboola />

      <DuplicateChangeCampaignType />

      <ModalBidding ref="modalBiddingComp" />
      <ModalBudgetFacebook ref="modalBudgetFacebookComp" />

      <ReportPaginationV2 :tableIsLoading="tableIsLoading" />

      <SortDirectionPopup
        v-model:visible="sortPopup.visible"
        :field="sortPopup.field"
        :current-dir="reportStoreV2.sort[0]?.dir"
        :position="sortPopup.position"
        @select="handleSortSelect"
      />

      <BulkAction
        :tabulator="tabulator"
        v-if="reportStoreV2.canBulk && !reportStoreV2.showReportBulkAction"
      />

      <BulkButton
        v-if="reportStoreV2.canBulk && reportStoreV2.showReportBulkAction"
      />
    </div>
  </div>
</template>
<style lang="scss">
@use '@/css/ReportV2.scss';
@use '@/css/Report.scss';
</style>
<style lang="scss" scoped>
.row-q-custom {
  height: 250px;
  margin-top: 0px;
  width: 100%;
  left: 0px;
  padding: 0px 10px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-line-pack: center;
  align-content: center;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #e5e4e7;
}
.text-camp-custom-q {
  width: 100%;
  white-space: nowrap;
}
</style>
