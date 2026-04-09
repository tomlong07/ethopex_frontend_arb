<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CampaignContext } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

// const isDisableSmart = computed(() => {
//   return props.campaign.type === 'TRAFFIC'
// })
const campaignSetupOptions = computed<SelectOption[]>(() => {
  return [
    { value: 'manual', label: 'Manual' },
    // { value: 'smart', label: 'Smart', disabled: true },
  ]
})
// watch(
//   () => isDisableSmart.value,
//   async (newValue, oldValue) => {
//     if (isDisableSmart.value) {
//       props.campaign.campaign_setup = 'manual'
//     }
//   }
// )
onMounted(() => {
  if (!props.data.campaign.campaign_setup) {
    props.data.campaign.campaign_setup = 'manual'
  }
})
</script>

<template>
  <FloatingWrapper name="Campaign setup" rounded>
    <n-select
      v-model:value="props.data.campaign.campaign_setup"
      :options="campaignSetupOptions"
      filterable
      clearable
      placeholder="Campaign setup"
      :disabled="props.data.FreezeData.isEditPage()"
    />
  </FloatingWrapper>
</template>
