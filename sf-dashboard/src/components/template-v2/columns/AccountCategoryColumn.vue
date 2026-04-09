<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import AccountCategoryEdit from '@/components/account_category/cell/AccountCategoryEdit.vue'
import PixelId from '@/components/account_category/cell/PixelId.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return AccountCategoryEdit
    case 'pixel_id':
      return PixelId
    case 'traffic_source':
      return TrafficSource
  }
  return
}
</script>

<template></template>
