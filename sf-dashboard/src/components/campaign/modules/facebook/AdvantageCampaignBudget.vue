<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

import AdGroupTag from '../adgroup/AdGroupTag.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { BIDSTRATEGY } from '@/enum/campaign'

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

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.SetAdvantageCampaignBudgetOn()
    } else {
      props.campaign.advantage_campaign_budget = undefined
    }
  }
)

// const onBudget = () => {
//   const adGroup = props.campaign.ad_groups || []
//   const existCostPerResult = adGroup.some((item) => !!item.cost_per_result)

//   if (existCostPerResult) {
//     props.campaign.bid_strategy = BIDSTRATEGY.COST_PER_RESULT_GOAL
//   }
// }

const isFistTimeInit = ref(false)

onMounted(() => {
  if (props.FreezeData.isAddPage()) {
    isFistTimeInit.value = true
  }
})

const name = 'Campaign budget'
watch(
  () => props.campaign.advantage_campaign_budget,
  (v) => {
    const isOnAdv = props.campaign.IsOnAdvantageCampaignBudget()
    isFistTimeInit.value = false

    if (isOnAdv) {
      // bật budget
      props.campaign.ClearAdGroupBidAndCost()
      props.campaign.bid_strategy = BIDSTRATEGY.HIGHEST_VOLUME
    } else {
      //Off
      props.campaign.bid_strategy = null
      props.campaign.SetAdGroupDefaultBidStrategy()
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="text-xs font-bold">{{ name }}</div>
    <div class="flex justify-between flex-1 min-w-0">
      <CustomSwitch
        v-model="props.campaign.advantage_campaign_budget"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="props.FreezeData.isEditPage()"
      />
      <AdGroupTag :campaign="props.campaign" type="budget" />
    </div>
  </div>
</template>
