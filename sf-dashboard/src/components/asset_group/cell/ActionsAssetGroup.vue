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
const replaceQuery = options?.replace || ':email'

const editUrl = computed(() => {
  if (!urlAction) return ''

  const publisherData = props.params.data.publisher

  if (!publisherData) {
    return ''
  }

  if (typeof publisherData === 'string') {
    const result = urlAction.replace(replaceQuery, publisherData)
    return result
  }

  const field = replaceQuery.replace(':', '')
  if (!publisherData[field]) {
    return ''
  }

  const result = urlAction.replace(replaceQuery, publisherData[field])

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
