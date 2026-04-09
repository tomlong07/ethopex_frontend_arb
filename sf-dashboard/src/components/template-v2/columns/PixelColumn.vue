<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import PixelManagerActions from '@/components/pixel_manager/cell/PixelManagerActions.vue'

import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'
import StatusAction from '@/components/template-v2/cell/StatusAction.vue'
import Tooltip from '@/components/template-v2/cell/Tooltip.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'traffic_source':
      return TrafficSource
    case 'name':
      return LinkTooltip
    case 'action':
      return PixelManagerActions
    case 'status':
      return StatusAction
    case 'pixel_token':
      return Tooltip
  }
  return
}
</script>

<template></template>
