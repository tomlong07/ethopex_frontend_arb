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
const tiktokOptimizationGoalOptions = computed<SelectOption[]>(() => {
  return props.data.campaign.type === 'WEB_CONVERSIONS'
    ? [
        { label: 'Convert', value: 'CONVERT' },
        { label: 'Value', value: 'VALUE' },
      ]
    : [
        { label: 'Click', value: 'CLICK' },
        { label: 'Landing page view', value: 'TRAFFIC_LANDING_PAGE_VIEW' },
      ]
})

// const isDisableValue = computed(() => {
//   return (
//     props.campaign.type === 'WEB_CONVERSIONS' &&
//     props.campaign.optimization_event !== 'SHOPPING'
//   )
// })

const onChangeOptimization = () => {
  props.data.campaign.bidding = null
  props.data.campaign.cpc = 0
}

watch(
  () => props.data.campaign.type,
  async () => {
    props.data.campaign.optimization_goal = tiktokOptimizationGoalOptions
      .value[0].value as string
  }
)

const name = 'Optimization Goal'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      v-model:value="props.data.campaign.optimization_goal"
      :disabled="!!props.data.campaign.traffic_source_id"
      :placeholder="name"
      :options="tiktokOptimizationGoalOptions"
      @update:value="onChangeOptimization"
    />
  </FloatingWrapper>
</template>
