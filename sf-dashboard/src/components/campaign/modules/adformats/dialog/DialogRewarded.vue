<script lang="ts" setup>
import { campaignTypeClass } from '@/types/components/campaign-v2'

import HeadlineText from '@/components/campaign/modules/adformats/dialog/HeadlineText.vue'
import BodyText from '@/components/campaign/modules/adformats/dialog/BodyText.vue'
import AdOptionText from '@/components/campaign/modules/adformats/dialog/AdOptionText.vue'
import AdOptionSubText from '@/components/campaign/modules/adformats/dialog/AdOptionSubText.vue'
import ThankYouSnackbar from '@/components/campaign/modules/adformats/dialog/ThankYouSnackbar.vue'

const nameDialogShow = 'Rewarded Dialog'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const propsDisplay = computed({
  get: () =>
    props.campaign.ad_formats?.rewarded ?? {
      status: 'off',
      floor_price: 0,
      type: 'default',
    },
  set: (value) => {
    if (props.campaign.ad_formats) {
      props.campaign.ad_formats.rewarded = value
    }
  },
})

const currentStatus = computed(() => {
  return propsDisplay.value.status
})
</script>

<template>
  <div v-if="currentStatus === 'on'" class="mt-1 mb-7">
    <div class="flex items-center mb-2">
      <div class="w-40 font-bold flex-shrink-0">
        {{ nameDialogShow }}
      </div>
    </div>

    <div class="space-y-4">
      <HeadlineText :campaign="props.campaign" />
      <BodyText :campaign="props.campaign" />
      <AdOptionText :campaign="props.campaign" />
      <AdOptionSubText :campaign="props.campaign" />
      <ThankYouSnackbar :campaign="props.campaign" />
    </div>
  </div>
</template>
