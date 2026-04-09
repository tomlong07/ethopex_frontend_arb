<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { budgetTypeOptions } from '@/options/campaign'
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
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI() && props.campaign.IsOnAdvantageCampaignBudget()
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.budget = 1
      props.campaign.bidding = 'DAILY_BUDGET'
    } else {
      props.campaign.budget = undefined
      props.campaign.bidding = undefined
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Budget" rounded v-if="isShow">
    <div class="flex-1 min-w-0 flex gap-2">
      <div class="w-1/2">
        <n-select
          v-model:value="props.campaign.bidding"
          :options="budgetTypeOptions"
          :disabled="
            props.FreezeData.isEditPage() && !!props.campaign.traffic_source_id
          "
        />
      </div>
      <div class="w-1/2">
        <n-input-number
          v-model:value="props.campaign.budget"
          max="50000"
          min="0"
          :precision="2"
        >
          <template #prefix> $ </template>
        </n-input-number>
      </div>
    </div>
  </FloatingWrapper>
</template>
