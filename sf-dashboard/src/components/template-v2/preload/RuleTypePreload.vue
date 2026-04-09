<script setup lang="ts">
import { ctr_rule } from '@/services/ctr_rule'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

onMounted(async () => {
  const result = await ctr_rule.GetRuleType()

  templateV2Store.ruleTypeOptions = result?.data || []
})
</script>

<template></template>
