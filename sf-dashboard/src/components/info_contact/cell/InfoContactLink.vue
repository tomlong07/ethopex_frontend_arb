<!-- InfoContactLink.vue -->
<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    required: true,
  },
})

</script>

<template>
  <div class="truncate">
    <a
      :href="props.params?.data?.[props.params?.colDef?.field as string]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ props.params?.data?.[props.params?.colDef?.field as string] }}
    </a>
  </div>
</template>
