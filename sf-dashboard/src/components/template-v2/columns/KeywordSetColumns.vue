<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import Actions from '@/components/template-v2/cell/Actions.vue'
import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import LimitPageVue from '@/components/keyword_set/cell/LimitPageVue.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return LinkTooltip
    case 'actions':
      return Actions

    case 'limit_page_view':
      return LimitPageVue
    case 'status':
      return Round
  }
  return
}
</script>

<template></template>
