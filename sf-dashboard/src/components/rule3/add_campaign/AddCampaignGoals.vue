<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { goalsOptions } from '@/options/rule'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Goals'

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.goals = null
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
      v-model:value="ruleStoreV3.ruleV3.add_campaign.goals"
      filterable
      :placeholder="''"
      :options="goalsOptions"
    />
  </FloatingWrapper>
</template>
