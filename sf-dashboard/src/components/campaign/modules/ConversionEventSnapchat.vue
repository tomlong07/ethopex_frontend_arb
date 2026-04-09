<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ConversionEventSnapchatOptions } from '@/options/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: true,
  },
})
const isLoading = ref<boolean>(false)
</script>

<template>
  <FloatingWrapper name="Conversion Event" rounded>
    <n-select
      value-field="value"
      v-model:value="props.campaign.conversion_event"
      :loading="isLoading"
      :disabled="props.isDisabled"
      :options="ConversionEventSnapchatOptions"
    />
  </FloatingWrapper>
</template>
