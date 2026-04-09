<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Considering Data From'

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.ruleV3.add_campaign.IsDynamic()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.add_campaign.interval = null
    }
  }
)

onMounted(() => {
  ruleStoreV3.loadIntervalOptions()
})
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.interval"
      filterable
      clearable
      :placeholder="''"
      :options="ruleStoreV3.intervalOptions"
    />
  </FloatingWrapper>
</template>
