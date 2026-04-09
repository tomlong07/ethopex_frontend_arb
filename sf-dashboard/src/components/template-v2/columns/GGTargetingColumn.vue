<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import GoogleTargetingDomain from '@/components/google_targeting/cell/GoogleTargetingDomain.vue'
import WhiteList from '@/components/google_targeting/cell/WhiteList.vue'
import Round from '@/components/template-v2/cell/Round.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'domain':
    case 'network':
      return GoogleTargetingDomain
    case 'type':
      return WhiteList
    case 'status':
      return Round
  }
  return
}
</script>

<template></template>
