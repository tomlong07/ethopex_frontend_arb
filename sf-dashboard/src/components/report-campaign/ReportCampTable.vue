<script setup lang="ts">
import {
  CellComponent,
  ColumnComponent,
  ColumnDefinition,
  TabulatorFull as Tabulator,
} from 'tabulator-tables'

import { debounceV2 } from '@/utils/index'
import icons from '@/utils/icons'

import Skeleton from '@/components/skeleton/Skeleton.vue'

import { useReportCamp } from '@/store/report-camp'

import { useLogicGoAndLeave } from '@/plugins/reuseable'
import { TypeFormatter } from '@/enum/report-v2'
const isMobile = helper.mobileDetect()

const reportCampStore = useReportCamp()

const tableIsLoading = ref<boolean>(false)
const tabulator = ref<null | Tabulator>(null)
const table = ref<string | HTMLElement>('')

const isFirstInit = ref<boolean>(true)
const preSort = ref<string>('')

const mute = ref<boolean>(true) // khóa watcher trong giai đoạn init
let inflight: Promise<void> | null = null // guard tránh gọi chồng request

const columns = computed<ColumnDefinition[]>(
  () => reportCampStore.ReportCols as ColumnDefinition[]
)
const pageCount = computed<number>(() => {
  if (!reportCampStore.reportData.items?.length) return 1
  const result =
    reportCampStore.reportData.total.records_total / reportCampStore.limit

  if (reportCampStore.page > Math.ceil(result)) {
    reportCampStore.page = 1
  }

  if (helper.isInt(result)) {
    return result
  }

  if (helper.isFloat(result)) {
    return Math.ceil(result)
  }

  return 1
})

// Gom toàn bộ state lại 1 chỗ để watch
const payload = computed(() => ({
  start: reportCampStore.start_date,
  end: reportCampStore.end_date,
  filter: reportCampStore.filter,
  group: reportCampStore.group_by,
  interval: reportCampStore.time_interval,
  tz: reportCampStore.timezone,
  page: reportCampStore.page,
  limit: reportCampStore.limit,
  sort: reportCampStore.sort,
  autoSync: reportCampStore.isAutoSync,
}))

onMounted(async () => {
  //reset filter when init (if have)
  mute.value = true
  reportCampStore.resetPayload()
  if (window.route.query?.plk) {
    await reportCampStore.fetchFilterByPlk(window.route.query.plk as string)
  }
  mute.value = false
})

onBeforeUnmount(() => {
  //remove fake scroll bar when leave page
  $('#tabulator-tableholder').remove()
})

const extractCellData = (cell: CellComponent) => {
  const data: any = cell.getData?.() || {}
  const value = cell.getValue?.() || {}
  const landingExt = data.landing_page_ext
  const publisherExt = data.publisher_ext

  return { data, value, landingExt, publisherExt }
}

const generateCol = (element: any) => {
  const isLandingPage = element.key === 'landingPageId'
  const isPublisher = element.key === 'userId'

  const formatLanding = (cell: CellComponent) => {
    const { value, landingExt } = extractCellData(cell)
    const id = landingExt?.id ?? value?.id
    const label = landingExt?.label ?? value?.label

    if (!id) return ''
    return `<div class="text-wrapper text-blue-500">${id}${
      label ? ': ' + label : ''
    }</div>`
  }

  const tooltipLanding = (_e: any, cell: CellComponent) => {
    const { value, landingExt } = extractCellData(cell)
    const id = landingExt?.id ?? value?.id
    const label = landingExt?.label ?? value?.label
    return id ? (label ? `${id}: ${label}` : `${id}`) : ''
  }

  const cellClickLanding = (_e: any, cell: CellComponent) => {
    const { value } = extractCellData(cell)
    const id = value?.id ?? value
    if (id && id > 0) window.open(`/landing_page/${id}`, '_blank')
  }

  const formatPublisher = (cell: CellComponent) => {
    const { value, publisherExt } = extractCellData(cell)
    const id = publisherExt?.id ?? value?.id
    const label = publisherExt?.label ?? value?.label

    if (!id) return ''
    return `<div class="text-wrapper text-blue-500">${label ?? ''}</div>`
  }

  const formatDefault = (cell: CellComponent) => {
    const value = cell.getValue?.()
    if (!value) return ''

    if (value && element.type) {
      switch (element.type) {
        case TypeFormatter.TypeNumber:
        case TypeFormatter.TypePercent:
          return helper.formatData(value, element.type)
        case TypeFormatter.TypeMoney:
          return helper.currencyFormatterAuto3(value)
      }
    }
    return element.isObject ? (value.label !== 0 ? value.label : '') : value
  }

  // Base column
  const col: ColumnDefinition = {
    title: element.title,
    field: element.key,
    headerSort: true,
    vertAlign: 'middle',
    visible: true,
    minWidth: 150,
  }

  // Tách từng if
  if (isLandingPage) {
    col.cssClass = 'text-object-cell'
    col.formatter = formatLanding
    col.tooltip = tooltipLanding
    col.cellClick = cellClickLanding
  }

  if (isPublisher) {
    col.cssClass = 'text-object-cell'
    col.formatter = formatPublisher
  }

  if (!isLandingPage && !isPublisher) {
    col.formatter = formatDefault
  }

  return col
}

