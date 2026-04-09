<script setup lang="ts">
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="crawlFacebookTemplateStore.isSubmitBtnLoading"
      @click="crawlFacebookTemplateStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
