<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import CreativeCreatedTime from '@/components/creative3/cell/CreativeCreatedTime.vue'
import CreativeImage from '@/components/creative3/cell/CreativeImage.vue'

import CreativeAdType from '@/components/creative3/cell/CreativeAdType.vue'
import Creative3CellCreativeType from '@/components/creative3/cell/Creative3CellCreativeType.vue'
import CreativeImageButton from '@/components/creative3/cell/CreativeImageButton.vue'
const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'image':
      return CreativeImage
    case 'type':
      return Creative3CellCreativeType
    case 'ad_type':
      return CreativeAdType
    case 'actions':
      return CreativeImageButton
    case 'creative_time':
      return CreativeCreatedTime
  }
  return
}
</script>

<template></template>
