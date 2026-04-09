<script setup lang="ts">
import SkeletonSelect from '@/components/common/SkeletonSelect.vue'
import { TimeIntervalOptions } from '@/options/time'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()
</script>

<template>
  <SkeletonSelect v-if="!reportStoreV2.isReady" class="w-24" size="small" />

  <div class="flex flex-col gap-1 w-24" v-else>
    <div class="text-xs font-bold h-6 text-gray-500">Interval</div>
    <n-select
      class="small-select-dropdown"
      :menu-props="{ class: 'small-select-dropdown' }"
      v-model:value="reportStoreV2.time_interval"
      filterable
      :options="TimeIntervalOptions"
      :consistent-menu-width="false"
      size="small"
      max-tag-count="responsive"
    />
  </div>
</template>

<style scoped>
.n-base-selection-label {
  height: 38px;
}
</style>
