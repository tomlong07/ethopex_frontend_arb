<script setup lang="ts">
import FilterItemV2 from '@/components/common/FilterItemV2.vue'
import { useReportCamp } from '@/store/report-camp'
import SkeletonSelect from '../common/SkeletonSelect.vue'

const reportCampStore = useReportCamp()
const filterComputed = computed<any[]>(
  () => reportCampStore.listFilterItem || []
)
</script>
<template>
  <div class="bg-gray-100 border-b px-4 py-2">
    <div class="flex gap-2" v-if="reportCampStore.isFetchInit">
      <SkeletonSelect
        class="w-40"
        size="small"
        v-for="(_, index) in Array(7)"
        :key="index"
      />
    </div>
    <div class="flex flex-wrap justify-start gap-2" v-else>
      <template v-for="(item, index) in filterComputed" :key="index">
        <FilterItemV2
          v-model:filter-item="reportCampStore.filter[item.key]"
          :value="filterComputed[index]"
          class="w-44"
          :primary-key="item.primary_key"
          :is-multiple="item.isMultiple"
          :is-report-camp="item.isReportCamp"
          :clearable="item.clearable"
          :is-loading="item.loading"
          @search="reportCampStore.searchValueFilter"
        />
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.filter {
  border-left-width: 1px;
  border-right-width: 1px;
}
</style>
