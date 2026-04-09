<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ConversionEventSnapchatOptions } from '@/options/campaign'
import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'
import { linkField } from './helpers'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: true,
  },
  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})
const isLoading = ref<boolean>(false)
const conversionEventModel = linkField<string | null>('conversion_event', [
  () => props.adGroup,
])
</script>

<template>
  <FloatingWrapper name="Conversion Event" rounded>
    <n-select
      value-field="value"
      v-model:value="conversionEventModel"
      :loading="isLoading"
      :disabled="props.isDisabled"
      :options="ConversionEventSnapchatOptions"
    />
  </FloatingWrapper>
</template>
