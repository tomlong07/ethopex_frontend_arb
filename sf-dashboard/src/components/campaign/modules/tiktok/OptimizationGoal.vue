<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  // adgroup: {
  //   type: Object as () => adGroups,
  //   required: true,
  // },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const tiktokOptimizationGoalOptions = computed<SelectOption[]>(() => {
  return props.campaign.type === 'WEB_CONVERSIONS'
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
  props.campaign.bidding = null
  props.campaign.cpc = 0
}

watch(
  () => props.campaign.type,
  async () => {
    props.campaign.optimization_goal = tiktokOptimizationGoalOptions.value[0]
      .value as string
  }
)

const name = 'Optimization Goal'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      v-model:value="props.campaign.optimization_goal"
      :disabled="!!props.campaign.traffic_source_id"
      :placeholder="name"
      :options="tiktokOptimizationGoalOptions"
      @update:value="onChangeOptimization"
    />
  </FloatingWrapper>
</template>
