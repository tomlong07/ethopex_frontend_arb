<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import { ColumnItem } from '@/types/state/general'
import Clone from '@/assets/icons/Clone.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const urlAction2 = options?.action2 || ''
const editUrl = computed(() => {
  if (!urlAction || !props.params?.data?.id) return ''

  return urlAction?.replace(':id', props.params.data.id)
})

const cloneUrl = computed(() => {
  if (!urlAction2 || !props.params?.data?.id) return ''

  return urlAction2?.replace(':id', props.params.data.id)
})
</script>
<template>
  <div class="flex w-full h-full items-center">
    <router-link v-if="editUrl" :to="editUrl">
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="Settings20Regular"
      />
    </router-link>

    <router-link v-if="cloneUrl" :to="cloneUrl" target="_blank">
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Duplicate"
        :component="Clone"
      />
    </router-link>
  </div>
</template>
