<script lang="ts" setup>
import { adGroups, creativeStruct } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as PropType<adGroups | creativeStruct>,
    required: true,
  },

  class1: {
    type: String,
    default: 'w-1/6 font-bold',
  },

  class2: {
    type: String,
    default: 'w-5/6',
  },
})

const delivery_status_reasons_parse = computed(() => {
  const data = props.data.delivery_status_reasons ?? ''
  try {
    const parsedData = JSON.parse(data)
    return Array.isArray(parsedData) ? parsedData : [parsedData]
  } catch {
    return data ? [data] : []
  }
})

const typeNow = (status: string = '') => {
  return helper.classRender(status) || undefined
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
          <n-tag :type="typeNow(props.data.delivery_status)">
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
