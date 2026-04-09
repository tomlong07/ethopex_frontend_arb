<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ICellRendererParams } from 'ag-grid-community'
const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value = props?.params?.data?.rule_type || ''
const label =
  (templateV2Store.ruleTypeOptions?.find((opt) => opt.value === value)
    ?.name as string) || value
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
