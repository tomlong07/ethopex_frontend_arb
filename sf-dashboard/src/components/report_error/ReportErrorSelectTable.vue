<script setup lang="ts">
import { useReportError } from '@/store/report-error'

const reportErrorStore = useReportError()
watch(
  () => reportErrorStore.reportParams.defaultDemension,
  (value) => {
    console.log(value)
    reportErrorStore.changeTableDimension(value)
  }
)
</script>
<template>
  <div class="flex p-2 border-b justify-between bg-gray-100">
    <div class="flex flex-col">
      <div class="font-bold text-xs text-gray-500 pb-1">Table</div>
      <div class="flex">
        <n-checkbox-group
          v-model:value="reportErrorStore.reportParams.defaultDemension"
        >
          <div class="grid grid-rows-2 grid-flow-col gap-1">
            <template
              v-for="(o, i) in reportErrorStore.targetDemensionOptions"
              :key="i"
            >
              <n-checkbox
                size="small"
                class="text-xs"
                :value="o.value"
                :label="o.label"
              />
            </template>
          </div>
        </n-checkbox-group>
      </div>
    </div>
  </div>
</template>
