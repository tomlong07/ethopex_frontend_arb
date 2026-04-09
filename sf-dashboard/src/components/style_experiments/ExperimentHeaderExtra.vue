<script setup lang="ts">
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
const StyleExperimentStore = useStyleExperimentStore()
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <span class="custom-text-style-manager">
        Version {{ StyleExperimentStore.version }}
      </span></template
    >
    <span>Version of js code adsense style experiments</span>
  </n-popover>
</template>
