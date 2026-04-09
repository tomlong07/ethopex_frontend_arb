<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import LanguageSelector from '@/components/common/LanguageSelector.vue'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()
const name = `Landing Language`
</script>

<template>
  <div class="flex items-center gap-2">
    <LanguageSelector
      v-model="crawlGoogleTemplateStore.crawlGGTemplate.landing_language"
      :label="name"
      width="w-48"
    />
  </div>
</template>
