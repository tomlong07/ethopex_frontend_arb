<script setup lang="ts">
import {
  adGroups,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import AdsCreativeName from '@/components/campaign/cell/AdsCreativeName.vue'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
import { ColDef, themeAlpine } from 'ag-grid-community'
const props = defineProps({
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  adGroupData: {
    type: Object as () => adGroups,
    required: true,
    default: {},
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})
const columnAdDetailDefs: ColDef[] = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.2,
  },
  {
    headerName: 'SiteName',
    field: 'site_name',
    cellRenderer: AdsCreativeName,
    flex: 0.4,
    minWidth: 250,
  },
  {
    headerName: 'Status',
    field: 'status',
    flex: 0.1,
    minWidth: 150,
  },
  {
    headerName: 'Title',
    field: 'title',
    flex: 0.3,
    minWidth: 250,
  },
]

const rowAdDetailData = computed(() => {
  return props.adGroupData.ad_creative || []
})
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <n-modal
    v-model:show="props.statusData.showModalAdsInfo"
    style="height: 95vh; width: 95vw"
    class="p-2"
  >
    <n-card v-if="props.FreezeData.isEditPage()" title="Ads Creative">
      <div class="w-full">
        <ag-grid-vue
          id="adDetailGrid"
          :theme="customTheme"
          :animate-rows="true"
          dom-layout="autoHeight"
          :column-defs="columnAdDetailDefs"
          :row-data="rowAdDetailData"
        >
        </ag-grid-vue>
      </div>
    </n-card>
  </n-modal>
</template>
