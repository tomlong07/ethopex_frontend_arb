<script setup lang="ts">
import { ColumnItem } from '@/types/state/general'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''

const arrayValue = computed<any>(() => {
  return props.params.value
})

const linkCategory = (id: number) => {
  if (!urlAction || !id) return ''
  return urlAction?.replace(':id', String(id))
}
</script>
<template>
  <span class="capitalize">
    <n-tag
      v-for="(item, index) in arrayValue"
      :key="index"
      size="small"
      round
      class="cursor-pointer"
      :class="{ 'ml-1': index != 0 }"
      type="info"
    >
      <a :href="linkCategory(item.id)" target="_blank"> {{ item.name }} </a>
    </n-tag>
  </span>
</template>
