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
const className = options?.offCapitalize ? '' : 'capitalize'

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
  <n-tooltip
    trigger="hover"
    placement="top-start"
    :style="{ maxWidth: '400px' }"
  >
    <template #trigger>
      <span :class="className">
        {{ showValue }}
      </span>
    </template>
    {{ showValue }}
  </n-tooltip>
</template>
