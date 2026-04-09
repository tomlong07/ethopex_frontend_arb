<script lang="ts" setup>
import { useTemplateV2 } from '@/store/templateV2Store'

const ResetAllDomain = defineAsyncComponent(
  () => import('@/components/domain_manager/ResetAllDomain.vue')
)

const ClearPreview = defineAsyncComponent(
  () => import('@/components/rule/ClearPreview.vue')
)

const templateV2Store = useTemplateV2(helper.truePath())()
</script>

<template>
  <ResetAllDomain v-if="templateV2Store.asyncConfigs.resetAllDomain" />
  <ClearPreview v-if="templateV2Store.asyncConfigs.clearPreview" />
</template>
