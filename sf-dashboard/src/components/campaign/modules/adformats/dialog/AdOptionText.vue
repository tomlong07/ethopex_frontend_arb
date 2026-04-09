<script lang="ts" setup>
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const name = 'Ad Option Text'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const HeadlineText = computed({
  get: () => props.campaign.ad_formats?.rewarded?.dialog?.ad_option ?? '',
  set: (value) => {
    if (props.campaign.ad_formats?.rewarded?.dialog !== undefined) {
      props.campaign.ad_formats.rewarded.dialog.ad_option = value
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
