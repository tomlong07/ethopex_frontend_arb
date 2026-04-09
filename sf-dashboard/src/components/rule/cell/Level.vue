<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const level = computed<string>(() => props.params?.data.level)
</script>
<template>
  <n-space>
    <n-tag
      class="capitalize n-tag-exclude"
      round
      :type="level == 'global' ? 'warning' : 'info'"
      size="small"
    >
      {{ level }}
    </n-tag>
  </n-space>
</template>
