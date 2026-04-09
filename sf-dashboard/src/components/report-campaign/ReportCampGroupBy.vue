<script setup lang="ts">
import { useReportCamp } from '@/store/report-camp'
import SkeletonSelect from '../common/SkeletonSelect.vue'

const reportCampStore = useReportCamp()
</script>
<template>
  <div class="flex gap-2 px-4 py-2" v-if="reportCampStore.isFetchInit">
    <SkeletonSelect
      class="w-40"
      size="small"
      v-for="(_, index) in Array(2)"
      :key="index"
    />
  </div>
  <div class="flex flex-col px-4 py-2" v-else>
    <div class="font-bold text-xs text-gray-500 pb-1">Group By:</div>
    <div class="flex">
      <n-checkbox-group v-model:value="reportCampStore.group_by">
        <div class="grid grid-rows-2 grid-flow-col gap-1">
          <template v-for="(o, i) in reportCampStore.listGroupBy" :key="i">
            <n-checkbox size="small" :value="o.key" :label="o.title" />
          </template>
        </div>
      </n-checkbox-group>
    </div>
  </div>
</template>
