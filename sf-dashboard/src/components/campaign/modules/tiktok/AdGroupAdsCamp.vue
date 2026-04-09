<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
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
    <div v-show="props.campaign.IsAPI()" class="flex items-center gap-2">
      <div class="w-40 font-bold">{{ name }}</div>
      <div class="flex-1 min-w-0">
        <n-input-number
          v-model:value="props.adgroup.ads_campaign"
          :placeholder="name"
          :disabled="props.campaign.IsCreativeLandingByCreative()"
        />
      </div>
    </div>
    <div v-show="props.campaign.IsHasAdgroup()" class="flex items-center gap-2">
      <div class="w-40 font-bold">Ads/Adgroup</div>
      <div class="flex-1 min-w-0">
        <n-input-number
          v-model:value="props.adgroup.ads_adgroup"
          placeholder="Ads/Adgroup"
        />
      </div>
    </div>
  </div>
</template>
