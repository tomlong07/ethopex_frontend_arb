<script setup lang="ts">
import useReportSupplyKeyword from '@/store/useReportSupplyKeyword'
import { AgGridVue } from 'ag-grid-vue3'

import SkeletonTable from '../template-v2/skeleton/SkeletonTable.vue'
import { RowSelectionOptions, themeAlpine } from 'ag-grid-community'

// !! Store
const reportSupplyKeywordStore = useReportSupplyKeyword()

const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'multiRow',
  enableSelectionWithoutKeys: true,
})
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <SkeletonTable v-if="reportSupplyKeywordStore.isFetchingReport" />
  <div class="relative w-full" v-else>
    <div
      data-v-d6f35d1d=""
      class="flex justify-between bg-card text-start font-semibold border-l border-r border-t"
    >
      <div data-v-d6f35d1d="" class="flex items-center justify-center p-2">
        {{ reportSupplyKeywordStore.pagination.total }} Items
      </div>
    </div>
    <div class="ag-grid-wrapper ag-theme-alpine">
      <ag-grid-vue
        id="myGrid-accounts-ad"
        class="w-full"
        :animate-rows="true"
        :theme="customTheme"
        dom-layout="autoHeight"
        :grid-options="reportSupplyKeywordStore.gridOptions"
        :column-defs="reportSupplyKeywordStore.columnDefs"
        :enable-cell-text-selection="true"
        :default-col-def="reportSupplyKeywordStore.defaultColDef"
        :row-data="reportSupplyKeywordStore.dataReportTable"
        :rowSelection="rowSelection"
        :pagination="false"
        @grid-ready="reportSupplyKeywordStore.onGridReady"
        @sort-changed="reportSupplyKeywordStore.handleSortChanged"
      />
    </div>

    <div class="flex justify-end items-center bg-card py-3 px-4">
      <n-pagination
        v-model:page="reportSupplyKeywordStore.pagination.page"
        v-model:page-size="reportSupplyKeywordStore.pagination.size"
        :page-count="reportSupplyKeywordStore.pageCount"
        show-size-picker
        :page-sizes="[10, 20, 50, 100]"
        @update:page="reportSupplyKeywordStore.handlePageChange"
        @update:page-size="reportSupplyKeywordStore.handlePageSizeChange"
      />
    </div>
  </div>
</template>
