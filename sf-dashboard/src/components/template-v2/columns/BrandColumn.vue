<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import BrandActionEdit from '@/components/brand/cell/BrandActionEdit.vue'
import BrandLogo from '@/components/brand/cell/BrandLogo.vue'
import BrandPage from '@/components/brand/cell/BrandPage.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return BrandActionEdit
    case 'logo':
      return BrandLogo
    case 'homepage':
    case 'contact_page':
      return BrandPage
  }
  return
}
</script>
<template></template>
