<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import CustomAudience2 from '@/components/campaign/modules/snapchat/CustomAudience2.vue'

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
  <n-card
    title="Audiences"
    class="card-flex-gap-4"
    v-show="props.campaign.IsSnapNeedAudience()"
  >
    <CampaignSCPreAudience
      :campaign="props.campaign"
      :FreezeData="props.FreezeData"
    />

    <CustomAudience2
      :campaign="props.campaign"
      :FreezeData="props.FreezeData"
    />
  </n-card>
</template>

<style lang="scss">
// Hide the select all button because it doesn’t work correctly—it will unnecessarily select parent nodes that shouldn’t be selected, and the button isn’t really needed anyway.
.transfer-parent-audience.n-transfer .n-transfer-list .n-transfer-list-header {
  display: none;
}

.transfer-parent-audience.n-transfer
  .n-transfer-list
  .n-transfer-list-body
  .n-transfer-list-flex-container {
  margin-top: 1rem;
}
</style>
