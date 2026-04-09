<script setup lang="ts">
import { ctr_label } from '@/services/ctr_label'
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()

const name = `Label`
const isLoading = ref<boolean>(false)
const labelOptions = ref<SelectOption[]>()

const fetchLabel = async () => {
  isLoading.value = true

  const labelResult = await ctr_label.GetAll()

  labelOptions.value = labelResult?.data || []

  isLoading.value = false
}

onMounted(() => {
  fetchLabel()
})
</script>

<template>
  <FloatingWrapper :name="name">
    <n-select
      v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.label"
      filterable
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :placeholder="''"
      :options="labelOptions"
    />
  </FloatingWrapper>
</template>
