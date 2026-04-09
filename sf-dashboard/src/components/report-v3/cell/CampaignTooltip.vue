<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const rowData = props.cell.getRow().getData()
</script>
<template>
  <div class="flex flex-col">
    <span>{{ `CPC: $${rowData?.campaign_name?.cpc}` }}</span>
    <span>{{ `CPA Expected: $${rowData?.campaign_name?.cpa_expected}` }}</span>
    <span>{{ `Budget: $${rowData?.campaign_name?.budget}` }}</span>
    <span>{{ `Bidding: ${rowData?.campaign_name?.bidding}` }}</span>
    <span>{{
      `Create Campaign: ${rowData?.campaign_name?.create_campaign}`
    }}</span>
    <span>{{ `Created At: ${rowData?.campaign_name?.created_at}` }}</span>
  </div>
</template>
