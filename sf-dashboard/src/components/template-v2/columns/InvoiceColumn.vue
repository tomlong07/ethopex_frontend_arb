<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import ActionPayment from '@/components/payment/cell/ActionPayment.vue'
import UserPay from '@/components/payment/cell/UserPay.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'user':
      return UserPay
    case 'note':
      return Tooltip
    case 'info':
      return ActionPayment
    case 'status':
      return Round
  }
  return
}
</script>

<template></template>
