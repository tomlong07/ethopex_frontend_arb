<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

onMounted(() => {
  if (ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    ruleStoreV3.fetchDomainLabelOptions()
  }
})

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.apply_account_label) {
        ruleStoreV3.ruleV3.apply_account_label = []
      }
      ruleStoreV3.fetchDomainLabelOptions()
    } else {
      ruleStoreV3.ruleV3.apply_account_label = undefined
    }
  }
)

const name = `Label`
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_account_label"
      :options="ruleStoreV3.domainLabelOptions"
      :loading="ruleStoreV3.loadingLabel"
      :placeholder="''"
      multiple
      filterable
      clearable
      :max-tag-count="1"
    />
  </FloatingWrapper>
</template>
