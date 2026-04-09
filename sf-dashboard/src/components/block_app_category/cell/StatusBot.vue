<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const data = props.params.data

const list = {
  Pending: data.bot_pending,
  Success: data.bot_success,
  Error: data.bot_error,
  'No Category': data.bot_no_category,
}

// Map màu cho từng trạng thái (Naive UI hỗ trợ sẵn)
const tagTypeMap: Record<string, TType> = {
  Pending: TType.WARNING,
  Success: TType.SUCCESS,
  Error: TType.ERROR,
  'No Category': TType.DEFAULT,
}

const typeNow = (key: string) => {
  return tagTypeMap[key] as TType
}
const showValue = (v: any) => v || 0
</script>
<template>
  <div class="flex items-center gap-2 flex-wrap">
    <n-tag
      v-for="(value, key) in list"
      :key="key"
      round
      :type="typeNow(key)"
      size="small"
      class="text-xs n-tag-exclude"
    >
      {{ key }} ({{ showValue(value) }})
    </n-tag>
  </div>
</template>
