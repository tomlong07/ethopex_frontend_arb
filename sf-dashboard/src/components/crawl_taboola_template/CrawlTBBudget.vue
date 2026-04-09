<script setup lang="ts">
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()
</script>

<template>
  <FloatingWrapper :name="'Budget'" required>
    <n-input-number
      v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.budget"
      :precision="2"
      min="0"
      max="1000000"
      placeholder="Enter budget"
    >
      <template #prefix> $ </template>
    </n-input-number>
  </FloatingWrapper>
</template>
