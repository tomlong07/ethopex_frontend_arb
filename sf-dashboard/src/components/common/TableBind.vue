<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import { tableInfo } from '@/types/components/pixel_manager'
import SkeletonTable from '@/components/template-v2/skeleton/SkeletonTable.vue'
import { SortDirection, themeAlpine } from 'ag-grid-community'

const props = defineProps({
  tableFullInfo: {
    type: Object as () => tableInfo,
    required: true,
  },
  serverSideRender: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'updatePage', page: number): void
  (e: 'updatePageSize', pageSize: number): void
}>()

const defaultColDef = {
  // set every column width
  minWidth: 100,
  resizable: true,
  sortingOrder: ['desc', 'asc'] as SortDirection[],
}

const clientSideRender = computed(() => {
  return !props.serverSideRender
})

const pageCount = computed<number>(() => {
  if (!props.tableFullInfo.rowData || !props.tableFullInfo.rowData.length) {
    return 1
  }

  if (props.tableFullInfo.total % props.tableFullInfo.pageSize === 0) {
    return props.tableFullInfo.total / props.tableFullInfo.pageSize
  }

  return (
    Math.floor(props.tableFullInfo.total / props.tableFullInfo.pageSize) + 1
  )
})

const updatePage = (page: number) => {
  emit('updatePage', page)
}
const updatePageSize = (page: number) => {
  emit('updatePageSize', page)
}
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <SkeletonTable v-show="props.tableFullInfo.loading" />

  <ag-grid-vue
    v-show="!props.tableFullInfo.loading"
    :theme="customTheme"
    row-selection="multiple"
    :animate-rows="true"
    dom-layout="autoHeight"
    :columnDefs="props.tableFullInfo.columnDefs"
    :rowData="props.tableFullInfo.rowData"
    :default-col-def="defaultColDef"
    :enable-cell-text-selection="true"
    :server-side-sorting="serverSideRender"
    :suppress-multi-sort="true"
    :pagination="clientSideRender"
    :suppress-pagination-panel="true"
  >
  </ag-grid-vue>
  <n-pagination
    v-model:page="props.tableFullInfo.page"
    v-model:page-size="props.tableFullInfo.pageSize"
    show-size-picker
    class="bg-card py-3 justify-end items-center"
    :page-count="pageCount"
    :page-sizes="[10, 20, 30, 50, 100, 500]"
    :on-update:page="updatePage"
    :on-update:page-size="updatePageSize"
  />
</template>
