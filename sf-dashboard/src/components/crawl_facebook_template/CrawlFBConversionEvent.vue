<script setup lang="ts">
import { ConversionEventFacebookOptions } from '@/options/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const conversionEventOptions = ref<SelectOption[]>(
  ConversionEventFacebookOptions
)

const conversionEventShow = computed(() => {
  const typeObjective = crawlFacebookTemplateStore.typeObjective.type

  const isDisabled = typeObjective === 'OUTCOME_SALES'

  return conversionEventOptions.value.map((option) => ({
    ...option,
    disabled: isDisabled
      ? !['SEARCH', 'PURCHASE'].includes(option.value as string)
      : false,
  }))
})

const name = `Conversion event`
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      v-model:value="
        crawlFacebookTemplateStore.crawlFBTemplate.conversion_event
      "
      :placeholder="''"
      clearable
      filterable
      remote
      :options="conversionEventShow"
    />
  </FloatingWrapper>
</template>
