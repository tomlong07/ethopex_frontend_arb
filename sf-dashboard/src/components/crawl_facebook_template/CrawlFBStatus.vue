<script setup lang="ts">
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import BaseSwitch from '@/components/common/BaseSwitch.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

const name = `Status`
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-48 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <BaseSwitch v-model="crawlFacebookTemplateStore.crawlFBTemplate.status" />
    </div>
  </div>
</template>
