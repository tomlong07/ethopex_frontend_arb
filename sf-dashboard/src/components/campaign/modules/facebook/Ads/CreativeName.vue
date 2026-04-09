<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { MAX_LENGTH_NAME_AD_FB } from '@/constants/limits'
import {
  campaignTypeClass,
  creativeStruct,
} from '@/types/components/campaign-v2'

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },

  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const name = 'Name'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="props.adcreative.name"
      show-count
      :maxlength="
        props.campaign.IsTrafficFacebook() ? MAX_LENGTH_NAME_AD_FB : 100
      "
    />
  </FloatingWrapper>
</template>
