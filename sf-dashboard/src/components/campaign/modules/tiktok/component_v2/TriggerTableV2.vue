<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import Shared from '@/components/campaign/Shared'

import { CampaignContext } from '@/types/components/campaign-v2'
import { columnsDefTriggers } from '@/columns/campaign'
import { themeAlpine } from 'ag-grid-community'

const gridOptions = Shared.newGridOptions()
const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const columnDefs = columnsDefTriggers

const defaultColDef = {
  // set every column width
  suppressSizeToFit: true,
  resizable: true,
}

const rowData = computed(() => props.data.campaign?.triggers || [])
</script>

<template>
  <n-card title="Trigger" class="rounded-[5px] !border-gray2">
    <div class="w-full">
      <ag-grid-vue
        id="myGrid2"
        :theme="themeAlpine"
        :animate-rows="true"
        dom-layout="autoHeight"
        :grid-options="gridOptions"
        :column-defs="columnDefs"
        :enable-cell-text-selection="true"
        :row-data="rowData"
        :default-col-def="defaultColDef"
      >
      </ag-grid-vue>
    </div>
  </n-card>
</template>
