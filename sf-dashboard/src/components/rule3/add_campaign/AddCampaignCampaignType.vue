<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Campaign Type'
const campaignTypeOptions: SelectOption[] = [
  { label: 'Google Search', value: 'gg_search' },
]

//Chưa làm
const handleChangeCampaignType = () => {
  //   fetchCreatives('')
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.campaign_type = null
    }
  }
)
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.campaign_type"
      :options="campaignTypeOptions"
      @update:value="handleChangeCampaignType"
      :placeholder="''"
    />
  </FloatingWrapper>
</template>
