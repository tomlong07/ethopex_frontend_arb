<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Actions from '@/components/template-v2/cell/Actions.vue'
import CellCategorySiteType from '@/components/category_site/cell/CellCategorySiteType.vue'
import BuildDescription from '@/components/category_site/cell/BuildDescription.vue'
import LandingImage from '@/components/landing_page/cell/LandingImage.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return Actions
    case 'description':
      return BuildDescription
    case 'icon':
    case 'thumb':
      return LandingImage

    case 'type':
      return CellCategorySiteType
  }
  return
}
</script>

<template></template>
