<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import LandingCategory from '@/components/landing_page/cell/LandingCategory.vue'
import LandingPagePreview from '@/components/landing_page/cell/LandingPagePreview.vue'
import TemplateV2CellDemandSource from '@/components/template-v2/cell/TemplateV2CellDemandSource.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import CellLandingName from '@/components/landing_page/cell/CellLandingName.vue'
import LandingAction from '@/components/landing_page/cell/LandingAction.vue'
import LandingStatus from '@/components/landing_page/cell/LandingStatus.vue'
const templateV2Store = useTemplateV2(helper.truePath())()
templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'demand':
      return TemplateV2CellDemandSource
    case 'name':
      return CellLandingName
    case 'actions':
      return LandingAction
    case 'category':
      return LandingCategory
    case 'status':
      return LandingStatus
    case 'landing_page':
      return LandingPagePreview
    case 'prelander':
      return Round
  }
  return
}
</script>

<template></template>
