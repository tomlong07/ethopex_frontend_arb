<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { SelectOption } from 'naive-ui'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import { ref, computed, onMounted } from 'vue'
import { transformOptions } from '@/components/campaign/help/select'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const isLoadingLanguage = ref(false)
const name = 'Language'
const languageOptionsRaw = ref<SelectOption[]>([])

const fetchLanguageByTraffic = async () => {
  isLoadingLanguage.value = true
  const result = await ctr_traffic_source.GetLanguage(TS.FACEBOOK)
  languageOptionsRaw.value = result?.data?.languages || []
  isLoadingLanguage.value = false
}

const languageOptions = computed<SelectOption[]>(() => {
  let options: SelectOption[] = []

  const selected = crawlFacebookTemplateStore.crawlFBTemplate.language || []
  const isNotSelect = selected.length === 0

  if (isNotSelect) {
    return languageOptionsRaw.value
  }

  const isHasAll = selected.includes('ALL')

  options = transformOptions(languageOptionsRaw, isHasAll)

  return options
})

onMounted(() => {
  fetchLanguageByTraffic()
})
</script>
<template>
  <FloatingWrapper :name="name" class="name-affect-comp" required>
    <n-select
      v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.language"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      :loading="isLoadingLanguage"
      placeholder=""
      :options="languageOptions"
    />
  </FloatingWrapper>
</template>
