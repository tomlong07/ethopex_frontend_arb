<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },

  plus: {
    type: Object as () => any,
    required: true,
  },
})
</script>
<template>
  <div class="items-center headerTooltip" v-html="props.plus?.html"></div>
</template>
