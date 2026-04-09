<script setup lang="ts">
import demainStore from '@/store/details/useDemainStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = demainStore()
const id = Number(window.route.params.id || 0)
const isAddMode = computed<boolean>(() => id === 0)
</script>
<template>
  <FloatingWrapper name="Name" rounded>
    <n-input
      v-model:value="dataConfig.demandConfig.name"
      :loading="dataConfig.isLoading"
      :disabled="dataConfig.isLoading || !isAddMode || dataConfig.isDisable"
      placeholder="Original name of demand source"
      class="mb-2"
  /></FloatingWrapper>
</template>
