<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = `Budget`
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-input-number
      v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.budget"
      :max="100000"
      :min="0"
      :placeholder="name"
    >
      <template #prefix> $ </template>
    </n-input-number>
  </FloatingWrapper>
</template>
