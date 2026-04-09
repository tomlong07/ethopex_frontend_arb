<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { campaignTypeOptions } from '@/options/campaign'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = `Campaign Type`
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.campaign_type"
      placeholder=""
      :options="campaignTypeOptions"
    />
  </FloatingWrapper>
</template>
