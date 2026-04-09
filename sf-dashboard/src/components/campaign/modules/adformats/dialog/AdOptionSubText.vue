<script lang="ts" setup>
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const name = 'Ad Option Sub Text'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const HeadlineText = computed({
  get: () => props.campaign.ad_formats?.rewarded?.dialog?.ad_option_sub ?? '',
  set: (value) => {
    if (props.campaign.ad_formats?.rewarded?.dialog !== undefined) {
      props.campaign.ad_formats.rewarded.dialog.ad_option_sub = value
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
