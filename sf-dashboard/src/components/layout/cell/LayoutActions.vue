<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

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
const editUrl = computed(() => {
  if (!urlAction || !props.params?.data?.id) return ''

  return urlAction?.replace(':id', props.params.data.id)
})

const urlAction2 = options?.action2 || ''
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

    <router-link
      v-if="urlAction2"
      :to="`${urlAction2}?duplicate=${props.params.data.id}`"
      target="_blank"
    >
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Duplicate"
        :component="DuplicateOutline"
      />
    </router-link>
  </div>
</template>
