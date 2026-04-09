<script setup lang="ts">
import demainStore from '@/store/details/useDemainStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = demainStore()
</script>
<template>
  <FloatingWrapper name="Show Name" rounded>
    <n-input
      v-model:value="dataConfig.demandConfig.show_name"
      placeholder="Name of demand source"
      class="mb-2"
      :loading="dataConfig.isLoading"
      :disabled="dataConfig.isLoading || dataConfig.isDisable"
    />
  </FloatingWrapper>
</template>
