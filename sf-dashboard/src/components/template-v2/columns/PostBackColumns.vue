<script setup lang="ts">
import PostBackAction from '@/components/post_back_detail/cell/PostBackAction.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return PostBackAction
  }
  return
}
</script>
<template></template>
