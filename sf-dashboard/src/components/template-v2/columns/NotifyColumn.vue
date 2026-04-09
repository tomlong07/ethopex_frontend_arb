<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import ActionEdit from '@/components/notify_system_page/cell/ActionEdit.vue'
import ActionStatus from '@/components/notify_system_page/cell/ActionStatus.vue'
import Message from '@/components/notify_system_page/cell/Message.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return ActionEdit
    case 'status':
      return ActionStatus
    case 'message':
      return Message
  }
  return
}
</script>
<template></template>
