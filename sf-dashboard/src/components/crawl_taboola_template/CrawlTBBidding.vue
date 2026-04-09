<script setup lang="ts">
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import { SelectOption } from 'naive-ui'
const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()

import { BiddingBidControl, BiddingMaxConversion } from '@/options/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const biddingOptions = computed<SelectOption[]>(() => {
  switch (true) {
    case crawlTaboolaTemplateStore.crawlDataTemplate?.IsBidControl():
      return BiddingBidControl

    case crawlTaboolaTemplateStore.crawlDataTemplate?.IsMaxConversion():
      return BiddingMaxConversion

    default:
      return []
  }
})

//Auto xóa bỏ cpc
watch(
  () => crawlTaboolaTemplateStore.crawlDataTemplate.bidding,
  async (newValue, oldValue) => {
    crawlTaboolaTemplateStore.crawlDataTemplate.cpc = null
  }
)

const name = 'Bidding'
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-input-group>
      <n-select
        v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.bidding"
        class="w-2/5"
        :placeholder="''"
        :options="biddingOptions"
      />
      <n-input-number
        v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.cpc"
        :disabled="
          crawlTaboolaTemplateStore.crawlDataTemplate.bidding ===
          'MAX_CONVERSIONS'
        "
        class="w-3/5"
        min="0"
        max="10000"
        placeholder="Enter CPC"
      >
        <template #prefix><span>$</span></template>
      </n-input-number>
    </n-input-group>
  </FloatingWrapper>
</template>
