<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
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

  index: {
    type: Number,
    required: true,
  },
})

const name = 'URL parameters'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.campaign.IsAPI() && props.campaign.ad_groups"
  >
    <n-input
      maxlength="500"
      v-model:value="props.campaign.ad_groups[props.index].url_parameters"
      :placeholder="name"
      :disabled="
        props.FreezeData.isEditPage() &&
        !!props.campaign?.ad_groups[props.index].id
      "
    >
    </n-input>

    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        Add parameters to the end of your website URL to track where your
        visitors are coming from.
      </n-popover>
    </template>
  </FloatingWrapper>
</template>
