<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
import { themeAlpine, type ColDef } from 'ag-grid-community'
import Shared from '@/components/campaign/Shared'
import { ctr_campaign } from '@/services/ctr_campaign'
import { StatusCampManager } from '@/types/components/campaign-v2'

const gridOptions = Shared.newGridOptions()
const props = defineProps({
  columnDefs: {
    type: Array as () => ColDef[],
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
  },
})

const defaultColDef = {
  resizable: true,
}
const emit = defineEmits<{
  adsData: [result: any]
}>()

const data = ref<any>()

const rowData = computed(() => data.value?.data?.ads || []) // Set rowData to Array of Objects, one Object per Row

const page = ref<number>(1)
const pageSize = ref<number>(100)
const pageCount = computed<number>(() => {
  try {
    const totalRecords =
      data.value?.data?.records_total || data.value?.data?.recordsTotal || 0
    const pageSizeValue = pageSize.value

    if (totalRecords % pageSizeValue === 0) {
      return totalRecords / pageSizeValue
    }

    return Math.floor(totalRecords / pageSizeValue) + 1
  } catch {
    return 1
  }
})

onMounted(async () => {
  // để các TS cũ vẫn hoạt động
  fetchData()
})

watch(
  () => props.statusData?.IsTabCampaign(),
  (v) => {
    if (v) {
      fetchData()
    }
  }
)

const fetchData = async () => {
  const creativeResult = await ctr_campaign.AdsByCampaign({
    campaign_id: props.id,
    page: page.value,
    size: pageSize.value,
  })

  if (creativeResult?.status) {
    data.value = creativeResult
    emit('adsData', creativeResult)
  }
}

const changePage = (pg: number) => {
  page.value = pg

  fetchData()
}

const changePageSize = (ps: number) => {
  pageSize.value = ps

  fetchData()
}
const isComp = window.arb.isCompany()
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})

const onGridReady = (params: any) => {
  params.api.sizeColumnsToFit()
}
</script>

<template>
  <n-card title="Creative" class="rounded-[5px] !border-gray2" v-if="isComp">
    <div class="w-full">
      <ag-grid-vue
        id="myGrid"
        :theme="customTheme"
        :animate-rows="true"
        dom-layout="autoHeight"
        :grid-options="gridOptions"
        :column-defs="props.columnDefs"
        :enable-cell-text-selection="true"
        :row-data="rowData"
        :default-col-def="defaultColDef"
        @grid-ready="onGridReady"
      >
      </ag-grid-vue>
      <!-- pagination -->
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        show-size-picker
        class="bg-card pt-3 justify-end items-center"
        :page-count="pageCount"
        :page-sizes="[10, 20, 30, 50, 100]"
        :on-update:page="changePage"
        :on-update:page-size="changePageSize"
      />
    </div>
  </n-card>
</template>
