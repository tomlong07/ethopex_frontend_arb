<script setup lang="ts">
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import LanguageSelector from '@/components/common/LanguageSelector.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const name = `Landing Language`
</script>

<template>
  <div class="flex items-center gap-2">
    <LanguageSelector
      v-model="crawlFacebookTemplateStore.crawlFBTemplate.landing_language"
      :label="name"
      width="w-48"
    />
  </div>
</template>
