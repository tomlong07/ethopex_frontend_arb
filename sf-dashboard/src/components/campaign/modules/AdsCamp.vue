<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

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

const name = 'Ads/Campaign'
</script>

<template>
  <div v-if="FreezeData.isAddorDuplicate()" class="flex gap-4 flex-col">
    <FloatingWrapper :name="name" rounded v-show="props.campaign.IsAPI()">
      <n-input-number
        v-model:value="props.campaign.ads_campaign"
        :placeholder="name"
        :disabled="props.campaign.IsCreativeLandingByCreative()"
      />
    </FloatingWrapper>
    <FloatingWrapper
      name="Ads/Adgroup"
      rounded
      v-show="props.campaign.IsHasAdgroup()"
    >
      <n-input-number
        v-model:value="props.campaign.ads_adgroup"
        placeholder="Ads/Adgroup"
      />
    </FloatingWrapper>
  </div>
</template>
