<template>
  <FloatingWrapper name="Name">
    <n-input
      v-model:value="kwsetStore.dataConfig.name"
      :loading="kwsetStore.isLoading"
      :disabled="kwsetStore.isLoading || kwsetStore.isDisable"
      :placeholder="`Name of ${name}`"
      class="mb-2"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const kwsetStore = useKeywordSetStore()
const name = `keyword set`
</script>
