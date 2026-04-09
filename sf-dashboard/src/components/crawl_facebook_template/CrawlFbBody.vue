<script setup lang="ts">
import { TS } from '@/enum/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import modalCrawlCamp from '@/store/modalCrawlCamp'
import CrawlFBAudienceType from './CrawlFBAudienceType.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const storeModalCrawl = modalCrawlCamp()

watch(
  () => crawlFacebookTemplateStore.crawlFBTemplate.IsFlexible(),
  (newVal) => {
    if (newVal) {
      crawlFacebookTemplateStore.crawlFBTemplate.ad_campaign = null
    } else {
      crawlFacebookTemplateStore.crawlFBTemplate.ad_campaign = 1
    }
  }
)
const isAnt = window.arb.isAnt()
</script>
<template>
  <div class="flex flex-col gap-4">
    <n-card title="Setup" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlName
        v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.name"
      />

      <div
        class="flex gap-4"
        :class="[
          storeModalCrawl.isInsideDrawer
            ? 'flex-col items-start'
            : 'flex-row items-center',
        ]"
      >
        <CrawlSwitch
          v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.status"
        />
        <n-divider vertical v-if="!storeModalCrawl.isInsideDrawer" />
        <CrawlSwitch
          name="Campaign Budget"
          v-model:value="
            crawlFacebookTemplateStore.crawlFBTemplate.advantage_campaign_budget
          "
        />
        <n-divider vertical v-if="!storeModalCrawl.isInsideDrawer" />
        <CrawlSwitch
          name="Extension"
          v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.extension"
        />
      </div>

      <CrawlFBLabel />
      <Tags v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.tags" />
    </n-card>

    <n-card title="Settings" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlFBAdType
        v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.ad_type"
      />

      <CrawlFBAdCampaign
        v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.ad_campaign"
        v-if="
          !crawlFacebookTemplateStore.crawlFBTemplate.IsFlexible() &&
          !!crawlFacebookTemplateStore.crawlFBTemplate.ad_type
        "
      />
      <CrawlFBCampaignBidStrategy />
      <CrawlFBBudget />
    </n-card>

    <n-card title="Conversion" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlFBPerformanceGoal />

      <CrawlFBConversionEvent />

      <CrawlFBCostPerResultGoal />
      <CrawlFBBidStrategy />

      <AttributionSettings
        v-model:click_through="
          crawlFacebookTemplateStore.crawlFBTemplate.click_through
        "
        v-model:engaged_view="
          crawlFacebookTemplateStore.crawlFBTemplate.engaged_view
        "
        v-model:view_through="
          crawlFacebookTemplateStore.crawlFBTemplate.view_through
        "
      />
    </n-card>

    <n-card
      title="Audience controls"
      class="card-flex-gap-4 rounded-lg"
      size="small"
    >
      <CrawlFBAudienceType
        v-model="crawlFacebookTemplateStore.crawlFBTemplate.audience_type"
      />
      <CrawlFBAge
        v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.age_groups"
      />
      <CrawlLocation
        v-model:value="
          crawlFacebookTemplateStore.crawlFBTemplate.location.value
        "
        :one="!isAnt"
        v-model:type="crawlFacebookTemplateStore.crawlFBTemplate.location.type"
        multiple
        :traffic_source="TS.FACEBOOK"
      />
      <CrawlFBLanguage />
      <CrawlFBLandingLanguage />
    </n-card>
    <n-card title="Placements" class="card-flex-gap-4 rounded-lg" size="small">
      <CrawlFBPlacement />
    </n-card>
  </div>
</template>
