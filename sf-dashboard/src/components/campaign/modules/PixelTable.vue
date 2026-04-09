<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import Shared from '@/components/campaign/Shared'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import { columnsDefPixel } from '@/columns/campaign'
import { themeAlpine } from 'ag-grid-community'

const gridOptions = Shared.newGridOptions()
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const columnDefs = columnsDefPixel

const defaultColDef = {
  // set every column width
  suppressSizeToFit: true,
  resizable: true,
}

const isShow = computed<boolean>(() => {
  if (props.campaign.IsTrafficARBTraffic() && props.campaign.IsDemandArbCore())
    return false
  return true
})

const rowData = computed(() => props.campaign?.pixels || [])
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <n-card title="Pixel" class="rounded-[5px] !border-gray2" v-if="isShow">
    <div class="w-full">
      <ag-grid-vue
        id="myGrid1"
        :theme="customTheme"
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
