<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { PLACEMENT_TYPE } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})
</script>

<template>
  <FloatingWrapper
    name="Type"
    rounded
    v-if="isShow && props.campaign.ad_groups"
  >
    <n-radio-group
      class="border rounded-md p-2"
      :disabled="
        props.campaign.categories && props.campaign.categories?.length > 0
      "
      v-model:value="props.campaign.ad_groups[props.index].audience_type"
    >
      <div class="flex gap-2">
        <n-radio :value="PLACEMENT_TYPE.ADVANTAGE" class="flex">
          <div class="text-gray-600">Advantage+</div>
        </n-radio>
        <n-radio :value="PLACEMENT_TYPE.MANUAL" class="flex">
          <div class="text-gray-600">Manual</div>
        </n-radio>
      </div>
    </n-radio-group>
  </FloatingWrapper>
</template>
