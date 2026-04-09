<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BiddingOptionsGoogle } from '@/options/campaign'
import { biddingModeOptions } from '@/options/rule'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Bidding'

const biddingModeTextPrefix = computed(() => {
  if (!ruleStoreV3.ruleV3.add_campaign.bidding_mode) return ''

  const found = biddingModeOptions.find(
    (item) => item.value == ruleStoreV3.ruleV3.add_campaign.bidding_mode
  )

  return found ? found.prefix : ''
})

const biddingModeTextSuffix = computed(() => {
  if (!ruleStoreV3.ruleV3.add_campaign.bidding_mode) return ''

  const found = biddingModeOptions.find(
    (item) => item.value == ruleStoreV3.ruleV3.add_campaign.bidding_mode
  )

  return found ? found.suffix : ''
})

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.bidding_type = null
      ruleStoreV3.ruleV3.add_campaign.bidding = null
      ruleStoreV3.ruleV3.add_campaign.bidding_mode = null
    }
  }
)
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <div class="w-1/3">
      <FloatingWrapper :name="name">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.add_campaign.bidding_type"
          clearable
          :placeholder="''"
          :options="BiddingOptionsGoogle"
        />
      </FloatingWrapper>
    </div>

    <div class="w-1/3">
      <FloatingWrapper :name="'Enter Bidding Value'">
        <n-input-number
          v-model:value="ruleStoreV3.ruleV3.add_campaign.bidding"
          :min="0"
          :max="1000"
          placeholder=""
        >
          <template #prefix v-if="biddingModeTextPrefix">
            {{ biddingModeTextPrefix }}</template
          >

          <template #suffix v-if="biddingModeTextSuffix">
            {{ biddingModeTextSuffix }}</template
          >
        </n-input-number>
      </FloatingWrapper>
    </div>

    <div class="w-1/3">
      <FloatingWrapper :name="'Bidding Mode'">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.add_campaign.bidding_mode"
          :options="biddingModeOptions"
          placeholder=""
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
