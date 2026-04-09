<script setup lang="ts">
import { prelanderConfigs } from '@/types/components/landing'
const JobContent = defineAsyncComponent(() => import('./JobContent.vue'))
const AdConfigMain = defineAsyncComponent(
  () => import('./ad_config/AdConfigMain.vue')
)
const activeTab = ref('ad_config')
const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})
</script>
<template>
  <n-tabs v-model:value="activeTab" size="small" animated>
    <n-tab-pane name="ad_config" tab="Ad Config" />
    <n-tab-pane
      name="content"
      tab="Content"
      v-if="!props.prelander_configs.IsLayout100()"
    />
  </n-tabs>

  <div v-show="activeTab === 'ad_config'">
    <AdConfigMain :prelander_configs="props.prelander_configs" />
  </div>
  <div
    v-show="activeTab === 'content'"
    v-if="!props.prelander_configs.IsLayout100()"
  >
    <JobContent :prelander_configs="props.prelander_configs" />
  </div>
</template>
