<script setup lang="ts">
import { GridApi, themeAlpine } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import usePaymentStore from '@/store/usePaymentStore'
import PaymentsNote from '@/components/payment/cell/PaymentsNote.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { CellFormaterCore } from '@/aggrid/cellv2'
import SearchOutline from '@/assets/icons/SearchOutline.vue'
import { CardSegmented } from 'naive-ui'

const isMobile = helper.mobileDetect()

const paymentsStore = usePaymentStore()
const gridApi = ref<GridApi | null>(null)
const gridColumnApi = ref<any>()
const gridKey = ref(0)

const segmented: CardSegmented = {
  content: 'soft',
  footer: 'soft',
}

const isAdm = window.arb.isAdmin()

const gridOptions = computed(() => {
  return {
    suppressMovableColumns: isMobile,
  }
})

const columnDefs = computed(() => {
  const defaultCols = [
    {
      headerName: 'PERIOD',
      field: 'period',
      sortable: true,
      minWidth: 250,
      flex: 0.1,
      cellRenderer: (params: any) => {
        if (params.data?.isTotal) {
          return '<span style="font-weight: bold;">Total amount:</span>'
        }
        return params.value
      },
    },
  ]

  const plusCols = [
    {
      headerName: 'Publisher',
      field: 'publisher',
      sortable: true,
      minWidth: 250,
      flex: 0.1,
      cellRenderer: (params: any) => {
        const match = params.data.note?.match(/Share by:\s*(.*?)\n/)

        const email = match ? match[1].trim() : null

        return params.data.publisher || email || '-'
      },
    },
  ]

  if (isAdm && paymentsStore.showFull) {
    let cloneCols = helper.clone(paymentsStore.columnDefsNewComputed || [])
    cloneCols.forEach((element: any) => {
      const format = element.format || ''
      delete element.format
      delete element.condition

      if (['currency', 'percent'].includes(format || '')) {
        element.type = 'rightAligned'
        element.minWidth = 150

        element.valueGetter = (params: any) => {
          const value = params.data[element.field]
          if (value) {
            return CellFormaterCore({ type: format, value: value })
          }
          return '-'
        }

        element.cellStyle = (params: any) => {
          const value = params.data[element.field]
          if (value < 0) {
            return { color: 'red' } // Số âm - màu đỏ
          } else if (value > 0) {
            return { color: 'green' } // Số dương - màu xanh lá cây
          } else {
            return null // Số 0
          }
        }
      }
    })
    return [...defaultCols, ...plusCols, ...cloneCols]
  }

  let finishCols = [...defaultCols]
  finishCols = [...finishCols, ...plusCols]

  return [
    ...finishCols,
    {
      headerName: 'Info',
      field: 'note',
      sortable: true,
      cellRenderer: PaymentsNote,
      autoHeight: true,
      flex: 0.5,
    },
    {
      headerName: 'AMOUNT',
      field: 'amount',
      sortable: true,
      // cellRenderer: Amount,
      type: 'rightAligned',
      valueGetter: (params: any) => {
        const amount = params.data.amount
        if (amount === null || amount === undefined) {
          return '-'
        } else {
          return helper.currencyFormatterAuto(amount)
        }
      },
      cellStyle: (params: any) => {
        const amount = params.data.amount
        if (amount < 0) {
          return { color: 'red' } // Số âm - màu đỏ
        } else if (amount > 0) {
          return { color: 'green' } // Số dương - màu xanh lá cây
        } else {
          return null // Số 0
        }
      },
      width: 150,
      flex: 0.1,
    },
    {
      headerName: 'TYPE',
      field: 'type',
      sortable: true,
      width: 120,
      flex: 0.1,
    },
  ]
})

const defaultColDef = {
  resizable: !isMobile,
}
const quickFilterText = ref('')

//hủy instance cũ để không bị lưu lại giá trị cũ, dom cũ
watch(
  () => paymentsStore.showFull,
  (newVal, oldVal) => {
    if (!newVal) {
      gridKey.value++
    }
  }
)

const overlayLoadingTemplate = computed(() => {
  return '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
})

const overlayNoRowsTemplate = computed(() => {
  return '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No Rows To Show</span>'
})

const onGridReady = async (params: any) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
  if (gridApi.value) {
    gridApi.value.sizeColumnsToFit()
  }
}

const PaymentsLoadItems = computed<Record<string, any>[]>(
  () => paymentsStore.paymentsLoadInvoiceDataTable || []
)

