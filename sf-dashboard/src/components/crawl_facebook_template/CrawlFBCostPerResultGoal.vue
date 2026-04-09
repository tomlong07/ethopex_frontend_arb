<script setup lang="ts">
import { BIDSTRATEGY } from '@/enum/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import { adGroups } from '@/types/components/campaign-v2'
import { GroupIs } from '@/types/components/campaign-v2'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

onMounted(() => {
  crawlFacebookTemplateStore.fetchConversionEvents()
})

const name = computed<string>(() => {
  const template = crawlFacebookTemplateStore.crawlFBTemplate as adGroups

  if (GroupIs.PerformanceGoalNumber(template)) {
    return `Cost per result goal`
  }

  if (GroupIs.PerformanceGoalValue(template)) {
    return `Target ROAS`
  }

  return 'Cost per result goal'
})

const changeBidStrategy = (value: any) => {
  crawlFacebookTemplateStore.crawlFBTemplate.cost_per_result = value

  bidStrageryAutoChange()
}

const bidStrageryAutoChange = () => {
  if (
    GroupIs.PerformanceGoalValue(
      crawlFacebookTemplateStore.crawlFBTemplate as adGroups
    )
  ) {
    BidStrategyValueChange()
  }

  if (
    GroupIs.PerformanceGoalNumber(
      crawlFacebookTemplateStore.crawlFBTemplate as adGroups
    )
  ) {
    BidStrategyOffSiteChange()
  }
}

const BidStrategyValueChange = () => {
  if (crawlFacebookTemplateStore.crawlFBTemplate.cost_per_result) {
    crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy =
      BIDSTRATEGY.ROAS_GOAL
  } else {
    crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy =
      BIDSTRATEGY.HIGHEST_VOLUME
  }
}

const BidStrategyOffSiteChange = () => {
  if (crawlFacebookTemplateStore.crawlFBTemplate.cost_per_result) {
    crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy =
      BIDSTRATEGY.COST_PER_RESULT_GOAL
  } else {
    crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy =
      BIDSTRATEGY.HIGHEST_VOLUME
  }
}
</script>

<template>
  <FloatingWrapper :name="name">
    <n-input-number
      class="w-full"
      size="medium"
      v-model:value="
        crawlFacebookTemplateStore.crawlFBTemplate.cost_per_result
      "
      max="1000"
      min="0"
      :precision="GroupIs.PerformanceGoalValue(crawlFacebookTemplateStore.crawlFBTemplate as adGroups) ? 3 : 2"
      :placeholder="GroupIs.PerformanceGoalValue(crawlFacebookTemplateStore.crawlFBTemplate as adGroups) ? 'X.XXX' : 'X.XX'"
      :loading="crawlFacebookTemplateStore.loadingConversionEvents"
      :on-update:value="changeBidStrategy"
    >
      <template
        #prefix
        v-if="!GroupIs.PerformanceGoalValue(crawlFacebookTemplateStore.crawlFBTemplate as adGroups)"
      >
        $
      </template>
    </n-input-number>
  </FloatingWrapper>
</template>
