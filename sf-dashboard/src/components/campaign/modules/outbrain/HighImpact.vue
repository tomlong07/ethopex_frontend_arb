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
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold">High impact placements</div>
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <CustomSwitch
        v-model="props.campaign.impact_placements"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="props.FreezeData.isEditPage()"
      />

      <div>Run in single, brand exclusive placements across our publishers</div>
    </div>
  </div>
</template>
