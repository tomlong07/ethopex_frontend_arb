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

//Case ko lưu vào actionInfo mà chỉ lưu url action
if (!actionInfo.length && options.action) {
  actionInfo = [{ icon: 'edit', title: 'Edit', url: options.action }]
}

const tagNow = (item: ActionInfo) => {
  if (!item.url) return 'div'
  if (item.aTag) return 'a'

  return 'router-link'
}

const hrefNow = (item: ActionInfo) => {
  if (item.aTag || item.url) return urlNow(item)
  return undefined
}

const urlNow = (item: ActionInfo) => {
  if (!item.url || !props.params?.data?.id) return ''

  return item.url?.replace(':id', props.params.data.id)
}

const toNow = (item: ActionInfo) => {
  if (!item.url) return undefined
  if (item.aTag) return undefined
  return urlNow(item)
}
const targetNow = (item: ActionInfo) => {
  if (!item.url) return undefined
  if (item.aTag) return '_blank'
  return undefined
}
</script>
<template>
  <div class="flex w-full h-full items-center" style="margin-top: -2px">
    <component
      :is="tagNow(item)"
      :to="toNow(item)"
      :href="hrefNow(item)"
      :target="targetNow(item)"
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
    </component>
  </div>
</template>
