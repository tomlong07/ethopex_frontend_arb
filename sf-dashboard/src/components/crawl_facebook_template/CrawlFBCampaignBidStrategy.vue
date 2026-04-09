<script setup lang="ts">
import { BIDSTRATEGY } from '@/enum/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { originalBidStrategyOptions } from '@/options/campaign'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

const isShow = computed(() => {
  return crawlFacebookTemplateStore.isOnCampaignBudget
})

watch(
  () => isShow.value,
  (newValue) => {
    crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy =
      BIDSTRATEGY.HIGHEST_VOLUME
  }
)

const nameBid = `Campaign bid strategy`
</script>
<template>
  <FloatingWrapper :name="nameBid" v-if="isShow" required>
    <n-select
      size="medium"
      v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy"
      :options="originalBidStrategyOptions"
      :placeholder="''"
      clearable
    />
  </FloatingWrapper>
</template>
