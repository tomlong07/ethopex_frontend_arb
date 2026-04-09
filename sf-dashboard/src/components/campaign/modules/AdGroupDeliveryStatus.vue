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
    default: 'w-29 font-bold',
  },
})

const typeNow = (status: string = '') => {
  return (helper.classRender(status) as TType) || undefined
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="props.class1">Delivery Status</div>
    <div class="flex-1 min-w-0">
      <n-tag :type="typeNow(props.data.delivery_status)" class="n-tag-exclude"
        >{{ props.data.delivery_status?.toUpperCase() || 'N/A' }}
      </n-tag>
    </div>
  </div>
</template>
