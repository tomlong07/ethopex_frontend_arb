<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'

import SkeletonTable from '../template-v2/skeleton/SkeletonTable.vue'
import useNotifySystem from '@/store/details/useNotifySystem'
import {
  ColDef,
  ICellRendererParams,
  RowSelectionOptions,
  themeAlpine,
  CellStyleModule,
  TooltipModule
} from 'ag-grid-community'
import useGeneralStore from '@/store/useGeneralStore'
import ActionEdit from './cell/ActionEdit.vue'
import ActionStatus from './cell/ActionStatus.vue'

// !! Store
const notifySystemStore = useNotifySystem()
const generalStore = useGeneralStore()

const defaultColDef = computed(() => {
  return {
    resizable: true,
    sortable: true,
  }
})
const columnDefs: ColDef<any>[] = [
  {
    headerName: 'ID',
    field: 'id',
    width: 80,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    headerName: 'Action',
    field: 'action',
    width: 80,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRenderer: ActionEdit,
  },
  {
    headerName: 'Message',
    field: 'message',
    flex: 1,
    cellRenderer: (params: ICellRendererParams) => {
      const wrapper = document.createElement('div')
      wrapper.style.display = 'block'
      wrapper.style.whiteSpace = 'nowrap'
      wrapper.style.overflow = 'hidden'
      wrapper.style.textOverflow = 'ellipsis'
      wrapper.style.width = '100%'
      wrapper.title = params.value || ''
      wrapper.innerHTML = params.value || ''
      return wrapper
    },
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 120,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRenderer: ActionStatus,
  },
  {
    headerName: 'Users',
    field: 'users',
    minWidth: 250,
    tooltipField: 'users',
    valueFormatter: (params) => params.value?.join(', ') || '',
  },
  {
    headerName: 'Roles',
    field: 'roles',
    tooltipField: 'roles',
    valueFormatter: (params) => params.value?.join(', ') || '',
  },
  {
    headerName: 'Pages',
    field: 'pages',
    tooltipValueGetter: notifySystemStore.formatPageOptions,
    valueFormatter: notifySystemStore.formatPageOptions,
  },

  {
    headerName: 'Created At',
    field: 'created_at',
    width: 200,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
]

onMounted(() => {
  notifySystemStore.setPageOptions(generalStore.menuRouter || [])
  notifySystemStore.handleFilter()
})

const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'multiRow',
  enableSelectionWithoutKeys: true,
  enableClickSelection: true,
})
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <SkeletonTable v-if="notifySystemStore.isFilterLoading" />
  <div class="relative w-full" v-else>
    <div class="text-xs text-gray-500 border p-2 flex gap-4 bg-white">
      {{ notifySystemStore.pagination.total }} Items
    </div>

    <div class="ag-grid-wrapper ag-theme-alpine">
      <ag-grid-vue
        v-show="!notifySystemStore.isFilterLoading"
        id="myGrid-accounts-ad"
        class="w-full"
        :theme="customTheme"
        :animate-rows="true"
        dom-layout="autoHeight"
        :columnDefs="columnDefs"
        :enable-cell-text-selection="true"
        :default-col-def="defaultColDef"
        :row-data="notifySystemStore.notifySystemList"
        :rowSelection="rowSelection"
        :pagination="false"
        :enableBrowserTooltips="true"
        :modules="[TooltipModule, CellStyleModule]"
      />
    </div>

    <div class="flex justify-end items-center bg-card py-3 px-4">
      <n-pagination
        v-model:page="notifySystemStore.pagination.page"
        v-model:page-size="notifySystemStore.pagination.size"
        :page-count="notifySystemStore.pageCount"
        show-size-picker
        :page-sizes="[10, 20, 50, 100]"
        @update:page="notifySystemStore.handlePageChange"
        @update:page-size="notifySystemStore.handlePageSizeChange"
      />
    </div>
  </div>
</template>
