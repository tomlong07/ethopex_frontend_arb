<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import ByUser from '@/components/creative3/cell/ByUser.vue'
import CreativeCreatedTime from '@/components/creative3/cell/CreativeCreatedTime.vue'
import Round from '../cell/Round.vue'
import CreativeAdType from '@/components/creative3/cell/CreativeAdType.vue'
import Creative3CellCreativeType from '@/components/creative3/cell/Creative3CellCreativeType.vue'
import GroupButtonCreative from '@/components/creative3/cell/GroupButtonCreative.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return ByUser

    case 'type':
      return Creative3CellCreativeType

    case 'ad_type':
      return CreativeAdType

    case 'status':
      return Round
    case 'actions':
      return GroupButtonCreative
    case 'creative_time':
      return CreativeCreatedTime
  }
  return
}
</script>

<template></template>
