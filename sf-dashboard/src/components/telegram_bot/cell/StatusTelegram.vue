<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { computed } from 'vue'
import { NTag } from 'naive-ui'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

const status = computed(() => props.params?.value || '')

const tagType = computed(() => {
  switch (status.value) {
    case 'active':
      return 'success'
    case 'in_active':
      return 'error'
    default:
      return 'default'
  }
})

const tagLabel = computed(() => {
  switch (status.value) {
    case 'active':
      return 'Active'
    case 'in_active':
      return 'Inactive'
    default:
      return status.value
  }
})
</script>

<template>
  <n-tag :type="tagType" size="medium" class="n-tag-exclude">
    {{ tagLabel }}
  </n-tag>
</template>
