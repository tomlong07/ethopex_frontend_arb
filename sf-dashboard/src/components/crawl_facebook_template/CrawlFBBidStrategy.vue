<script setup lang="ts">
import { BIDSTRATEGY } from '@/enum/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'

import { SelectOption } from 'naive-ui'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

const BidStrategyOptions = computed<SelectOption[]>(() => {
  return [
    {
      value: BIDSTRATEGY.COST_PER_RESULT_GOAL,
      label: 'Cost per result goal',
      bonus: 'Best for getting the most volume',
    },
    {
      value: BIDSTRATEGY.BID_CAP,
      label: 'Bid cap',
      bonus: 'Best for controlling bids in the auction',
      disabled: true, //Vì hiện tại crawl luôn luôn thỏa mãn 3 điều kiện của advantage+
      //campaign crawl luôn 1 adgroup
      //Luôn là audience advantage
      //Luôn là placement advantage
    },
  ]
})

const nameBid = `Bid strategy`
</script>
<template>
  <div
    class="flex flex-col gap-2"
    v-if="
      crawlFacebookTemplateStore.isOffCampaignBudget &&
      crawlFacebookTemplateStore.isMaxNumberOfConv &&
      crawlFacebookTemplateStore.crawlFBTemplate.cost_per_result
    "
  >
    <div class="text-xs text-gray-500 font-semibold">{{ nameBid }}</div>
    <div class="flex-1 min-w-0">
      <div>
        <n-radio-group
          v-model:value="
            crawlFacebookTemplateStore.crawlFBTemplate.bid_strategy
          "
          class="flex gap-8"
        >
          <n-flex vertical v-for="bid in BidStrategyOptions" :key="bid.value">
            <n-radio
              :value="bid.value"
              :label="(bid.label as string)"
              :disabled="bid.disabled"
            />
            <span class="text-xs text-gray-500">{{ bid.bonus }}</span>
          </n-flex>
        </n-radio-group>
      </div>
    </div>
  </div>
</template>
