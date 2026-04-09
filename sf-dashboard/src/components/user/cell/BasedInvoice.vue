<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { BasedInvoiceOptions } from '@/options/user'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const label = computed(() => {
  const value = props.params.data?.based_invoice
  if (value === undefined || value === null) return ''
  const option = BasedInvoiceOptions.find((opt) => opt.value === value)
  return option ? option.label : value
})
</script>
<template>
  <div v-if="props.params.data?.based_invoice" class="px-4">
    {{ label }}
  </div>
</template>
