<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Round from '@/components/template-v2/cell/Round.vue'
import TemplateV2CellAccountID from '@/components/manager_account/cell/TemplateV2CellAccountID.vue'
import TemplateV2CellAccountNameAd from '@/components/manager_account/cell/TemplateV2CellAccountNameAd.vue'
import TemplateV2CellAdvertiserName from '@/components/manager_account/cell/TemplateV2CellAdvertiserName.vue'
import TemplateV2CellCategoriesAccountAd from '@/components/manager_account/cell/TemplateV2CellCategoriesAccountAd.vue'
import TemplateV2CellLabelsAccountAd from '@/components/manager_account/cell/TemplateV2CellLabelsAccountAd.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'id':
      return TemplateV2CellAccountID
    case 'name':
      return TemplateV2CellAccountNameAd
    case 'advertiser_id':
    case 'advertiser_name':
      return TemplateV2CellAdvertiserName
    case 'status':
      return Round
    case 'labels':
      return TemplateV2CellLabelsAccountAd
    case 'categories':
      return TemplateV2CellCategoriesAccountAd
  }
  return
}
</script>

<template></template>
