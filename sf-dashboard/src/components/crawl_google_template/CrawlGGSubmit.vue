<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
const crawlGoogleTemplateStore = useCrawlGoogleTemplate()
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="crawlGoogleTemplateStore.isSubmitBtnLoading"
      @click="crawlGoogleTemplateStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
