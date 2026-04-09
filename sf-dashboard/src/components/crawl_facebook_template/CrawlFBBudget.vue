<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { budgetTypeOptions } from '@/options/campaign'
const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
</script>
<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper name="Budget" required>
      <n-select
        v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.bidding"
        :options="budgetTypeOptions"
      />
    </FloatingWrapper>

    <FloatingWrapper>
      <n-input-number
        v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.budget"
        max="50000"
        min="0"
        placeholder="Budget"
      >
        <template #prefix> $ </template>
      </n-input-number>
    </FloatingWrapper>
  </div>
</template>
