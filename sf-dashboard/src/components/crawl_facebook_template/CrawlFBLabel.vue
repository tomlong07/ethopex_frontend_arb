<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ctr_label } from '@/services/ctr_label'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

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
      v-model:value="crawlFacebookTemplateStore.crawlFBTemplate.label"
      filterable
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :placeholder="''"
      :options="labelOptions"
    />
  </FloatingWrapper>
</template>
