<script setup lang="ts">
import { TypeCategorySiteBuilder } from '@/options/category_site_builder'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value = props?.params?.data?.type || ''
const label =
  (TypeCategorySiteBuilder?.find((opt) => opt.value === value)
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
