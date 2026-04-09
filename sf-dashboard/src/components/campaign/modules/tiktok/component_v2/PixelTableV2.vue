<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import Shared from '@/components/campaign/Shared'

import { CampaignContext } from '@/types/components/campaign-v2'
import { columnsDefPixel } from '@/columns/campaign'
import { themeAlpine } from 'ag-grid-community'

const gridOptions = Shared.newGridOptions()
const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const columnDefs = columnsDefPixel

const defaultColDef = {
  // set every column width
  suppressSizeToFit: true,
  resizable: true,
}

const rowData = computed(() => props.data.campaign?.pixels || [])
</script>

<template>
  <n-card title="Pixel" class="rounded-[5px] !border-gray2">
    <div class="w-full">
      <ag-grid-vue
        id="myGrid1"
        :theme="themeAlpine"
        :animate-rows="true"
        dom-layout="autoHeight"
        :column-defs="columnDefs"
        :grid-options="gridOptions"
        :enable-cell-text-selection="true"
        :row-data="rowData"
        :default-col-def="defaultColDef"
      >
      </ag-grid-vue>
    </div>
  </n-card>
</template>
