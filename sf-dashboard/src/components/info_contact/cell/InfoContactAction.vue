<script setup lang="ts">
import AddNote from '@/assets/icons/AddNote.vue'
import Details from '@/assets/icons/Details.vue'
import useInfoContact from '@/store/useInfoContact'
import { ICellRendererParams } from 'ag-grid-community'
import { NPopover } from 'naive-ui'

const infoContactStore = useInfoContact()
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const handleClick = () => {
  infoContactStore.selectedContact = props.params.data
  infoContactStore.noteContent = ''
  infoContactStore.showModal = true
  infoContactStore.cancelEdit()
}

const handleDetailClick = () => {
  infoContactStore.selectedContact = props.params.data
  infoContactStore.selectedContactStatus = infoContactStore.selectedContact.status
  infoContactStore.showDetailModal = true
  infoContactStore.cancelEdit()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Note Icon -->
    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <div
          class="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
          @click="handleClick"
        >
          <AddNote :size="22" />
        </div>
      </template>
      <span>Note</span>
    </NPopover>

    <!-- Detail Icon -->
    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <div
          class="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
          @click="handleDetailClick"
        >
          <Details :size="22" />
        </div>
      </template>
      <span>Details</span>
    </NPopover>
  </div>
</template>