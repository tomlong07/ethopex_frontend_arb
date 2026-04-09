<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const name = props.cell?.getRow().getData()?.account_demand?.name || '-'
</script>
<template>
  {{ name }}
</template>
