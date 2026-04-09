<template>
  <n-tabs v-model:value="domainConfig.activeTab" type="line" animated class="ml-1">
    <n-tab-pane name="form" tab="Domain Config"> </n-tab-pane>
    <n-tab-pane name="logs" tab="Show Logs"> </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import useDomainConfigStore from '@/store/details/useDomainConfigStore'

const domainConfig = useDomainConfigStore()
</script>
