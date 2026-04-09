<script lang="ts" setup>
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BIDSTRATEGY } from '@/enum/campaign'
import { originalBidStrategyOptions } from '@/options/campaign'
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

const bidStrategyOptions = ref<SelectOption[]>([...originalBidStrategyOptions])

watch(
  () => props.campaign.type,
  (v) => {
    if (props.campaign.IsLeads()) {
      bidStrategyOptions.value = originalBidStrategyOptions.filter(
        (opt) => opt.value !== BIDSTRATEGY.ROAS_GOAL
      )
    } else {
      bidStrategyOptions.value = [...originalBidStrategyOptions]
    }
  }
)

const name = 'Campaign bid strategy'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.campaign.IsOnAdvantageCampaignBudget()"
  >
    <n-select
      v-model:value="props.campaign.bid_strategy"
      :options="bidStrategyOptions"
      :disabled="props.FreezeData.isEditPage()"
    />
  </FloatingWrapper>
</template>
