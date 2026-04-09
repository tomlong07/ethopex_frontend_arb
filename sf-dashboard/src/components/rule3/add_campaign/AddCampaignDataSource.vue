<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { dataSourceOptions } from '@/options/rule'
import useRuleStoreV3, { conditionTypeV3 } from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'

const ruleStoreV3 = useRuleStoreV3()

const name = 'Data Source'


const updateDataSource = (value: string) => {
  ruleStoreV3.ruleV3.add_campaign.data_source = value
  if (ruleStoreV3.ruleV3.add_campaign.IsDynamic()) {
    ruleStoreV3.ruleV3.add_campaign.conditions = [new conditionTypeV3()]

    ruleStoreV3.ruleV3.add_campaign.list_campaign_origin = []
  }

  if (value == 'fixed') {
    ruleStoreV3.ruleV3.add_campaign.conditions = []
    ruleStoreV3.ruleV3.add_campaign.interval = null
  }
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.add_campaign.data_source = null
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
      v-model:value="ruleStoreV3.ruleV3.add_campaign.data_source"
      :options="dataSourceOptions"
      :max-tag-count="1"
      :placeholder="''"
      :on-update:value="updateDataSource"
    />
  </FloatingWrapper>
</template>
