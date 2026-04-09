<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Round from '@/components/template-v2/cell/Round.vue'

import ActionsTestBudget from '@/components/test_budget/cell/ActionsTestBudget.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return ActionsTestBudget
    case 'status':
      return Round
  }
  return
}
</script>

<template></template>
