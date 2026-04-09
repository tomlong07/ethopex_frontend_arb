<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import { ctr_label } from '@/services/ctr_label'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const labelOptions = ref<SelectOption[]>([])

const fetchLabel = async () => {
  isLoading.value = true

  const labelResult = await ctr_label.GetAll()

  labelOptions.value = labelResult?.data || []

  isLoading.value = false
}

const isLoading = ref<boolean>(false)

onMounted(() => {
  fetchLabel()
})

const name = 'Label'
</script>

<template>
  <FloatingWrapper :name="name">
    <n-select
      v-model:value="crawlGoogleTemplateStore.crawlGGTemplate.label"
      filterable
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :placeholder="''"
      :options="labelOptions"
    />
  </FloatingWrapper>
</template>
