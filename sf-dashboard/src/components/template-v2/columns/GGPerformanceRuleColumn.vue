<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import andOr from '@/components/rule/cell/andOr.vue'
import RunDaily from '@/components/rule/cell/RunDaily.vue'
import ActionsGGRule from '@/components/google_performance_rule/cell/ActionsGGRule.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'is_and_or':
    case 'status':
      return andOr
    case 'is_run_daily':
      return RunDaily
    case 'action':
      return ActionsGGRule
  }
  return
}
</script>

<template></template>
