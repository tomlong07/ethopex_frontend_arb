<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { BiddingOptionsGoogle } from '@/options/campaign'
import { biddingCPAOptions, biddingCPCCPMOptions } from '@/options/rule'

const ruleStoreV3 = useRuleStoreV3()

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.ruleV3.traffic_sources?.length == 1 &&
    ['taboola', 'google'].includes(ruleStoreV3.ruleV3.traffic_sources[0])
  )
})

const biddingOptions2 = computed<SelectOption[]>(() => {
  if (ruleStoreV3.ruleV3.traffic_sources?.length == 1) {
    switch (ruleStoreV3.ruleV3.traffic_sources[0]) {
      case 'taboola':
        return biddingCPAOptions.concat(biddingCPCCPMOptions)

      case 'google':
        return BiddingOptionsGoogle
    }
  }

  return []
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.apply_bidding = []
    }
  }
)

const name = `Bidding`
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_bidding"
      filterable
      multiple
      clearable
      :placeholder="''"
      :options="biddingOptions2"
    />
  </FloatingWrapper>
</template>