const pinnedBottomRowData = computed(() => {
  if (isAdm && paymentsStore.showFull) {
    const dataTotal: Record<string, any> = {
      period: '',
      note: '',
      type: '',
      isTotal: true,
    }

    let hasRoi = false
    for (
      let index = 0;
      index < paymentsStore.columnDefsNewVersion.length;
      index++
    ) {
      const element = paymentsStore.columnDefsNewVersion[index]
      if (
        !element.format ||
        !['currency', 'percent'].includes(element.format)
      ) {
        continue
      }

      if (element.field === 'roi') {
        hasRoi = true
        continue
      }

      let total = 0
      for (
        let rowIndex = 0;
        rowIndex < PaymentsLoadItems.value.length;
        rowIndex++
      ) {
        const row = PaymentsLoadItems.value[rowIndex]
        const value = row[element.field] || 0
        total += value
      }

      dataTotal[element.field as string] = total
    }

    if (hasRoi) {
      if (dataTotal['cost'] !== 0) {
        dataTotal['roi'] = (dataTotal['profit'] / dataTotal['cost']) * 100
      }
    }

    return [dataTotal]
  }

  return [
    {
      period: '',
      note: '',
      amount: paymentsStore.paymentAmount,
      type: '',
      isTotal: true,
    },
  ]
})
const paramsData = computed(() => {
  return { value: paymentsStore.data?.status } as any
})

const headerName = computed(() => {
  const arr = ['Payments Info']
  if (paymentsStore.data?.name.trim()) {
    arr.push(paymentsStore.data?.name)
  }
  if (paymentsStore.data?.user) {
    arr.push(paymentsStore.data?.user)
  }
  return arr.join(' - ')
})

watch(
  () => paymentsStore.showModal,
  async (newVal) => {
    try {
      let ajax = [paymentsStore.fetchListPaymentLoadingInvoice()]

      if (newVal && isAdm) {
        ajax.push(paymentsStore.getColumnDefsNewVersion())
      }

      await Promise.all(ajax)
    } finally {
      paymentsStore.loadCols = false
    }
  }
)

onMounted(() => {
  const showFullStorage = localStorage.getItem('payments_modal_show_full')
  if (showFullStorage === '1') {
    paymentsStore.showFull = true
  } else {
    paymentsStore.showFull = false
  }
})

const updateMode = (value: boolean) => {
  paymentsStore.showFull = value

  localStorage.setItem('payments_modal_show_full', value ? '1' : '0')
}
</script>

<template>
  <n-modal
    v-model:show="paymentsStore.showModal"
    class="custom-card relative"
    preset="card"
    :style="{ width: '95vw' }"
    :bordered="false"
    size="huge"
    :segmented="segmented"
  >
    <template #header>
      <div class="flex flex-row items-center gap-2">
        {{ headerName }}

        <Round :params="paramsData" />
      </div>
    </template>
    <div class="grid-scroll-container flex gap-2 flex-col scroll-thin-custom">
      <div class="flex gap-2 items-center font-semibold" v-if="isAdm">
        Full View
        <n-switch
          v-model:value="paymentsStore.showFull"
          :on-update:value="updateMode"
        />
      </div>

      <Skeleton
        v-if="paymentsStore.loadCols || paymentsStore.isLoading"
      ></Skeleton>

      <div v-else>
        <n-input
          v-model:value="quickFilterText"
          clearable
          placeholder="Search..."
          class="mb-3"
          size="small"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
        <ag-grid-vue
          :key="gridKey"
          id="invalid-grid"
          :theme="themeAlpine"
          :animate-rows="true"
          style="width: 100%; height: 500px"
          :grid-options="gridOptions"
          :column-defs="columnDefs"
          :row-data="PaymentsLoadItems"
          :default-col-def="defaultColDef"
          :pinned-bottom-row-data="pinnedBottomRowData"
          :overlay-loading-template="overlayLoadingTemplate"
          :overlay-no-rows-template="overlayNoRowsTemplate"
          :suppressRowVirtualisation="true"
          :suppressColumnVirtualisation="true"
          :enable-cell-text-selection="true"
          :quickFilterText="quickFilterText"
          @grid-ready="onGridReady"
        >
        </ag-grid-vue>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss">
.grid-scroll-container {
  height: 600px;
  width: 100%;
  overflow: hidden; /* Đảm bảo không có nội dung tràn ra ngoài */
}

#invalid-grid {
  .ag-cell {
    height: auto;
  }
}
</style>
