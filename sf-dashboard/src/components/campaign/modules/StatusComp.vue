<script setup lang="ts">
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="font-bold text-xs w-12">Status</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.campaign.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
