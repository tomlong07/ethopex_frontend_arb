<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const arrayValue = computed<any>(() => {
  return props.params.value
})

const items = [
  { id: 1, value: 'admin_defined', name: 'Admin Defined' },
  { id: 2, value: 'system_defined', name: 'System Defined' },
]
const typeName = computed(() => {
  const selectedItem = items.find((item) => item.value === arrayValue.value)
  return selectedItem ? selectedItem.name : arrayValue.value
})
</script>
<template>
  <span>
    {{ typeName }}
  </span>
</template>
