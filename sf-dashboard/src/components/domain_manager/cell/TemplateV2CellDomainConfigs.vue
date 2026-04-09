<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ColumnItem } from '@/types/state/general'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const replaceQuery = options?.replace || ':id'

const domain_configs = props.params.value

const urlNow = (id: any) => {
  if (!urlAction || !id) return ''

  return urlAction?.replace(replaceQuery, id)
}
</script>
<template>
  <div class="flex flex-col w-full h-full" v-if="domain_configs?.length">
    <a
      class="text-blue-500 hover:text-blue-700 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap leading-8"
      v-for="(item, index) in domain_configs"
      :key="item.id"
      :href="urlNow(item.id)"
      target="_blank"
    >
      {{ item.name }}
    </a>
  </div>
</template>
