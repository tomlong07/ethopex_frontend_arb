<script setup lang="ts">
import Agreement from '@/components/prompt_log/Agreement.vue'
import AIComponent from '@/components/prompt_log/AIComponent.vue'
import HumanComponent from '@/components/prompt_log/HumanComponent.vue'
import Models from '@/components/prompt_log/Models.vue'
import Reviewed from '@/components/prompt_log/Reviewed.vue'
import CreatedAt from '@/components/prompt_log/CreatedAt.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import ReviewedAt from '@/components/prompt_log/ReviewedAt.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'ai':
      return AIComponent

    case 'human':
      return HumanComponent

    case 'human_reviewed':
      return Reviewed

    case 'agreement':
      return Agreement
    case 'model':
      return Models
    case 'created_at':
      return CreatedAt
    case 'reviewed_at':
      return ReviewedAt
  }
  return
}
</script>

<template></template>
