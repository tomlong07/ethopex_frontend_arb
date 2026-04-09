<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DateRanger from '@/components/common/DateRanger.vue'
import TimeZoneComp from '@/components/common/TimeZoneComp.vue'
import useReportSupplyKeyword from '@/store/useReportSupplyKeyword'
import RotateRightSolid from '@/assets/icons/RotateRightSolid.vue'
import { TimeIntervalOptions } from '@/options/time'
import { DATE_RANGE } from '@/enum/report-v2'

// !! Refs
const dateRangerComp = ref<InstanceType<typeof DateRanger>>()
const timeZoneCompRef = ref<InstanceType<typeof TimeZoneComp>>()

//  !! Router
const route = useRoute()
const router = useRouter()

// !! Store
const store = useReportSupplyKeyword()

// !! Func
const getValidValue = (
  value: any,
  validator: (v: any) => boolean,
  fallback: any
) => (value && validator(value) ? value : fallback)

const getValidArray = (
  value: any,
  validator: (arr: string[]) => boolean,
  fallback: string[]
) => {
  const arr = value
    ? typeof value === 'string'
      ? value.split(',')
      : value
    : fallback
  return validator(arr) ? arr : fallback
}

const validateArray = (arr: string[], accepted: string[]) =>
  arr.every((item) => accepted.includes(item))

const isValidDate = (d: any) => {
  const date = new Date(d)
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(d)
}

const isValidTimezone = (tz: any) => typeof tz === 'string' && tz.length > 0
const isValidInterval = (interval: any) =>
  TimeIntervalOptions.some((opt) => opt.value === interval)

type QueryKeys =
  | 'start_date'
  | 'end_date'
  | 'timezone'
  | 'timeInterval'
  | 'group_by'
  | 'metrics'

const updateRouterQuery = (
  overrides: Partial<Record<QueryKeys, string>> = {}
) => {
  const newQuery: Record<QueryKeys, string> = {
    start_date: store.filter.start_date,
    end_date: store.filter.end_date,
    timezone: store.timezone,
    timeInterval: store.timeInterval,
    group_by: store.listGroupByColumnAccepted.join(','),
    metrics: store.listMetricsColumnAccepted.join(','),
    ...overrides,
  }

  const changed = (Object.keys(newQuery) as QueryKeys[]).some(
    (key) => String(route.query[key] ?? '') !== String(newQuery[key])
  )

  if (changed) router.replace({ query: newQuery })
}
const allMetricsKeys = store.metricsColumn.map((c) => c.key)
const paramMap = {
  start_date: {
    get: () => route.query.start_date,
    set: (v: string) => store.updateDate([v, store.filter.end_date]),
    validator: isValidDate,
    isArray: false,
    default: () => store.filter.start_date,
  },
  end_date: {
    get: () => route.query.end_date,
    set: (v: string) => store.updateDate([store.filter.start_date, v]),
    validator: isValidDate,
    isArray: false,
    default: () => store.filter.end_date,
  },
  timezone: {
    get: () => route.query.timezone,
    set: (v: string) => store.updateTimezone(v),
    validator: isValidTimezone,
    isArray: false,
    default: () => store.timezone,
  },
  timeInterval: {
    get: () => route.query.timeInterval,
    set: (v: string) => (store.timeInterval = v),
    validator: isValidInterval,
    isArray: false,
    default: () => store.timeInterval,
  },
  group_by: {
    get: () => route.query.group_by,
    set: (v: string[]) => (store.listGroupByColumnAccepted = v),
    validator: (arr: string[]) =>
      validateArray(arr, store.listGroupByColumnAccepted),
    isArray: true,
    default: () => [...store.listGroupByColumnAccepted],
  },
  metrics: {
    get: () => route.query.metrics,
    set: (v: string[]) => (store.listMetricsColumnAccepted = v),
    validator: (arr: string[]) =>
      arr.every((item) => allMetricsKeys.includes(item)),
    isArray: true,
    default: () => [...store.listMetricsColumnAccepted],
  },
}

const syncQueryToStore = () => {
  Object.entries(paramMap).forEach(
    ([key, { get, set, validator, isArray, default: def }]) => {
      const value = get()
      if (isArray) {
        set(getValidArray(value, validator, def() as string[]))
      } else {
        set(getValidValue(value, validator, def() as string))
      }
    }
  )

  updateRouterQuery()
}

const handleUpdateReport = () => {
  updateRouterQuery()
  store.onUpdateReport()
}

// !! Lifecycle hook
const dateDefaultValue = computed(() => [
  store.filter.start_date,
  store.filter.end_date,
])

onMounted(syncQueryToStore)
</script>

<template>
  <div class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper">
    <div class="flex items-center flex-row flex-wrap gap-2">
      <DateRanger
        :key="dateDefaultValue.join('-')"
        :defaultDate="dateDefaultValue"
        :status="store"
        :smallPicker="true"
        classLabel="items-start"
        :timezone="store.timezone"
        @updateDate="store.updateDate"
        @updateDateRange="store.updateDateRange"
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
          v-model:value="store.timeInterval"
          filterable
          :options="TimeIntervalOptions"
          :consistent-menu-width="false"
          size="small"
          max-tag-count="responsive"
        />
      </div>

      <TimeZoneComp
        ref="timeZoneCompRef"
        :defaultValue="store.timezone"
        size="small"
        class="w-[240px]"
        :loadInit="true"
        @updateValue="store.updateTimezone"
        @resetTzDefault="store.resetTzDefault"
      />
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <n-button
        size="small"
        color="#f43f5e"
        :loading="store.isFetchingReport"
        @click="handleUpdateReport"
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
</template>
