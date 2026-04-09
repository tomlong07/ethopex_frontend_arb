<template>
  <div class="relative w-full flex flex-col gap-4">
    <!-- AG Grid -->
    <div class="ag-grid-wrapper">
      <ag-grid-vue
        id="myGrid-accounts-ad"
        class="w-full"
        :theme="customTheme"
        :animate-rows="true"
        dom-layout="autoHeight"
        :grid-options="gridOptions"
        :enable-cell-text-selection="true"
        :default-col-def="defaultColDef"
        :row-data="accountAdStore.accountMccList"
        :rowSelection="rowSelection"
        :pagination="false"
        @grid-ready="onGridReady"
      />
    </div>

    <!-- Pagination -->
    <div class="flex justify-end items-center bg-card py-3 px-4">
      <n-pagination
        v-model:page="accountAdStore.currentPageMCC"
        v-model:page-size="accountAdStore.pageSizeMCC"
        :page-count="totalPageCount"
        show-size-picker
        :page-slot="5"
        :page-sizes="[10, 20, 50, 100]"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'

import useAccountAd from '@/store/useAccountAd'
import { ColDef, RowSelectionOptions, themeAlpine } from 'ag-grid-community'
import { accountMcc } from '@/types/components/account'
import StatusAccountMcc from './StatusAccountMcc.vue'

const accountAdStore = useAccountAd()
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'multiRow',
  enableSelectionWithoutKeys: true,
  enableClickSelection: true,
})

const columnDefs: ColDef<accountMcc>[] = [
  { headerName: 'Account ID', field: 'account_id' },
  { headerName: 'Name', field: 'name', flex: 1, width: 180 },

  { headerName: 'MCC ID', field: 'mcc_id', flex: 1 },
  {
    headerName: 'Status',
    field: 'status',
    width: 120,
    cellRenderer: StatusAccountMcc,
  },
  { headerName: 'Error', field: 'error', flex: 1 },

  {
    headerName: 'Created At',
    field: 'create_at',
    width: 180,
    valueFormatter: (params: any) => new Date(params.value).toLocaleString(),
  },
  {
    headerName: 'Time Run',
    field: 'time_run',
    width: 180,
    valueFormatter: (params: any) => new Date(params.value).toLocaleString(),
  },
]

const gridOptions = {
  rowHeight: 50,
  columnDefs: columnDefs,
  paginationAutoPageSize: false,
  suppressPaginationPanel: false,
}

const defaultColDef = computed(() => {
  return {
    resizable: true,
    sortable: true,
  }
})

const totalPageCount = computed(() => {
  return Math.ceil(accountAdStore.totalRecords / accountAdStore.pageSizeMCC)
})
const onGridReady = (event: any) => {
  accountAdStore.gridApi = event.api
}

const handlePageChange = async (page: number) => {
  accountAdStore.currentPageMCC = page
  accountAdStore.gridApi?.showLoadingOverlay()
  await accountAdStore.filterAccoutMcc()

  accountAdStore.gridApi?.showLoadingOverlay()
}

const handlePageSizeChange = async (pageSize: number) => {
  accountAdStore.pageSizeMCC = pageSize
  accountAdStore.currentPageMCC = 1
  await accountAdStore.filterAccoutMcc()
}

onMounted(async () => {
  await accountAdStore.filterAccoutMcc()
})
</script>
