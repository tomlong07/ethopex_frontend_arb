<script setup lang="ts">
import DateRanger from '@/components/common/DateRanger.vue'
import TimeZoneComp from '@/components/common/TimeZoneComp.vue'
import RotateRightSolid from '@/assets/icons/RotateRightSolid.vue'
import useReportTopList from '@/store/useReportTopList'
import { TimeIntervalOptions } from '@/options/time'
import { DATE_RANGE } from '@/enum/report-v2'

const dateRangerComp = ref<InstanceType<typeof DateRanger>>()
const timeZoneCompRef = ref<InstanceType<typeof TimeZoneComp>>()

// !! Store
const reportTopListStore = useReportTopList()
const handleChangeInterval = () => {
  reportTopListStore.buildQuery()
}
</script>

<template>
  <div class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper">
    <div class="flex items-center flex-row flex-wrap gap-2">
      <DateRanger
        v-if="reportTopListStore.reportConditions.timezone"
        :defaultDate="reportTopListStore.dateDefaultValue"
        :default-date-range="reportTopListStore.defaultDateRange as string"
        :status="{ isFetching: false }"
        :smallPicker="true"
        classLabel="items-start"
        :timezone="reportTopListStore.reportConditions.timezone"
        @updateDate="reportTopListStore.updateDate"
        @updateDateRange="reportTopListStore.updateDateRange"
        :enableDateRangeEmit="true"
        :enabledPresets="[
          DATE_RANGE.TODAY,
          DATE_RANGE.YESTERDAY,
          DATE_RANGE.LAST_3_DAYS,
          DATE_RANGE.LAST_7_DAYS,
          DATE_RANGE.LAST_14_DAYS,
          DATE_RANGE.LAST_30_DAYS,
          DATE_RANGE.THIS_MONTH,
          DATE_RANGE.LAST_MONTH,
          DATE_RANGE.FIRST_QUARTER,
          DATE_RANGE.SECOND_QUARTER,
          DATE_RANGE.THIRD_QUARTER,
          DATE_RANGE.FOURTH_QUARTER,
          DATE_RANGE.ALL_TIME,
        ]"
        ref="dateRangerComp"
      />

      <div class="flex flex-col gap-1 w-24">
        <div class="text-xs font-bold h-6 text-gray-500">Interval</div>
        <n-select
          class="small-select-dropdown"
          :menu-props="{ class: 'small-select-dropdown' }"
          v-model:value="reportTopListStore.reportConditions.time_interval"
          filterable
          @update:value="handleChangeInterval"
          :options="TimeIntervalOptions"
          :consistent-menu-width="false"
          size="small"
          max-tag-count="responsive"
        />
      </div>
      <TimeZoneComp
        v-if="reportTopListStore.reportConditions.timezone"
        ref="timeZoneCompRef"
        :defaultValue="reportTopListStore.reportConditions.timezone"
        size="small"
        class="w-[240px]"
        :loadInit="true"
        @updateValue="reportTopListStore.updateTimezone"
        @resetTzDefault="reportTopListStore.resetTzDefault"
      />
    </div>
    <div class="flex items-center gap-2 ml-auto">
      <div class="flex flex-col gap-1">
        <div class="text-xs font-bold h-6 text-gray-500">&nbsp;</div>

        <n-button
          size="small"
          color="#f43f5e"
          @click="reportTopListStore.onUpdateReport"
        >
          <template #icon>
            <n-icon size="16">
              <RotateRightSolid />
            </n-icon>
          </template>
          Update
        </n-button>
      </div>
    </div>
  </div>
</template>
