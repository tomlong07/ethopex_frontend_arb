<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BiddingOptionsGoogle } from '@/options/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Bidding'

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.add_campaign.apply_bidding_type) {
        ruleStoreV3.ruleV3.add_campaign.apply_bidding_type = []
      }
    } else {
      ruleStoreV3.ruleV3.add_campaign.apply_bidding_type = []
    }
  }
)
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.apply_bidding_type"
      clearable
      multiple
      :placeholder="''"
      :options="BiddingOptionsGoogle"
    />
  </FloatingWrapper>
</template>
