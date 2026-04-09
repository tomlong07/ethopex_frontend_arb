<script setup lang="ts">
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { CampaignContext } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="font-bold text-xs w-12">Status</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="data.campaign.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
