<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
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
</script>

<template>
  <div class="flex w-full h-full items-center" v-if="editUrl">
    <router-link :to="editUrl">
      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-icon
            size="32"
            class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
            :component="Settings20Regular"
          />
        </template>
        Edit
      </n-tooltip>
    </router-link>
  </div>
</template>
