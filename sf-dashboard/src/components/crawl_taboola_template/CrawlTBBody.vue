<script setup lang="ts">
import { TS } from '@/enum/campaign'
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'

const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()
</script>
<template>
  <div class="flex flex-col gap-4">
    <n-card title="Setup" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlName
        v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.name"
      />
      <CrawlSwitch
        v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.status"
      />

      <CrawlTBLabel />
      <Tags v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.tags" />
    </n-card>

    <n-card title="Settings" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlTBBiddingStrategy />
      <CrawlTBBidding />
      <CrawlTBBudget />
    </n-card>

    <n-card
      title="Audience controls"
      class="card-flex-gap-4 rounded-lg"
      size="small"
    >
      <CrawlTBLandingLanguage />
      <CrawlTBDevice />
      <CrawlLocation
        v-model:value="
          crawlTaboolaTemplateStore.crawlDataTemplate.location.value
        "
        v-model:type="crawlTaboolaTemplateStore.crawlDataTemplate.location.type"
        include
        multiple
        :traffic_source="TS.TABOOLA"
      />
    </n-card>
  </div>
</template>
