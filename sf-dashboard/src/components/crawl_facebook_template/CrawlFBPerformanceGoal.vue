<script setup lang="ts">
import { PerformanceGoalOptions } from '@/options/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

const name = `Performance goal`
</script>

<template>
  <FloatingWrapper :name="name">
    <n-select
      v-model:value="
        crawlFacebookTemplateStore.crawlFBTemplate.performance_goal
      "
      :placeholder="''"
      :options="PerformanceGoalOptions"
    />
  </FloatingWrapper>
</template>
