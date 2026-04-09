<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import TrashOutline from '@/assets/icons/TrashOutline.vue'

import { ctr_pixel_trigger } from '@/services/ctr_pixel_trigger'
import { ActionInfo, ColumnItem } from '@/types/state/general'
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const options = (props.params as any).options as ColumnItem
const actionInfo = options?.actionInfo || []

const onDelete = async (link: string) => {
  if (!link) return

  const message = `Are you sure you want to delete pixel triggers ${props.params.data.name}?`
  const confirm = window.confirm(message)

  if (!confirm) {
    window.message.success('Canceled')
    return
  }
  const payload = {
    id: props.params.data.id,
  }
  const result = await ctr_pixel_trigger.Delete(link, payload)
  if (result && result.status) {
    let selectedNode = props.params.node
    let selectedData = selectedNode.data
    ;(props.params.api as any).applyTransaction({ remove: [selectedData] })
    window.message.success('Delete pixel triggers successfully')
  }
}

const componentIcon = (icon: string) => {
  switch (icon) {
    case 'edit':
      return Settings20Regular
    case 'duplicate':
      return DuplicateOutline
    case 'remove':
      return TrashOutline
  }

  return undefined
}

const urlNow = (item: ActionInfo) => {
  if (item.url) {
    return item.url.replace(':id', props.params.data.id)
  }
  return ''
}

const handleAction = (item: ActionInfo) => {
  if (!item.action) return

  switch (true) {
    case item.delete:
      onDelete(item.action)
      break
  }
}
</script>
<template>
  <div class="flex w-full h-full items-center">
    <component
      :is="item.url ? 'router-link' : 'div'"
      v-for="(item, index) in actionInfo"
      :key="index"
      :to="urlNow(item)"
      :href="urlNow(item)"
      @click="handleAction(item)"
    >
      <n-icon
        v-if="item.icon"
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        :title="item.title"
        :component="componentIcon(item.icon)"
      />
    </component>
  </div>
</template>
