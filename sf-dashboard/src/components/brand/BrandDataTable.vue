ModalBrand
<script lang="ts" setup>
import { AgGridVue } from 'ag-grid-vue3'
import helper from '@/utils/helper'

import useBrandStore from '@/store/useBrandStore'

import { URL_UPLOAD } from '@/constants/urls'
import { RowSelectionOptions, themeAlpine } from 'ag-grid-community'
import BrandActionEdit from './cell/BrandActionEdit.vue'

const brandStore = useBrandStore()

const itemSelected = ref<any[]>([])

const onGridReady = (params: any) => {
  brandStore.gridApi = params.api
  if (brandStore.gridApi) {
    brandStore.gridApi.sizeColumnsToFit()
  }
}

const currentPageItems = computed(() => {
  return listBrand.value?.length || 0
})

const totalItems = computed(() => {
  return brandStore.listBrand?.total || 0
})

const listBrand = computed(() => {
  return brandStore.listBrand?.brands || null
})

const gridOptions = {
  rowHeight: 50,
}

const defaultColDef = computed(() => {
  return {
    resizable: true,
  }
})

const columnDefs = ref([
  { headerName: 'ID', field: 'id', maxWidth: 100, flex: 0.05 },
  { headerName: 'Brand Name', field: 'brand_name', flex: 0.15 },
  {
    headerName: 'Action',
    field: 'action',
    flex: 0.05,
    cellRenderer: BrandActionEdit,
  },
  {
    headerName: 'Logo',
    field: 'logo',
    flex: 0.1,
    cellRenderer: ({ value }: any) =>
      `<img src="${URL_UPLOAD}${value}" alt="logo" height="40" width="40"/>`,
  },
  { headerName: 'Business Name', field: 'business_name', flex: 0.15 },
  { headerName: 'Short Brand', field: 'short_brand', flex: 0.1 },
  {
    headerName: 'Homepage',
    field: 'home_page',
    flex: 0.2,
    cellRenderer: ({ value }: any) =>
      `<a href="${value}" target="_blank" rel="noopener">${value}</a>`,
  },
  {
    headerName: 'Contact Page',
    field: 'contact_page',
    flex: 0.1,
    cellRenderer: ({ value }: any) =>
      `<a href="${value}" target="_blank" rel="noopener">${value}</a>`,
  },
  {
    headerName: 'Created At',
    field: 'created_at',
    flex: 0.1,
  },
])

const handleStopEdit = (event: any) => {
  const target = event.target as Element

  if (!target.closest('#myGrid')) {
    if (brandStore.gridApi) {
      brandStore.gridApi.stopEditing()
    }
  }
}

onMounted(async () => {
  helper.addStyleOnce(
    `myGrid-brand-ad`,
    `#myGrid-brand-ad .ag-cell.ag-cell-auto-height {height: auto;}`
  )
  document.addEventListener('click', handleStopEdit)
})

onUnmounted(() => {
  document.removeEventListener('click', handleStopEdit)
})

const totalPage = computed(() => {
  return Math.ceil(
    (brandStore.listBrand?.total || 0) / (brandStore.currentPaging?.size || 1)
  )
})

const onSelectionChanged = () => {
  const api = brandStore.gridApi
  if (!api) return

  const selectedRows = api.getSelectedRows()
  itemSelected.value = selectedRows
}

const handlePageChange = () => {
  brandStore.fetchData()
}

const handlePageSizeChange = () => {
  brandStore.fetchData()
}
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
  <ag-grid-vue
    id="myGrid-brand-ad"
    :theme="customTheme"
    :animate-rows="true"
    dom-layout="autoHeight"
    :grid-options="gridOptions"
    :column-defs="columnDefs"
    :row-data="listBrand"
    :enable-cell-text-selection="true"
    :default-col-def="defaultColDef"
    :rowSelection="rowSelection"
    @grid-ready="onGridReady"
    @selection-changed="onSelectionChanged"
  >
  </ag-grid-vue>

  <div class="flex justify-end items-center bg-card py-3 px-4">
    <div class="flex items-center gap-2">
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
        <span class="text-sm dark-mode-text">
          Current Items:
          <span class="font-medium text-gray-600">{{ currentPageItems }}</span>
        </span>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
        <span class="text-sm dark-mode-text">
          Total Items:
          <span class="font-medium text-gray-600">{{ totalItems }}</span>
        </span>
      </div>

      <n-pagination
        v-model:page="brandStore.currentPaging.page"
        v-model:page-size="brandStore.currentPaging.size"
        :page-count="totalPage"
        show-size-picker
        :page-slot="5"
        :page-sizes="[10, 20, 50, 100, 500]"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>
