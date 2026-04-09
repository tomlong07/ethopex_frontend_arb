<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import CustomSwitch from '../common/CustomSwitch.vue'
const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const name = `AI Audience`

const updateAIAudience = (val: any) => {
  crawlGoogleTemplateStore.crawlGGTemplate.ai_audience = val

  if (crawlGoogleTemplateStore.crawlGGTemplate.ai_audience) {
    crawlGoogleTemplateStore.crawlGGTemplate.audiences = ['{AI_Audiences}']
  } else {
    crawlGoogleTemplateStore.crawlGGTemplate.audiences = []
  }
}
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="text-xs font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="crawlGoogleTemplateStore.crawlGGTemplate.ai_audience"
        type="boolean"
        true-label="On"
        false-label="Off"
        size="small"
        @update:modelValue="updateAIAudience"
      />
    </div>
  </div>
</template>
