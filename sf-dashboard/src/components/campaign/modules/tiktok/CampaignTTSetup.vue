<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignSetupOptions } from '@/options/campaign'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

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
const isDisableSmart = computed(() => {
  return props.campaign.type === 'TRAFFIC'
})

watch(
  () => isDisableSmart.value,
  async (newValue, oldValue) => {
    if (isDisableSmart.value) {
      props.campaign.campaign_setup = 'manual'
    }
  }
)
onMounted(() => {
  if (!props.campaign.campaign_setup) {
    props.campaign.campaign_setup = 'manual'
  }
})
</script>

<template>
  <FloatingWrapper name="Campaign setup" rounded>
    <n-select
      v-model:value="props.campaign.campaign_setup"
      :options="campaignSetupOptions"
      filterable
      clearable
      placeholder="Campaign setup"
      :disabled="props.FreezeData.isEditPage()"
    />
  </FloatingWrapper>
</template>
