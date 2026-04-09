<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { NButton } from 'naive-ui'

import { useUserLabel } from '@/store/useUserLabel'
const userLabelStore = useUserLabel()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const openModal = () => {
  userLabelStore.showModal = true
  userLabelStore.userId = props.params.data?.id || ''
  userLabelStore.email = props.params.data?.email || ''
  userLabelStore.labelName = props.params.data?.label || ''
}
</script>
<template>
  <div class="cursor-pointer" @click="openModal">
    <div v-if="props.params.data?.label" class="px-4">
      {{ props.params.data?.label }}
    </div>
    <n-button v-else class="text-gray-500 border" round>Assign Label</n-button>
  </div>
</template>
