<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

import CustomSwitch from '@/components/common/CustomSwitch.vue'

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

watch(
  () => props.campaign.IsSmart(),
  (newValue, oldValue) => {
    if (newValue) {
      props.campaign.budget_optimize_on = 'off'
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold text-xs">Budget optimization</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="campaign.budget_optimize_on"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="props.FreezeData.isEditPage() || props.campaign.IsSmart()"
      />
    </div>
  </div>
</template>
