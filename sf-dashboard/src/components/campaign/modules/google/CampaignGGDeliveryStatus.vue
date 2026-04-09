<script lang="ts" setup>
import { TType } from '@/enum/naiveui'
import { adGroups, creativeStruct } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as PropType<adGroups | creativeStruct>,
    required: true,
  },

  class1: {
    type: String,
    default: 'w-40 font-bold',
  },

  class2: {
    type: String,
    default: 'flex-1 min-w-0',
  },
})

const delivery_status_reasons_parse = (() => {
  const data = props.data.delivery_status_reasons ?? ''
  try {
    const parsedData = JSON.parse(data)
    return Array.isArray(parsedData) ? parsedData : [parsedData]
  } catch {
    return data ? [data] : []
  }
})()

const typeNow = (status: string = '') => {
  return (helper.classRender(status) as TType) || undefined
}
</script>
<template>
  <div class="flex items-center gap-2">
    <div :class="props.class1">Delivery Status</div>
    <div :class="props.class2">
      <n-tooltip
        :disabled="
          !props.data.delivery_status_reasons ||
          props.data.delivery_status_reasons == 'null'
        "
        style="max-width: 200px; white-space: normal; word-break: break-word"
      >
        <template #trigger>
          <n-tag
            :type="typeNow(props.data.delivery_status)"
            class="n-tag-exclude"
          >
            {{ props.data.delivery_status?.toUpperCase() || 'N/A' }}
          </n-tag>
        </template>
        <div
          v-for="(reason, index) in delivery_status_reasons_parse"
          :key="index"
        >
          {{ reason }}
        </div>
      </n-tooltip>
    </div>
  </div>
</template>
