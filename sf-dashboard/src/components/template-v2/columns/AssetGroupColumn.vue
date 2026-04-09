<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import AdGroupDetail from '@/components/asset_group/cell/AdGroupDetail.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import ActionsAssetGroup from '@/components/asset_group/cell/ActionsAssetGroup.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return ActionsAssetGroup
    case 'status':
      return Round
    case 'ad_accounts':
      return AdGroupDetail
  }
  return
}
</script>

<template></template>
