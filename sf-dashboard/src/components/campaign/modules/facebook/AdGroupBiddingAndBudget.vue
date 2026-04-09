<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { budgetTypeOptions } from '@/options/campaign'
import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  isEditPage: {
    type: Boolean,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI() && props.campaign.IsOffAdvantageCampaignBudget()
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.campaign.ad_groups) {
      if (newValue) {
        props.adgroup.budget = 5
        props.adgroup.bidding = 'DAILY_BUDGET'
      } else {
        props.adgroup.budget = undefined
        props.adgroup.bidding = undefined
      }
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Budget" rounded required v-if="isShow">
    <div class="flex-1 min-w-0 flex gap-2">
      <div class="w-1/2">
        <n-select
          v-model:value="props.adgroup.bidding"
          :options="budgetTypeOptions"
          :disabled="props.isEditPage && !!props.adgroup.ad_group_id"
        />
      </div>
      <div class="w-1/2">
        <n-input-number
          v-model:value="props.adgroup.budget"
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
