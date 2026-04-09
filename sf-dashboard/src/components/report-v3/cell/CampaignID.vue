<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const data2 = props.cell.getRow().getData()
</script>

<template>
  <div>
    {{ data2?.campaign_name?.id }}
  </div>
</template>
