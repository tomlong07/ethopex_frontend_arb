<script setup lang="ts">
import { ConversionGoalsOptions } from '@/options/campaign'
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = `Conversion Goal`
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      filterable
      v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.conversion_goals"
      :placeholder="''"
      :options="ConversionGoalsOptions"
    />
  </FloatingWrapper>
</template>
