<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { adGroups, campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { deliveryTypeOptions } from '@/options/campaign'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const displayDeliveryType = computed(() => {
  if (props.campaign.type === 'WEB_CONVERSION') {
    props.adgroup.delivery_type = undefined
    return false
  }
  return true
})
</script>

<template>
  <div class="flex items-center gap-2" v-if="displayDeliveryType">
    <FloatingWrapper name="Delivery Type">
      <div class="flex-1 min-w-0 flex items-center">
        <n-select
          v-model:value="props.adgroup.delivery_type"
          :options="deliveryTypeOptions"
          placeholder="Delivery type"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
