<script setup lang="ts">
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="crawlTaboolaTemplateStore.isSubmitBtnLoading"
      @click="crawlTaboolaTemplateStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
