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
    <div class="w-40 font-bold">Exclude AdBlock users</div>
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <CustomSwitch
        v-model="props.campaign.exclude_adblock"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="props.FreezeData.isEditPage()"
      />
      <div>
        Anti-target users who have installed AdBlock software on their device
      </div>
    </div>
  </div>
</template>
