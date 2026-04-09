<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
const ruleStoreV3 = useRuleStoreV3()

onMounted(() => {
  ruleStoreV3.loadIntervalOptions()
})
</script>

<template></template>
