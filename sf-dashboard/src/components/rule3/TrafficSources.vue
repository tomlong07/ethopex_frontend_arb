<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Traffic Source'

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

watch(
  () => ruleStoreV3.ruleV3.rule_type,
  (newRuleType) => {
    if (newRuleType === 'duplicate_campaign' && isShow.value) {
      const facebookOption = ruleStoreV3.trafficSourceOptions?.find(
        (option: any) => option.value === 'facebook'
      )
      
      // check facebook option
      if (facebookOption?.value) {
        const facebookValue = String(facebookOption.value)
        const currentSources = ruleStoreV3.ruleV3.traffic_sources || []
        
        if (!currentSources.includes(facebookValue)) {
          ruleStoreV3.ruleV3.traffic_sources = [...currentSources, facebookValue]
        }
      }
    }
  }
)

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      ruleStoreV3.getTrafficSourceOptions()
    } else {
      ruleStoreV3.ruleV3.traffic_sources = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    ruleStoreV3.getTrafficSourceOptions()
  }
})
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.traffic_sources"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      max-tag-count="responsive"
      :placeholder="''"
      :loading="ruleStoreV3.loadingTS"
      :options="ruleStoreV3.trafficSourceOptions"
    />
  </FloatingWrapper>
</template>