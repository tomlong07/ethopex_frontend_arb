<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { ActionInfo, ColumnItem } from '@/types/state/general'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
let actionInfo = options?.actionInfo || []

let traffic_source = props.params.data?.traffic_source

if (window.arb.debug) traffic_source = 'google'

const urlNow = (item: ActionInfo) => {
  if (!item.url || !props.params?.data?.id || !traffic_source) return ''

  return item.url
    ?.replace(':id', props.params.data.id)
    .replace(':traffic_source', traffic_source)
}
</script>
<template>
  <div
    class="flex w-full h-full items-center"
    style="margin-top: -2px"
    v-if="traffic_source"
  >
    <a
      :href="urlNow(item)"
      target="_blank"
      v-for="(item, index) in actionInfo"
      :key="index"
    >
      <n-icon
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        :title="item.title"
        size="35"
      >
        <Settings20Regular v-if="item.icon === 'edit'" />
        <DuplicateOutline v-if="item.icon === 'duplicate'" />
      </n-icon>
    </a>
  </div>
</template>
