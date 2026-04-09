<template>
  <FloatingWrapper name="Name">
    <n-input
      v-model:value="usePromtRule.dataConfig.name"
      placeholder="Enter name"
      maxlength="100"
  /></FloatingWrapper>
</template>
<script setup lang="ts">
import promptRuleStore from '@/store/details/promptRuleStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePromtRule = promptRuleStore()
</script>
