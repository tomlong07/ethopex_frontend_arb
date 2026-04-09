<script setup lang="ts">
import { TS } from '@/enum/campaign'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()
const languageOptions = ref<SelectOption[]>([])
const name = 'Landing Language'

const handleLanguageChange = (value: string | null) => {
  crawlTaboolaTemplateStore.crawlDataTemplate.landing_language = value
  const isAllSelected = value === 'ALL'
  languageOptions.value = languageOptions.value.map((opt) => ({
    ...opt,
    disabled: isAllSelected && opt.value !== 'ALL',
  }))
}

onMounted(async () => {
  const result = await ctr_traffic_source.GetLanguage(TS.GOOGLE)

  languageOptions.value =
    result?.data?.languages
      ?.filter((item: any) => item.value !== 'ALL')
      ?.map((item: any) => ({
        label: item.name,
        value: item.value,
      })) || []
})
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      v-model:value="
        crawlTaboolaTemplateStore.crawlDataTemplate.landing_language
      "
      :options="languageOptions"
      :placeholder="''"
      @update:value="handleLanguageChange"
      clearable
      filterable
    />
  </FloatingWrapper>
</template>
