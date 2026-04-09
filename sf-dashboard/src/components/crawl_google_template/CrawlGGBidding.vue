<script setup lang="ts">
import { BiddingOptionsGoogle } from '@/options/campaign'
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = `Bidding`

const biddingOptions = BiddingOptionsGoogle.filter(
  (option) => option.value !== 'targetSpend'
)
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.bidding"
      placeholder=""
      :options="biddingOptions"
    />
  </FloatingWrapper>
</template>
