<script setup lang="ts">
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import TrashOutline from '@/assets/icons/TrashOutline.vue'
import { ctr_chat_telegram } from '@/services/ctr_chat_telegram'
import { ICellRendererParams } from 'ag-grid-community'
import { NPopover } from 'naive-ui'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const handleEdit = async () => {
  window.router.push({ path: `/telegram-chat/edit/${props.params.data.id}` })
}

const handleDelete = async () => {
  const result = await ctr_chat_telegram.DeleteChat(props.params.data.id)

   if (result?.status) {
    let selectedNode = props.params.node
    let selectedData = selectedNode.data
    ;(props.params.api as any).applyTransaction({ remove: [selectedData] })
    window.message.success('Delete Chat successfully')
  }
}
</script>

<template>
  <div class="flex h-full items-center gap-2">
    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <div
          class="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
          @click="handleEdit"
        >
          <Settings20Regular :size="22" />
        </div>
      </template>
      <span>Edit</span>
    </NPopover>
    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <div
          class="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
          @click="handleDelete"
        >
          <TrashOutline :size="22" />
        </div>
      </template>
      <span>Delete</span>
    </NPopover>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
