<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import PixelTriggerActions from '@/components/pixel_triggers/cell/PixelTriggerActions.vue'
import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'
import StatusAction from '@/components/template-v2/cell/StatusAction.vue'
import DateTime from '@/components/template-v2/cell/DateTime.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return LinkTooltip
    case 'action':
      return PixelTriggerActions
    case 'status':
      return StatusAction
    case 'created_at':
      return DateTime
  }
  return
}
</script>

<template></template>
