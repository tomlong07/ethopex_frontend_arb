<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = `Target CPA`

const changeCPC = (value: boolean) => {
  crawlGoogleTemplateStore.crawlGGTemplate.bidding_status = value

  if (!value) {
    crawlGoogleTemplateStore.crawlGGTemplate.cpc = null
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="font-semibold text-xs text-gray-500">{{ name }}</div>
    <div class="flex-1 min-w-0 flex gap-2 items-center">
      <n-checkbox
        v-model:checked="
          crawlGoogleTemplateStore.crawlGGTemplate.bidding_status
        "
        class="w-32"
        :on-update:checked="changeCPC"
      >
        Set Target
      </n-checkbox>
      <FloatingWrapper>
        <n-input-number
          class="flex-1 min-w-0"
          v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.cpc"
          :max="10000"
          :min="0"
          :disabled="!crawlGoogleTemplateStore.crawlGGTemplate.bidding_status"
          :placeholder="name"
        >
          <template #prefix> $ </template>
        </n-input-number>
      </FloatingWrapper>
    </div>
  </div>
</template>
