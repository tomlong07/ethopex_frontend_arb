<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Rule Type'

const handleChangeRuleType = (newType: string) => {
  ruleStoreV3.ruleV3.rule_type = newType
}

const isShowWarningRuleType = computed<boolean>(() => {
  if (!ruleStoreV3.isSectionChoose || !ruleStoreV3.ruleV3.conditions?.length) {
    return false
  }

  for (let index = 0; index < ruleStoreV3.ruleV3.conditions?.length; index++) {
    const element = ruleStoreV3.ruleV3.conditions[index]
    if (element.comparison_type == 'percent_of_campaign') {
      return true
    }
  }

  return false
})

onMounted(() => {
  ruleStoreV3.getRuleTypeOptions()
})
const ruleTypeTooltipMessage = computed(() => {
  if (isShowWarningRuleType.value) {
    return "Please remove '% of campaign' to change Rule Type"
  }
  return ruleStoreV3.showErr['rule_type'] || ''
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="ruleTypeTooltipMessage"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.rule_type"
      filterable
      :status="ruleStoreV3.showErr['rule_type'] ? 'error' : undefined"
      clearable
      :loading="ruleStoreV3.ruleTypeOptionLoading"
      :options="ruleStoreV3.ruleTypeOption"
      :disabled="
        (ruleStoreV3.isEditPage && !ruleStoreV3.isClonePage) ||
        isShowWarningRuleType
      "
      :on-update:value="handleChangeRuleType"
      :placeholder="''"
    />
  </FloatingWrapper>
</template>
