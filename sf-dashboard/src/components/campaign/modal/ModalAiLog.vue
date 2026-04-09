<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import Shared from '@/components/campaign/Shared'
import useCampaign2Store from '@/store/useCampaign2Store'
import { columnAiLog } from '../column_def'
import { GridApi, themeAlpine } from 'ag-grid-community'
import { aiLog } from '@/types/components/campaign'

const ModalAiLogDetail = defineAsyncComponent(
  () => import('@/components/campaign/modal/ModalAiLogDetail.vue')
)
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const gridOptions = Shared.newGridOptions()
const campaignStore = useCampaign2Store()

const defaultColDef = {
  suppressSizeToFit: true,
  resizable: true,
}
const showModal = ref(false)
const detail = ref<aiLog>({})
const gridApi = ref<GridApi | null>(null)

const rowData = computed(() => campaignStore.aiLog?.data?.items || null)
const pageCount = computed<number>(() => {
  try {
    const totalRecords = campaignStore.aiLog?.data?.recordsTotal || 0
    const pageSizeValue = campaignStore.paging.size

    if (totalRecords % pageSizeValue === 0) {
      return totalRecords / pageSizeValue
    }

    return Math.floor(totalRecords / pageSizeValue) + 1
  } catch {
    return 1
  }
})

const fetchData = async () => {
  gridApi.value?.showLoadingOverlay()
  await campaignStore.fetchAILog()
  gridApi.value?.hideOverlay()
}

const changePage = async (pg: number) => {
  campaignStore.paging.page = pg
  await fetchData()
}

const changePageSize = async (ps: number) => {
  campaignStore.paging.size = ps
  await fetchData()
}

const onGridReady = (params: any) => {
  gridApi.value = params.api
}

const detailLog = (params: any) => {
  detail.value = params.data || {}
  showModal.value = !showModal.value
}

watch(
  () => campaignStore.showModalAiLog,
  async (newVal) => {
    if (newVal) {
      await fetchData()
    } else {
      campaignStore.aiLog = {}
    }
  },
  { immediate: true }
)
</script>

<template>
  <n-modal
    id="log-camp-fb-modal"
    v-model:show="campaignStore.showModalAiLog"
    preset="card"
    size="huge"
    title="AI Log Detail"
    :style="{ width: '95vw', height: '90vh' }"
    :bordered="false"
    :segmented="{ content: 'soft', footer: 'soft' }"
  >
    <div class="w-full">
      <ag-grid-vue
        id="myGrid"
        :theme="customTheme"
        :animate-rows="true"
        rowClass="cursor-pointer"
        dom-layout="autoHeight"
        :grid-options="gridOptions"
        :column-defs="columnAiLog"
        :enable-cell-text-selection="true"
        :row-data="rowData"
        :default-col-def="defaultColDef"
        @grid-ready="onGridReady"
        @rowClicked="detailLog"
      >
      </ag-grid-vue>
      <!-- pagination -->
      <n-pagination
        v-model:page="campaignStore.paging.page"
        v-model:page-size="campaignStore.paging.size"
        show-size-picker
        class="bg-card pt-3 justify-end items-center"
        :page-count="pageCount"
        :page-sizes="[10, 20, 30, 50, 100]"
        :on-update:page="changePage"
        :on-update:page-size="changePageSize"
      />
    </div>
  </n-modal>
  <ModalAiLogDetail v-if="detail" v-model="showModal" :AiLog="detail" />
</template>
