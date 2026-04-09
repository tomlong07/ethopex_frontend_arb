<script lang="ts" setup>
import { YES_NO } from '@/enum/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { optionTypes } from '@/options/rule'
const ruleStoreV3 = useRuleStoreV3()

const name = 'CP'
const traffic_source = 'google'
const isShow = computed(() => {
  return ruleStoreV3.ruleV3.traffic_sources?.includes(traffic_source)
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.apply_object_type_cp = null
    }
  }
)
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_object_type_cp"
      :options="optionTypes"
      clearable
      placeholder="All"
    />
  </FloatingWrapper>
</template>
