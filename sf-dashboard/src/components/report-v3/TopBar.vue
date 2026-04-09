<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'

import { filterType } from '@/types/state/report'
import SearchType from '@/components/report-v3/modules/SearchType.vue'
import Search from '@/components/report-v3/modules/Search.vue'
import UpdateButton from '@/components/report-v3/modules/UpdateButton.vue'

import DateRanger from '@/components/common/DateRanger.vue'
import TimeZoneComp from '@/components/common/TimeZoneComp.vue'
import { DATE_RANGE } from '@/enum/report-v2'
import Interval from './modules/Interval.vue'
import TimeZone from './modules/TimeZone.vue'
import { debounceV2 } from '@/utils'

const dateRangerComp = ref<InstanceType<typeof DateRanger>>()
// const intervalComp = ref<InstanceType<typeof DropCustom>>()
const timezoneComp = ref<InstanceType<typeof TimeZoneComp>>()

const reportStoreV2 = useReportV2(helper.truePath())()

const dateDefaultValue = computed(() => [
  reportStoreV2.filter?.start_date || '',
  reportStoreV2.filter?.end_date || '',
])

const filterComputed = computed<filterType>(() => reportStoreV2.filter)
onMounted(async () => {})

watch(
  filterComputed,
  () => {
    dateRangerComp.value?.updateDateValue([
      filterComputed.value?.start_date || '',
      filterComputed.value?.end_date || '',
    ])
  },
  { deep: true, immediate: true }
)

watch(
  () => reportStoreV2.isReady,
  async (newVal) => {
    await helper.sleep(1)
    await timezoneComp?.value?.loadTimeZone()
  }
)

const isFirstRender = ref<boolean>(true)

const updateDate = async (date: string[]) => {
  reportStoreV2.filter.start_date = date[0]
  reportStoreV2.filter.end_date = date[1]

  if (reportStoreV2.isDefaultSortDate) {
    reportStoreV2.sort = [{ field: 'date', dir: 'desc' }]
  }
  if (!reportStoreV2.isShowChart || !reportStoreV2.reportSettingsNew.autoUpdate)
    return

  if (isFirstRender.value) {
    isFirstRender.value = false
    return
  }

  updateChart()
}

const updateChart = debounceV2(async () => {
  await reportStoreV2.callReportChart()
  reportStoreV2.renderChartV2()
}, 300)

// const updateInterval = (value: string) => {
//   reportStoreV2.time_interval = value
// }

// const updateTimeZone = (value: string) => {
//   reportStoreV2.timezone = value
// }

// const updateTimeZoneDefault = () => {
//   reportStoreV2.timezone = 'UTC'
// }

const updateDateRange = (value: DATE_RANGE) => {
  reportStoreV2.dateRange = value
}

watch(
  () => reportStoreV2.changeTimezone,
  (newValue) => {
    if (newValue) {
      timezoneComp.value?.changeValueNow(reportStoreV2.timezone)
    }
  }
)
</script>
<template>
  <div class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper">
    <div class="flex items-center flex-row flex-wrap gap-2">
      <DateRanger
        :defaultDate="dateDefaultValue"
        :status="reportStoreV2"
        :smallPicker="true"
        classLabel="items-start"
        :timezone="reportStoreV2.timezone"
        :dateBonus="reportStoreV2.reportPermission.dateBonus"
        @updateDate="updateDate"
        @updateDateRange="updateDateRange"
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

      <Interval />

      <TimeZone />
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <SearchType />
      <Search />

      <UpdateButton />
    </div>
  </div>
</template>
