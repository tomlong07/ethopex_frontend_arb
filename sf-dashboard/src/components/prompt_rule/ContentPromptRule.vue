<template>
  <FloatingWrapper name="Content">
    <n-input
      v-model:value="usePromtRule.dataConfig.content"
      type="textarea"
      placeholder="Enter content"
  /></FloatingWrapper>
</template>
<script setup lang="ts">
import promptRuleStore from '@/store/details/promptRuleStore'
const usePromtRule = promptRuleStore()
</script>
