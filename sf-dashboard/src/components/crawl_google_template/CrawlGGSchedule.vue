<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()
import Schedule from '@/components/campaign/modules/google/Schedule.vue'
</script>

<template>
  <Schedule :data="crawlGoogleTemplateStore.crawlGGTemplate" crawl />
</template>
