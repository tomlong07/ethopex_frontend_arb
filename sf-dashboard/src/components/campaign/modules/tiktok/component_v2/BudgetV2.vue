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

// console.log(props.campaign.IsSmart())

const budgetTypeOptions: SelectOption[] = [
  { value: 'BUDGET_MODE_DAY', label: 'Daily' },
  { value: 'BUDGET_MODE_TOTAL', label: 'Lifetime' },
]
watch(
  () => props.data.campaign.IsSmart(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.data.campaign.bidding = 'BUDGET_MODE_DAY'
    }
  }
)
const isDisableBudget = computed(() => {
  return props.data.campaign.budget === 0
})
</script>

<template>
  <FloatingWrapper name="Budget" rounded>
    <n-input-group>
      <n-select
        v-model:value="props.data.campaign.bidding"
        :options="budgetTypeOptions"
        class="w-1/2"
        :disabled="!!props.data.campaign.traffic_source_id"
      />
      <n-input-number
        v-model:value="props.data.campaign.budget"
        max="50000"
        min="0"
        class="w-1/2"
        :disabled="isDisableBudget && props.data.FreezeData.isEditPage()"
      >
        <template #prefix> $ </template>
      </n-input-number>
    </n-input-group>
  </FloatingWrapper>
</template>
