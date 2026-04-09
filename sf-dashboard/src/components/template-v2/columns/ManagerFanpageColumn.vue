<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import ThumbImage from '@/components/account/cell/thumb_image.vue'
import Actions from '@/components/template-v2/cell/Actions.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import NameFP from '@/components/facebook_fanpage/cell/NameFP.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return Actions
    case 'thumb':
      return ThumbImage
    case 'status':
      return Round

    case 'name':
      return NameFP
    case 'traffic_source':
      return TrafficSource
  }
  return
}
</script>

<template></template>
