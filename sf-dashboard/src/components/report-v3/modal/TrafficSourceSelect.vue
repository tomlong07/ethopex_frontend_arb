<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useReportRule from '@/store/report/report-rule'

const reportRule = useReportRule()

const modelValue = defineModel<string[] | null>('modelValue')
</script>

<template>
  <FloatingWrapper name="Traffic Source">
    <n-select
      v-model:value="modelValue"
      filterable
      clearable
      multiple
      :options="reportRule.trafficSourceOptions"
      :loading="reportRule.isLoadingTrafficSource"
      :consistent-menu-width="false"
      placeholder=""
      size="small"
      max-tag-count="responsive"
      class="w-[180px]"
    />
  </FloatingWrapper>
</template>