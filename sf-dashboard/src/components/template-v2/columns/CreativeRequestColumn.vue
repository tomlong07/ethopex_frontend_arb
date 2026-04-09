<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Actions from '@/components/template-v2/cell/Actions.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import DateTime from '@/components/template-v2/cell/DateTime.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return Actions
    case 'keyword_set_name':
    case 'publisher':
      return Tooltip
    case 'status':
      return Round
    case 'created_at':
      return DateTime
  }
  return
}
</script>

<template></template>
