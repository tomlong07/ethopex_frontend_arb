<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()
const name = 'Landing Page Type'

const landingPageTypeOptions = computed<SelectOption[]>(() => {
  if (ruleStoreV3.ruleV3.isDataFromReport()) {
    return [
      { label: 'Campaign Origin', value: 'origin' },
      { label: 'Custom', value: 'custom' },
    ]
  }
  return [{ label: 'Custom', value: 'custom' }]
})

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isAddCampaignRule() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.add_campaign.landing_page_type = null
    }
  }
)
</script>
<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.landing_page_type"
      filterable
      clearable
      :placeholder="''"
      :options="landingPageTypeOptions"
    />
  </FloatingWrapper>
</template>
