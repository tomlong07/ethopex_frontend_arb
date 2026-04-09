<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import WhiteList from '@/components/google_targeting/cell/WhiteList.vue'
import GoogleTargetingDomain from '@/components/google_targeting/cell/GoogleTargetingDomain.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'placement':
      return GoogleTargetingDomain
    case 'status':
      return WhiteList
  }
  return
}
</script>

<template></template>
