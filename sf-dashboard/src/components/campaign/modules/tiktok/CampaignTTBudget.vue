<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { budgetOptionsTT } from '@/options/campaign'
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
// console.log(props.campaign.IsSmart())

watch(
  () => props.campaign.IsSmart(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.bidding = 'BUDGET_MODE_DAY'
    }
  }
)
const isDisableBudget = computed(() => {
  return props.campaign.budget === 0
})
</script>

<template>
  <FloatingWrapper name="Budget" rounded>
    <n-input-group>
      <n-select
        v-model:value="props.campaign.bidding"
        :options="budgetOptionsTT"
        class="w-1/2"
        :disabled="!!props.campaign.traffic_source_id"
      />
      <n-input-number
        v-model:value="props.campaign.budget"
        max="50000"
        min="0"
        class="w-1/2"
        :disabled="isDisableBudget && props.FreezeData.isEditPage()"
      >
        <template #prefix> $ </template>
      </n-input-number>
    </n-input-group>
  </FloatingWrapper>
</template>
