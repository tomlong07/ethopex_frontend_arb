<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code2?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

const languageOptionsShow = computed<SelectOption[]>(() => {
  const isNotSelect = !crawlGoogleTemplateStore.crawlGGTemplate.language?.length

  if (isNotSelect) {
    return crawlGoogleTemplateStore.languageOptions
  }
  const isHasAll =
    crawlGoogleTemplateStore.crawlGGTemplate?.language?.includes('ALL')

  let options: SelectOption[] = []

  for (
    let index = 0;
    index < crawlGoogleTemplateStore.languageOptions.length;
    index++
  ) {
    const element = helper.clone(
      crawlGoogleTemplateStore.languageOptions[index]
    )
    if (isHasAll) {
      if (element.value === 'ALL') {
        options.push(element)
      } else {
        element.disabled = true
        options.push(element)
      }
    } else {
      if (element.value === 'ALL') {
        element.disabled = true

        options.push(element)
      } else {
        options.push(element)
      }
    }
  }

  return options
})

onMounted(() => {
  crawlGoogleTemplateStore.fetchLanguages()
})
const name = `Languages`
</script>

<template>
  <FloatingWrapper :name="name" required>
    <n-select
      v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.language"
      filterable
      multiple
      value-field="value"
      label-field="name"
      :loading="crawlGoogleTemplateStore.loadingLanguages"
      placeholder=""
      :options="languageOptionsShow"
      :clearable="true"
      :filter="filterHandle"
    />
  </FloatingWrapper>
</template>
