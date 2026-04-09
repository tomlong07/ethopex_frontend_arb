<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Round from '@/components/template-v2/cell/Round.vue'
import Actions from '@/components/template-v2/cell/Actions.vue'
import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import TypeQuestion from '@/components/question_management_ads/cell/TypeQuestion.vue'
import TypeInputQuestion from '@/components/question_management_ads/cell/TypeInputQuestion.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return Actions
    case 'status':
      return Round
    case 'apply_mcc':
    case 'note':
      return Tooltip

    case 'type':
      return TypeQuestion

    case 'type_input':
      return TypeInputQuestion
  }
  return
}
</script>

<template></template>
