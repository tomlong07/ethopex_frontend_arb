<script setup lang="ts">
import { CampaignContext } from '@/types/components/campaign-v2'

import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

watch(
  () => props.data.campaign.IsSmart(),
  (newValue, oldValue) => {
    if (newValue) {
      props.data.campaign.budget_optimize_on = 'off'
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold text-xs">Budget optimization</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.data.campaign.budget_optimize_on"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="
          props.data.FreezeData.isEditPage() || props.data.campaign.IsSmart()
        "
      />
    </div>
  </div>
</template>
