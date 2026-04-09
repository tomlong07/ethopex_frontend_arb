<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import { dataFromOptions } from '@/types/components/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Data From'

const changeDataFrom = (value: any) => {
  ruleStoreV3.ruleV3.add_campaign.data_from = value

  if (ruleStoreV3.ruleV3.isDataFromLink()) {
    ruleStoreV3.ruleV3.add_campaign.landing_page_type = 'custom'
  }
}

watch(
  () => ruleStoreV3.ruleV3.isAddCampaignRule(),
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.add_campaign.data_from = null
    }
  }
)
</script>

<template>
  <FloatingWrapper :name="name" v-if="ruleStoreV3.ruleV3.isAddCampaignRule()">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.data_from"
      filterable
      clearable
      :placeholder="''"
      :options="dataFromOptions"
      :on-update:value="changeDataFrom"
    />
  </FloatingWrapper>
</template>
