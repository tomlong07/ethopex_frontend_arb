<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { RuleExIntervalOption } from '@/options/rule'

const ruleStoreV3 = useRuleStoreV3()

const name = 'Exclude Days From Interval'

const isShow = computed(() => {
  if (
    ruleStoreV3.ruleV3.isRuleStopCampaign() ||
    ruleStoreV3.ruleV3.isDataFromLink() ||
    ruleStoreV3.ruleV3.isVersion2()
  ) {
    return false
  }
  return true
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.interval_exclude = null
    }
  }
)
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.interval_exclude"
      filterable
      clearable
      :placeholder="''"
      :options="RuleExIntervalOption"
    />
  </FloatingWrapper>
</template>
