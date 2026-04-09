<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import Actions from '@/components/template-v2/cell/Actions.vue'
import DateTime from '@/components/template-v2/cell/DateTime.vue'
import StatusBot from '@/components/block_app_category/cell/StatusBot.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return Actions
    case 'status':
      return StatusBot
    case 'created_at':
      return DateTime
  }
  return
}
</script>

<template></template>
