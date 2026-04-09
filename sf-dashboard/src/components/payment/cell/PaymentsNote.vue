<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const noteBr = computed(() => {
  return props.params.data.note.replace(/\n/g, '<br>')
})
</script>
<template>
  <div class="flex justify-between items-center info-wrapper">
    <div class="flex flex-col my-2">
      <div
        class="text-sm break-words whitespace-pre-wrap"
        v-html="noteBr"
      ></div>
    </div>
  </div>
</template>
