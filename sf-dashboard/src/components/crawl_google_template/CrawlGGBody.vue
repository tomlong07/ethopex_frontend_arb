<script setup lang="ts">
import { TS } from '@/enum/campaign'
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const isShowPurchase = window.arb.isAdmin() || window.arb.isDev()
</script>
<template>
  <div class="flex flex-col gap-4">
    <n-card title="Setup" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlName
        v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.name"
      />

      <div class="flex gap-4 items-center">
        <CrawlSwitch
          v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.status"
        />
        <n-divider vertical />

        <CrawlSwitch
          name="Set Ad Fixed"
          v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.set_fixed"
          disabled
        />
      </div>
      <CrawlGGLabel />

      <Tags v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.tags" />

      <CrawlGGPurchaseValue v-if="isShowPurchase" />
    </n-card>

    <n-card title="Settings" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlGGCampaignType />
      <CrawlGGBidding />
      <CrawlGGTargetCPA />
      <CrawlGGBudget />
      <CrawlGGBaseStringList
        v-model="crawlGoogleTemplateStore.crawlGGTemplate.search_themes"
        name="Search Themes"
        :ai-text="'{AI_Search_Themes}'"
      />
      <CrawlGGSchedule />
    </n-card>
    <n-card title="Conversion" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlGGConversionGoal />
    </n-card>

    <n-card
      title="Audience controls"
      class="card-flex-gap-4 rounded-lg"
      size="small"
    >
      <CrawlGGAIAudience />

      <CrawlLocation
        v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.location.value"
        multiple
        :traffic_source="TS.GOOGLE"
      />
      <CrawlGGLanguage />
      <CrawlGGLandingLanguage />
    </n-card>
  </div>
</template>
