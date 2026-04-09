<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useReportRule from '@/store/report/report-rule'

const reportRule = useReportRule()

const modelValue = defineModel<number | null>('modelValue')
const props = defineProps<{
  publisher: number[] | null
  trafficSource: string[] | null
}>()

let searchTimeout: any = null

const customFilter = (pattern: string, option: any) => {
  if (!pattern) return true
  const lower = pattern.toLowerCase()
  return (
    option.name?.toLowerCase().includes(lower) ||
    String(option.id).toLowerCase().includes(lower)
  )
}

const renderRuleLabel = (option: any) => {
  return h('div', { class: 'flex justify-between items-center w-full' }, [
    h('span', { class: 'truncate' }, `${option.id}: ${option.name}`),
    option.user_email
      ? h('span', { class: 'text-gray-400 text-xs ml-2' }, option.user_email)
      : null,
  ])
}

const handleSearch = (query: string) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    reportRule.fetchRules({
      publisher: props.publisher,
      traffic_source: props.trafficSource,
      search: query
    })
  }, 500)
}
</script>

<template>
  <FloatingWrapper name="Rule">
    <n-select
      v-model:value="modelValue"
      filterable
      clearable
      remote
      :options="reportRule.ruleOptions"
      :loading="reportRule.isLoadingRules"
      value-field="id"
      placeholder=""
      size="small"
      :consistent-menu-width="false"
      :filter="customFilter"
      :render-label="renderRuleLabel"
      class="w-[500px]"
      @search="handleSearch"
    />
  </FloatingWrapper>
</template>