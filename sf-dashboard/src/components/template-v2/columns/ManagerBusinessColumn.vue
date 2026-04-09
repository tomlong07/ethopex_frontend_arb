<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import BusinessName from '@/components/manager_facebook_business/cell/BusinessName.vue'
import ManageFBLabels from '@/components/manager_facebook_business/cell/ManageFBLabels.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return BusinessName
    case 'labels':
      return ManageFBLabels
  }
  return
}
</script>

<template></template>