const getColumnsBySelectedGroups = () => {
  return columns.value
    .filter(
      (col: any) =>
        (col.group && reportCampStore.group_by.includes(col.key)) || !col.group
    )
    .map((c) => generateCol(c))
}

const initTable = () => {
  //create table
  tabulator.value = new Tabulator(table.value, {
    data: reportCampStore.reportData.items,
    reactiveData: true,
    placeholder: 'No Data Available',
    debugInvalidOptions: false,
    movableColumns: isMobile ? false : true,
    rowHeight: 50,
    layout: 'fitDataStretch',
    headerSortElement: function (column, dir) {
      if (
        reportCampStore.sort.field === column.getField() &&
        reportCampStore.sort.dir === 'asc'
      ) {
        return icons.sortasc()
      } else if (
        reportCampStore.sort.field === column.getField() &&
        reportCampStore.sort.dir === 'desc'
      ) {
        return icons.sortdesc()
      } else {
        return icons.sort()
      }
    },
    rowFormatter: function (row) {
      var data = row.getData()
      if (data.section?.is_block_global)
        row.getElement().style.backgroundColor = 'darksalmon'
      if (data.status && data.status.status === 'off') {
        row.getElement().style.opacity = '0.5'
      }
    },
    columns: getColumnsBySelectedGroups(),
  })

  // Chọn/unselect row bằng click
  $(function () {
    $('#table').on('click', '.tabulator-row', function () {
      if ($(this).hasClass('tabulator-selected')) {
        $(this).removeClass('tabulator-selected')
      } else {
        $(this).addClass('tabulator-selected')
      }
    })
  })

  // Sticky fake scrollbar
  tabulator.value.on('tableBuilt', () => {
    $(function ($) {
      const scrollbar = $(
        '<div id="tabulator-tableholder"><div></div></div>'
      ).appendTo($(document.body))
      scrollbar
        .hide()
        .css({ overflowX: 'auto', position: 'fixed', width: '100%' })
      const fakecontent = scrollbar.find('div')

      function top(e: any) {
        return e.offset().top
      }

      function bottom(e: any) {
        return e.offset().top + e.height()
      }

      let active = $<HTMLElement>([])
      function fit(activeEl: any) {
        if (!activeEl.length) return scrollbar.hide()
        scrollbar.css({ left: activeEl.offset().left, width: activeEl.width() })
        fakecontent.width($('.tabulator-tableholder')[0].scrollWidth)
        fakecontent.height(1)
        return undefined
      }

      function find_active() {
        scrollbar.show()
        let cur = $<HTMLElement>([])
        $('.tabulator-tableholder').each(function () {
          if (
            top($(this)) < top(scrollbar) &&
            bottom($(this)) > bottom(scrollbar)
          ) {
            fakecontent.width($(this)[0].scrollWidth)
            fakecontent.height(1)
            cur = $(this)
          }
        })
        fit(cur)
        return cur
      }

      let lastScroll: any
      function update() {
        if (!active.length) return
        if ((active as any).scrollLeft() === lastScroll) return
        lastScroll = (active as any).scrollLeft()
        scrollbar.scrollLeft(lastScroll)
      }
      function scroll() {
        if (!active.length) return
        if (scrollbar.scrollLeft() === lastScroll) return
        lastScroll = scrollbar.scrollLeft()
        ;(active as any).scrollLeft(lastScroll)
      }

      function onscroll() {
        const oldactive = active
        active = find_active()
        if ((oldactive as any).not(active).length)
          (oldactive as any).unbind('scroll', update)
        if ((active as any).not(oldactive).length)
          (active as any).on('scroll', update)
        update()
      }
      scrollbar.on('scroll', scroll)
      onscroll()
      $(window).on('scroll', onscroll)
      $(window).resize(onscroll)
    })
  })
  tabulator.value.on('headerClick', function (e, column: ColumnComponent) {
    //e - the click event object
    //column - column component
    tableIsLoading.value = true
    const field = computed<string>(() => {
      switch (column.getField()) {
        case 'campaign.name':
          return ''
        case 'campaign.status':
          return ''
      }

      return column.getField() || ''
    })
    if (field.value) {
      let dirTemp = 'desc'
      if (field.value === preSort.value) {
        dirTemp = reportCampStore.sort.dir === 'desc' ? 'asc' : 'desc'
      } else {
        dirTemp = 'desc'
      }
      reportCampStore.sort = {
        dir: dirTemp,
        field: field.value,
      }
      replaceTableData()
      preSort.value = field.value
    }
  })
  tabulator.value.on('dataProcessing', function () {
    //data - the data loading into the table
    tableIsLoading.value = true
  })
  tabulator.value.on('dataProcessed', function () {
    //data - all data loaded into the table
    tableIsLoading.value = false
  })
}

