<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import RunOnNetwork from '@/components/layout/cell/RunOnNetwork.vue'
import LayoutType from '@/components/layout/cell/LayoutType.vue'
import LayoutActions from '@/components/layout/cell/LayoutActions.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return LayoutActions

    case 'type':
      return LayoutType
    case 'run_on_network':
      return RunOnNetwork
  }
  return
}
</script>

<template></template>
