<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import QuickLogin from '@/components/user/cell/QuickLogin.vue'
import DomainU24 from '@/components/user/cell/DomainU24.vue'
import LabelUser from '@/components/user/cell/LabelUser.vue'
import CustomFunds from '@/components/user/cell/CustomFunds.vue'
import UserStatus from '@/components/user/cell/UserStatus.vue'
import ShowName from '@/components/user/cell/ShowName.vue'
import BasedInvoice from '@/components/user/cell/BasedInvoice.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'email':
      return QuickLogin
    case 'funds':
      return CustomFunds
    case 'label':
      return LabelUser
    case 'domain':
      return DomainU24
    case 'status':
      return UserStatus
    case 'show_name':
      return ShowName
    case 'based_invoice':
      return BasedInvoice
  }
  return
}
</script>

<template></template>
