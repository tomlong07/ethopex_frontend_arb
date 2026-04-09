<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import Round from '@/components/template-v2/cell/Round.vue'
import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import AccountName from './cell/AccountName.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return AccountName
    case 'status':
      return Round
    case 'object':
      return TrafficSource
  }
  return
}
</script>

<template></template>
