<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { RuleScheduleOptions } from '@/options/rule'

const ruleStoreV3 = useRuleStoreV3()
const name = 'Schedule'

watch(
  () => ruleStoreV3.ruleV3.isRuleStopCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.schedule = 'daily'
    } else {
      ruleStoreV3.ruleV3.schedule = null
    }
  }
)
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="ruleStoreV3.showErr['schedule']"
    v-if="ruleStoreV3.ruleV3.isShowSchedule()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.schedule"
      filterable
      :status="ruleStoreV3.showErr['schedule'] ? 'error' : undefined"
      clearable
      :placeholder="name"
      :options="RuleScheduleOptions"
      :disabled="ruleStoreV3.ruleV3.isRuleStopCampaign()"
    />
  </FloatingWrapper>
</template>
