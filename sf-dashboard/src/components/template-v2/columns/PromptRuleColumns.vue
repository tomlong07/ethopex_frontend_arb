<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import Actions from '@/components/template-v2/cell/Actions.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return Actions
  }
  return
}
</script>

<template></template>
