<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import helper from '@/utils/helper'
import { ICellRendererParams } from 'ag-grid-community'
const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value = props?.params?.data?.type || ''
const label =
  (templateV2Store.creativeTypeOptions?.find((opt) => opt.value === value)
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
