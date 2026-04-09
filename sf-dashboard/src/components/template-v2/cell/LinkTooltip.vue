<script setup lang="ts">
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
const urlAction = options?.action || ''

const editUrl = computed(() => {
  if (!urlAction || !props.params?.data?.id) return ''
  return urlAction?.replace(':id', props.params.data.id)
})

const showValue = computed<string>(() => {
  if (Array.isArray(props.params.value)) {
    if (props.params.value.length === 0) {
      return ''
    }

    if (helper.isObject(props.params.value[0])) {
      switch (true) {
        case props.params.value[0].hasOwnProperty('name'):
          return props.params.value.map((item: any) => item.name).join(', ')
      }
    }
    return props.params.value.join(', ')
  }
  if (helper.isObject(props.params.value)) {
    switch (true) {
      case props.params.value.hasOwnProperty('name'):
        return props.params.value.name
    }
  }
  return props.params.value
})
</script>
<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <a
        class="text-blue-500 no-underline hover:underline"
        target="_blank"
        :class="{ 'cursor-not-allowed': !editUrl }"
        :href="editUrl"
        v-if="editUrl"
      >
        {{ showValue }}
      </a>
      <span v-else>
        {{ showValue }}
      </span>
    </template>
    {{ showValue }}
  </n-tooltip>
</template>