const replaceTableDataCore = async () => {
  if (inflight) return inflight
  inflight = (async () => {
    tableIsLoading.value = true
    if (!isFirstInit.value) {
      tabulator.value?.destroy()
    }
    await reportCampStore.fetchReport()
    initTable()
    isFirstInit.value = false
    tableIsLoading.value = false
  })()
  try {
    await inflight
  } finally {
    inflight = null
  }
}

const replaceTableData = debounceV2(replaceTableDataCore, 300)

watch(
  payload,
  (val, old) => {
    if (mute.value) return
    // Helper so sánh
    const changed = (k: keyof typeof val) =>
      JSON.stringify(val[k]) !== JSON.stringify(old?.[k])

    let shouldFetch = false
    if (val.autoSync) {
      shouldFetch = changed('limit') || changed('page')
    } else {
      shouldFetch =
        changed('start') ||
        changed('end') ||
        changed('page') ||
        changed('limit') ||
        changed('interval') ||
        changed('tz') ||
        changed('sort')
    }

    if (shouldFetch) replaceTableData()
  },
  { deep: true, flush: 'post' }
)

watch(
  () => reportCampStore.updateClicked,
  () => replaceTableData()
)

const handlePageChange = async (page: number) => {
  reportCampStore.page = page
}

const handlePageSizeChange = async (size: number) => {
  reportCampStore.limit = size
}

useLogicGoAndLeave(tableIsLoading, replaceTableData)
</script>
<template>
  <div
    :class="[
      'table-report1',
      {
        'no-content':
          !reportCampStore.reportData.items ||
          !reportCampStore.reportData.items.length,
      },
    ]"
  >
    <!-- table -->
    <div v-show="tableIsLoading">
      <Skeleton />
    </div>
    <div v-show="!tableIsLoading" id="table" ref="table"></div>
    <!-- pagination -->
    <n-pagination
      v-model:page="reportCampStore.page"
      v-model:page-size="reportCampStore.limit"
      show-size-picker
      class="bg-card p-3 border-x border-b justify-end items-center"
      :page-count="pageCount"
      :page-sizes="[10, 20, 30, 50, 100, 250]"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>
