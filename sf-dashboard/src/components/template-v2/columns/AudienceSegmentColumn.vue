<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import SegmentType from '@/components/segment/cell/SegmentType.vue'
import SegmentAction from '@/components/segment/cell/SegmentAction.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return SegmentAction
    case 'type':
      return SegmentType
  }
  return
}
</script>

<template></template>
