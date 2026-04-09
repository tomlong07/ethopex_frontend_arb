<script setup lang="ts">
import { GridApi } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import usePaymentStore from '@/store/usePaymentStore'
import { columnsDefPaymentModal } from '@/constants/payments'
import { CellFormaterCore } from '@/aggrid/cellv2'
const isMobile = helper.mobileDetect()

const paymentsStore = usePaymentStore()
const gridApi = ref<GridApi | null>(null)
const gridColumnApi = ref<any>()
const bodyStyle = {
  width: '95vw',
}

const segmented = {
  content: 'soft',
  footer: 'soft',
} as const

const gridOptions = computed(() => {
  return {
    suppressMovableColumns: isMobile,
  }
})

const columnDefs = computed(() => {
  return columnsDefPaymentModal()
})

const defaultColDef = computed(() => {
  return {
    resizable: !isMobile,
  }
})

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
  () => paymentsStore.paymentsLoadInvoiceDataTable
)
</script>

<template>
  <n-modal
    v-model:show="paymentsStore.showModal"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    title="Payments Info"
    :bordered="false"
    size="huge"
    :segmented="segmented"
  >
    <div style="height: 500px" class="overflow-y-auto">
      <ag-grid-vue
        id="invalid-grid"
        class="ag-theme-alpine"
        :animate-rows="true"
        dom-layout="autoHeight"
        :grid-options="gridOptions"
        :column-defs="columnDefs"
        :row-data="PaymentsLoadItems"
        :default-col-def="defaultColDef"
        :overlay-loading-template="overlayLoadingTemplate"
        :overlay-no-rows-template="overlayNoRowsTemplate"
        :enable-cell-text-selection="true"
        @grid-ready="onGridReady"
      >
      </ag-grid-vue>
    </div>
    <div class="sticky-footer">
      <!-- Nội dung của thẻ div -->
      Total amount:
      <p
        :class="{
          'text-green-600': Number(paymentsStore.paymentAmount) > 0,
          'text-red-600': Number(paymentsStore.paymentAmount) < 0,
        }"
        style="display: inline-block"
      >
        {{
          CellFormaterCore({
            type: 'currency-empty',
            value: paymentsStore.paymentAmount,
          })
        }}
      </p>
    </div>
  </n-modal>
</template>
<style lang="scss">
.sticky-footer {
  font-weight: bold;
  position: sticky;
  bottom: 0;
  background-color: white;
  padding: 10px;
  margin-left: calc(62%);
  /* Thêm CSS tùy chọn cho thẻ div của bạn */
}

#invalid-grid {
  .ag-cell {
    height: auto;
  }
}
</style>
