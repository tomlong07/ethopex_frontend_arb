<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let showData: any[] = []

try {
  showData = JSON.parse(props.params.value || '[]')
} catch {
  showData = []
}
</script>
<template>
  <div class="flex flex-col">
    <div v-for="(item, index) in showData" :key="index" class="truncate">
      {{ item }}
    </div>
  </div>
</template>
