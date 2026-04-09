<script setup lang="ts">
import { RuleExIntervalOption } from '@/options/rule'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const value = props?.params?.data?.interval_exclude || ''
const label =
  (RuleExIntervalOption.find((opt) => opt.value === value)?.label as string) ||
  value
</script>
<template>
  <n-popover trigger="hover">
    <template #trigger>
      <div class="truncate">
        {{ label }}
      </div>
    </template>
    {{ label }}
  </n-popover>
</template>
