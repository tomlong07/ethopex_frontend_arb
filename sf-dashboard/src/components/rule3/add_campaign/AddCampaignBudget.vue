<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Budget'

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.budget = null
    }
  }
)
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-input-number
      v-model:value="ruleStoreV3.ruleV3.add_campaign.budget"
      :min="0"
      :max="50000"
      :placeholder="''"
    >
      <template #prefix> $</template>
    </n-input-number>
  </FloatingWrapper>
</template>
