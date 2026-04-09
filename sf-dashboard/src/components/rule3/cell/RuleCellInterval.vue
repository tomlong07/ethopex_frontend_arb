<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useRuleStoreV3 from '@/store/details/ruleV3'
const ruleStoreV3 = useRuleStoreV3()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value = props?.params?.data?.interval || ''
const label =
  (ruleStoreV3.intervalOptions.find((opt) => opt.value === value)
    ?.label as string) || value
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
