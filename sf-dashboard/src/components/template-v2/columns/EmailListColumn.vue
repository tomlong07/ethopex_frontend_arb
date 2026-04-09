<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import ObjectIDName from '@/components/ObjectIDName.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'arb_campaign_id':
    case 'landing_id':
      return ObjectIDName
  }
  return
}
</script>

<template></template>
