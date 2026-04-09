<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const label = computed<string>(() => props.params.value)
</script>
<template>
  <a
    target="_blank"
    class="text-blue-500 hover:text-blue-700 hover:underline"
    :href="label"
  >
    {{ label }}
  </a>
</template>
