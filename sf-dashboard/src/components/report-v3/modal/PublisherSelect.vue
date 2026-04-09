<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useReportRule from '@/store/report/report-rule'

const reportRule = useReportRule()

const modelValue = defineModel<number[] | null>('modelValue')
let searchTimeout: any = null

const handleSearch = (query: string) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    reportRule.fetchPublisher(query, modelValue.value)
  }, 500)
}
</script>

<template>
  <FloatingWrapper name="Publisher">
    <n-select
      v-model:value="modelValue"
      filterable
      clearable
      remote
      multiple
      :options="reportRule.publisherOptions"
      :loading="reportRule.isLoadingPublisher"
      :consistent-menu-width="false"
      placeholder=""
      size="small"
      max-tag-count="responsive"
      class="w-[180px]"
      @search="handleSearch"
    />
  </FloatingWrapper>
</template>