<style lang="scss">
.table-report1 {
  .sectionName {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .messagepop {
    background-color: #ffffff;
    border: 1px solid #999999;
    display: none;
    position: absolute;
    z-index: 50;
  }

  &.no-content {
    #table {
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      overflow: visible;
      height: 60vh;
    }
  }
  /*Theme the Tabulator element*/
  #table {
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    overflow: visible;
    height: 100%;
  }
  /*Theme the header*/
  #table .tabulator-header {
    display: flex;
    align-items: center;
    // height: 41px;
    // min-height: 41px;
    background-color: #fff;
    color: #151e41;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid #e2e8f0;
    cursor: pointer;
  }

  .tabulator {
    background-color: transparent !important;
    .tabulator-header {
      height: 41px;
      position: sticky;
      top: 0;
      z-index: 11;
      background-color: #ffffff !important;
      .tabulator-col {
        height: 41px;
        justify-content: center;
        background-color: #ffffff;
        border-right: 1px solid #e2e8f0;
        .tabulator-sortable {
          .tabulator-col-sorter-element:hover {
            background-color: #fff;
            font-weight: 500;
          }
        }
        .tabulator-headers {
          height: 41px !important;
        }
      }
    }
    .tabulator-tableholder {
      overflow-y: hidden;
      .tabulator-selectable:hover.tabulator-row-odd {
        background-color: #fff;
      }
      .tabulator-selectable:hover.tabulator-row-even {
        background-color: #efefef;
      }
    }
    .tabulator-tableholder.tabulator-selected:hover {
      background-color: #9abcea !important;
    }
    .tabulator-row.tabulator-selected:hover {
      background-color: #9abcea !important;
    }
    .tabulator-footer {
      position: sticky;
      bottom: 0;
      z-index: 11;
      border-top: 1px solid #e2e8f0;
      .tabulator-calcs-holder {
        border-bottom: 1px solid #e2e8f0;
        border-top: 1px solid #e2e8f0;
        .tabulator-row {
          background: #fff !important;
          .tabulator-cell {
            border-right: 1px solid #e2e8f0;
            padding-top: 15px;
          }
        }
      }
    }
    .tabulator-row {
      .tabulator-cell {
        border-right: 1px solid #e2e8f0;
        a:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .tabulator
    .tabulator-header
    .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover {
    background-color: #fff;
    font-weight: 700;
  }
  .tabulator
    .tabulator-header
    .tabulator-col.tabulator-sortable[aria-sort='none'] {
    .tabulator-col-content {
      padding: 4px 10px !important;
      .tabulator-col-sorter {
        visibility: hidden;
        .svg-inline--fa.fa-sort-down {
          visibility: visible;
        }
        .svg-inline--fa.fa-sort-up {
          visibility: visible;
        }
      }
    }
  }
  .tabulator
    .tabulator-header
    .tabulator-col.tabulator-sortable[aria-sort='none'] {
    .tabulator-col-content:hover {
      .tabulator-col-sorter {
        visibility: visible;
      }
    }
  }
}
.fakeScroll {
  overflow-x: auto;
  position: sticky;
  width: 100%;
  bottom: 42px;
}
.n-pagination {
  .n-select {
    // padding-top: 10px;
    .n-base-selection-label {
      padding-left: 8px;
    }
  }
}

.badge {
  padding: 0.25rem 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  border-radius: 0.25rem;
}
.badge-danger {
  background-color: #f56565;
  color: #fff;
}
.badge-success {
  background-color: #38c172;
  color: #fff;
}

.cpcAdjustment {
  display: flex;
  flex-direction: row;
  &--first {
    display: flex;
    flex-direction: column;
    width: fit-content;
  }
  &--second {
    display: flex;
    flex-direction: column;
    // border: 1px solid #cfcece;
    width: 95px;
  }
  &--inputWrapper {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  &--prefix {
    height: 22px;
    padding-right: 3px;
    border-right: 1px solid #cfcece;
    border-top: 1px solid #cfcece;
    border-bottom: 1px solid #cfcece;
    border-top-right-radius: 3px 3px;
    border-bottom-right-radius: 3px 3px;
    color: #999;
  }
  &--inputWrapper &--prefix {
    background: #fff;
  }
  &--third {
    padding-left: 5px;
  }
  &--plus {
    padding: 0px 7px;
    width: fit-content;
    background: gray;
    color: white;
    height: 20px;
    border-top-left-radius: 20px 15px;
    border-top-right-radius: 20px 15px;
    border: 1px solid #cfcece;
    border-bottom: none;
  }
  &--minus {
    padding: 0px 9px;
    padding-left: 9px;
    width: fit-content;
    border-bottom-right-radius: 20px 15px;
    border-bottom-left-radius: 20px 15px;
    border: 1px solid #cfcece;
    border-top: none;
  }
  &--input {
    margin-left: 5px;
    max-height: 22px;
    border: 1px solid #cfcece;
    border-right-width: 0;
    border-radius: 3px;
    padding: 0 6px;
    width: 100%;
  }
  &--input:focus {
    outline: none;
  }
  &--label {
    margin-left: 10px;
  }
  &--submit {
    height: 23px;
    width: 24px;
    font-size: 0.625rem;
    line-height: 1.4375rem;
    padding: 0.25rem;
    background-color: green;
    border-color: green;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.2rem;
  }
}
.headerName {
  .svg-inline--fa {
    height: 0.7em;
    color: green;
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
.campaignWrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .tools {
    display: flex;
    align-items: center;
    .editWrapper {
      margin-right: 5px;
      cursor: pointer;
    }
    .infoWrapper {
      margin-right: 5px;
    }
  }
}
//custom tooltip
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 350px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -175px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.tabulator-row .tabulator-cell {
  overflow: unset;
}
.tabulator-table {
  // background-color: transparent !important;
  min-width: 100% !important;
  .tabulator-row {
    display: flex;
    width: 100% !important;
  }
  // .tabulator-row.tabulator-row-even {
  //   background-color: #f1f5f9 !important;
  // }

  // .tabulator-row.tabulator-row-odd {
  //   background-color: #ffffff !important;
  // }
  .tabulator-row:nth-child(-n + 3) {
    .tooltip .tooltiptext {
      top: 125%;
      bottom: unset;
    }
    .tooltip .tooltiptext::after {
      bottom: 100%;
      top: unset;
      border-color: transparent transparent black transparent;
    }
  }
}

.tabulator-cell.text-object-cell .text-wrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  max-width: 300px;
}
</style>
