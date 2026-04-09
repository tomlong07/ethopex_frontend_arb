<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import TypeRole from '@/components/role/cell/TypeRole.vue'
import ActionRole from '@/components/role/cell/ActionRole.vue'
import CreateBy from '@/components/role/cell/CreateBy.vue'
import CellRoleAccountDemand from '@/components/role/cell/CellRoleAccountDemand.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return ActionRole
    case 'account_demand':
      return CellRoleAccountDemand
    case 'type':
      return TypeRole
    case 'create_by.email':
      return CreateBy
  }
  return
}
</script>

<template></template>
