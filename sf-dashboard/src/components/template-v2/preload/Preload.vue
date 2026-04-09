<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import IntervalPreload from './IntervalPreload.vue'

const LayoutPreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/LayoutPreload.vue')
)

const RolePreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/RolePreload.vue')
)

const CategoriesPreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/CategoriesPreload.vue')
)

const TrafficSourcesPreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/TrafficSourcesPreload.vue')
)

const DemandSourcesPreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/DemandSourcesPreload.vue')
)

const ProfilesPreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/ProfilesPreload.vue')
)

const RuleTypePreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/RuleTypePreload.vue')
)

const CreativeTypePreload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/CreativeTypePreload.vue')
)

const templateV2Store = useTemplateV2(helper.truePath())()
</script>

<template>
  <LayoutPreload v-if="templateV2Store.baseConfigs.PreloadLayout()" />
  <RolePreload v-if="templateV2Store.baseConfigs.PreloadRole()" />
  <CategoriesPreload v-if="templateV2Store.baseConfigs.PreloadCategory()" />
  <TrafficSourcesPreload
    v-if="templateV2Store.baseConfigs.PreloadTrafficSource()"
  />
  <DemandSourcesPreload
    v-if="templateV2Store.baseConfigs.PreloadDemandSource()"
  />
  <ProfilesPreload v-if="templateV2Store.baseConfigs.PreloadProfile()" />
  <RuleTypePreload v-if="templateV2Store.baseConfigs.PreloadRuleType()" />
  <CreativeTypePreload
    v-if="templateV2Store.baseConfigs.PreloadCreativeType()"
  />
  <IntervalPreload v-if="templateV2Store.baseConfigs.PreloadInterval()" />
</template>
