<script lang="ts" setup>
import { RuleVersion } from '@/enum/rule'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Version'

const options = [
  { label: 'Version 1', value: RuleVersion.V1 },
  { label: 'Version 2', value: RuleVersion.V2 },
]

const isShow = computed(() => {
  return !(
    ruleStoreV3.ruleV3.isAddCampaignRule() ||
    ruleStoreV3.ruleV3.isRuleStopCampaign()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (ruleStoreV3.isEditPage && !ruleStoreV3.isClonePage) return
    if (newValue) {
      ruleStoreV3.ruleV3.version = RuleVersion.V1
    } else {
      ruleStoreV3.ruleV3.version = null
    }
  },
  { immediate: true }
)
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.version"
      clearable
      :options="options"
      :disabled="ruleStoreV3.isEditPage && !ruleStoreV3.isClonePage"
      placeholder=""
    />
  </FloatingWrapper>
</template>
