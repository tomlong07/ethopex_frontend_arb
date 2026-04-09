<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Demand Source'

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      ruleStoreV3.getDemandSourceOptions()
    } else {
      ruleStoreV3.ruleV3.demands = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    ruleStoreV3.getDemandSourceOptions()
  }
})
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.demands"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      max-tag-count="responsive"
      :placeholder="''"
      :loading="ruleStoreV3.loadingDS"
      :options="ruleStoreV3.demandSourceOptions"
    />
  </FloatingWrapper>
</template>
