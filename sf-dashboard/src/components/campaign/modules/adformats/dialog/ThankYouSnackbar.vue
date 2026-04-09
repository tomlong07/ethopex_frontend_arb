<script lang="ts" setup>
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const name = 'Thank You Snackbar'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const HeadlineText = computed({
  get: () => props.campaign.ad_formats?.rewarded?.dialog?.thank_you ?? '',
  set: (value) => {
    if (props.campaign.ad_formats?.rewarded?.dialog !== undefined) {
      props.campaign.ad_formats.rewarded.dialog.thank_you = value
    }
  },
})
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.ad_formats">
    <n-input
      v-model:value="HeadlineText"
      :placeholder="name"
      show-count
      class="w-full"
    />
  </FloatingWrapper>
</template>
