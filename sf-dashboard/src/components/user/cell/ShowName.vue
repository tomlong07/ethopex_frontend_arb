<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { useShowNameStore } from '@/store/useShowNameStore'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const showNameStore = useShowNameStore()

const openModal = () => {
  showNameStore.showModal = true
  showNameStore.user.show_name = props.params.data?.show_name || ''
  showNameStore.user.id = props.params.data?.id || ''
}
const isShow = window.arb.isAdmin()
</script>
<template>
  <div v-if="isShow" class="cursor-pointer" @click="openModal">
    <div class="px-4">
      {{ props.params.data?.show_name || 'No Name' }}
    </div>
  </div>
</template>
