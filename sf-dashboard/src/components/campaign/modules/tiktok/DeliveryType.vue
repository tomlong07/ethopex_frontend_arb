<script setup lang="ts">
import { deliveryTypeOptions, deliveryTypeOptionsTT } from '@/options/campaign'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const isDisableDeliveryType = computed<boolean>(() => {
  if (
    props.campaign.budget_optimize_on === 'on' &&
    props.campaign.type === 'TRAFFIC'
  ) {
    return true
  }
  return false
})

watch(
  () => isDisableDeliveryType.value,
  (newValue, oldValue) => {
    if (newValue) {
      props.campaign.delivery_type = 'PACING_MODE_SMOOTH'
    }
  }
)

const name = 'Delivery Type'
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <n-select
        :placeholder="name"
        v-model:value="props.campaign.delivery_type"
        :disabled="isDisableDeliveryType || props.FreezeData.isEditPage()"
        :options="deliveryTypeOptionsTT"
      />
    </div>
  </div>
</template>
