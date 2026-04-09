<script setup lang="ts">
import DropCustom from '@/components/common/DropCustom.vue'
import { SelectOption } from 'naive-ui'
import { useReportError } from '@/store/report-error'

const reportErrorStore = useReportError()

const topOptions: SelectOption[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

const updateTop = (value: number) => {
  reportErrorStore.changeTop(value)
}
</script>

<template>
  <DropCustom
    class="w-32"
    name="Top"
    size="small"
    title="Select Top"
    :defaultValue="reportErrorStore.reportParams.topValue"
    :valueOptions="topOptions"
    @updateValue="updateTop"
  />
</template>
