<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()
</script>

<template>
  <FloatingWrapper name="Description">
    <n-input
      v-model:value="ruleStoreV3.ruleV3.description"
      :placeholder="''"
      type="textarea"
    />
  </FloatingWrapper>
</template>
