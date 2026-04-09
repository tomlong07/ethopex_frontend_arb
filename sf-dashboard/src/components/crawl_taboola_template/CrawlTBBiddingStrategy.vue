<script setup lang="ts">
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { biddingStrategyOptionsCrawl } from '@/options/campaign'
const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()

const name = `Bidding Strategy`

const onChangeBiddingStrategy = (value: string) => {
  if (value !== '') {
    crawlTaboolaTemplateStore.crawlDataTemplate.bidding = null
    crawlTaboolaTemplateStore.crawlDataTemplate.cpc = null
  }
}
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      v-model:value="
        crawlTaboolaTemplateStore.crawlDataTemplate.bidding_strategy
      "
      :options="biddingStrategyOptionsCrawl"
      :placeholder="''"
      @update:value="onChangeBiddingStrategy"
    />
  </FloatingWrapper>
</template>
