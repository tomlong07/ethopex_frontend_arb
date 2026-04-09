<script setup lang="ts">
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const data2 = props.cell.getData() as any

const name = data2?.landing_page?.name
</script>

<template>
  <div class="overflow-hidden">
    <div class="text-blue-link overflow-hidden text-ellipsis">
      {{ name || 'N/A' }}
    </div>
    <div style="color: #4c4c4c" class="text-xs overflow-hidden text-ellipsis">
      {{ data2?.landing_page?.user || '' }}
    </div>
  </div>
  <n-icon
    class="hover:scale-105"
    :component="Settings20Regular"
    size="24"
    title="Settings"
    v-if="data2?.landing_page?.id"
  ></n-icon>
</template>
