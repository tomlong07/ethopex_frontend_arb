<script setup lang="ts">
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { ColumnItem } from '@/types/state/general'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem

const urlAction = options?.action
const replaceQuery = options?.replace

const editUrl = computed(() => {
  if (!urlAction || !replaceQuery) return ''

  const data = props.params.data

  if (!data) {
    return ''
  }

  if (typeof data === 'string') {
    const result = urlAction.replace(replaceQuery, data)
    return result
  }

  const field = replaceQuery.replace(':', '')
  if (!data[field]) {
    return ''
  }

  const result = urlAction.replace(replaceQuery, data[field])

  return result
})
</script>

<template>
  <div class="flex w-full h-full items-center" v-if="editUrl">
    <router-link :to="editUrl">
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="Settings20Regular"
      />
    </router-link>
  </div>
</template>
