<script setup lang="ts">
import { isToday, isAfter } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import date2, { compare, create } from '@/utils/date2'

import { DATE_RANGE } from '@/enum/report-v2'
import NextDay from '@/assets/icons/NextDay.vue'
import PrevDay from '@/assets/icons/PrevDay.vue'

const props = defineProps({
  defaultDate: {
    type: Array as () => string[],
    default: () => {
      return [date2.today(), date2.today()]
    },
  },
  defaultDateRange: {
    type: String,
    default: '',
  },

  status: {
    type: Object as () => any,
    required: true,
  },

  classLabel: {
    type: String,
    default: '',
  },

  minDate: {
    type: String,
    default: '',
  },
  teleport: {
    type: Boolean,
    default: false,
  },

  classContainer: {
    type: String,
    default: 'flex-col',
  },

  smallPicker: {
    type: Boolean,
    default: false,
  },

  timezone: {
    type: String,
    default: 'UTC',
  },

  dateBonus: {
    type: Array,
  },

  enableDateRangeEmit: {
    type: Boolean,
    default: false,
  },

  enabledPresets: {
    type: Array as () => DATE_RANGE[],
    default: () => [
      DATE_RANGE.TODAY,
      DATE_RANGE.YESTERDAY,
      DATE_RANGE.LAST_7_DAYS,
      DATE_RANGE.LAST_30_DAYS,
      DATE_RANGE.THIS_MONTH,
      DATE_RANGE.LAST_MONTH,
      DATE_RANGE.FIRST_QUARTER,
      DATE_RANGE.SECOND_QUARTER,
      DATE_RANGE.THIRD_QUARTER,
      DATE_RANGE.FOURTH_QUARTER,
      DATE_RANGE.LAST_3_MONTHS,
      DATE_RANGE.ALL_TIME,
    ],
  },
})

const dateValue = ref<string[]>(props.defaultDate)

const emit = defineEmits<{
  (e: 'updateDate', date: string[]): void
  (e: 'updateDateRange', dateRange: DATE_RANGE): void
}>()

const datepicker = ref(null)

type PresetDate = {
  value?: DATE_RANGE
  label: string
  range: string[]
}

const allPresets: Record<DATE_RANGE, PresetDate> = {
  [DATE_RANGE.CURRENT]: {
    value: DATE_RANGE.CURRENT,
    label: 'Current',
    range: [date2.today(props.timezone), date2.today(props.timezone)],
  },
  [DATE_RANGE.TODAY]: {
    value: DATE_RANGE.TODAY,
    label: 'Today',
    range: [date2.today(props.timezone), date2.today(props.timezone)],
  },
  [DATE_RANGE.YESTERDAY]: {
    value: DATE_RANGE.YESTERDAY,
    label: 'Yesterday',
    range: [date2.yesterday(props.timezone), date2.yesterday(props.timezone)],
  },
  [DATE_RANGE.LAST_3_DAYS]: {
    value: DATE_RANGE.LAST_3_DAYS,
    label: 'Last 3 days',
    range: [date2.last3Days(props.timezone), date2.yesterday(props.timezone)],
  },
  [DATE_RANGE.LAST_7_DAYS]: {
    value: DATE_RANGE.LAST_7_DAYS,
    label: 'Last 7 days',
    range: [date2.last7Days(props.timezone), date2.yesterday(props.timezone)],
  },
  [DATE_RANGE.LAST_14_DAYS]: {
    value: DATE_RANGE.LAST_14_DAYS,
    label: 'Last 14 days',
    range: [date2.last14Days(props.timezone), date2.yesterday(props.timezone)],
  },
  [DATE_RANGE.LAST_30_DAYS]: {
    value: DATE_RANGE.LAST_30_DAYS,
    label: 'Last 30 days',
    range: [date2.last30Days(props.timezone), date2.yesterday(props.timezone)],
  },
  [DATE_RANGE.THIS_MONTH]: {
    value: DATE_RANGE.THIS_MONTH,
    label: 'This month',
    range: [date2.startMonth(props.timezone), date2.endMonth(props.timezone)],
  },
  [DATE_RANGE.LAST_MONTH]: {
    value: DATE_RANGE.LAST_MONTH,
    label: 'Last month',
    range: [
      date2.startLastMonth(props.timezone),
      date2.endLastMonth(props.timezone),
    ],
  },
  [DATE_RANGE.FIRST_QUARTER]: {
    value: DATE_RANGE.FIRST_QUARTER,
    label: 'First Quarter',
    range: [
      date2.startFirstQuarter(props.timezone),
      date2.endFirstQuarter(props.timezone),
    ],
  },
  [DATE_RANGE.SECOND_QUARTER]: {
    value: DATE_RANGE.SECOND_QUARTER,
    label: 'Second Quarter',
    range: [
      date2.startSecondQuarter(props.timezone),
      date2.endSecondQuarter(props.timezone),
    ],
  },
  [DATE_RANGE.THIRD_QUARTER]: {
    value: DATE_RANGE.THIRD_QUARTER,
    label: 'Third Quarter',
    range: [
      date2.startThirdQuarter(props.timezone),
      date2.endThirdQuarter(props.timezone),
    ],
  },
  [DATE_RANGE.FOURTH_QUARTER]: {
    value: DATE_RANGE.FOURTH_QUARTER,
    label: 'Fourth Quarter',
    range: [
      date2.startFourthQuarter(props.timezone),
      date2.endFourthQuarter(props.timezone),
    ],
  },
  [DATE_RANGE.LAST_3_MONTHS]: {
    value: DATE_RANGE.LAST_3_MONTHS,
    label: 'Last 3 months',
    range: [
      date2.last3Months(props.timezone).start,
      date2.last3Months(props.timezone).end,
    ],
  },

  [DATE_RANGE.ALL_TIME]: {
    value: DATE_RANGE.ALL_TIME,
    label: 'All time',
    range: [date2.allTime(), date2.today(props.timezone)],
  },
}

const presetDate = computed<PresetDate[]>(() => {
  const presets: any[] = []

  if (props.dateBonus) {
    props.dateBonus.forEach((element: any) => {
      presets.push({
        label: element.label,
        range: [element.value, element.value],
      })
    })
  }

  const enabledPresetsList = props.enabledPresets
    .map((presetKey) => allPresets[presetKey])
    .filter(Boolean)

  return presets.concat(enabledPresetsList)
})

watch(
  dateValue,
  () => {
    emit('updateDate', dateValue.value)

    if (props.enableDateRangeEmit) {
      let foundRange = false

      try {
        for (let index = 0; index < presetDate.value.length; index++) {
          const element = presetDate.value[index]

          if (
            dateValue.value[0] === element.range[0] &&
            dateValue.value[1] === element.range[1] &&
            element.value
          ) {
            emit('updateDateRange', element.value)
            foundRange = true
            break
          }
        }
      } catch (error) {
        console.error(error)
      }

      if (!foundRange) {
        emit('updateDateRange', 'current' as DATE_RANGE)
      }
    }
  },
  { deep: true, immediate: true }
)

const updateDateValue = (date: string[]) => {
  if (!date || !date.length || date.length != 2) {
    console.error('DateRanger->updateDateValue: date is not correct', date)
    return
  }
  if (!date[0] || !date[1]) {
    return
  }

  dateValue.value = date
}

defineExpose({
  updateDateValue,
})

const presetSelectedV2 = (preset: PresetDate) => {
  return dateValue.value[0] == preset.range[0] &&
    dateValue.value[1] == preset.range[1]
    ? true
    : false
}

const presetText = computed<string>(() => {
  for (let index = 0; index < presetDate.value.length; index++) {
    if (
      dateValue.value[0] == presetDate.value[index].range[0] &&
      dateValue.value[1] == presetDate.value[index].range[1]
    ) {
      return presetDate.value[index].label
    }
  }

  if (dateValue.value[0] == dateValue.value[1]) {
    return getRelativeTime(dateValue.value[0], date2.today(props.timezone))
  }

  return 'Custom'
})

function getRelativeTime(fromDateStr: string, toDateStr: string): string {
  const fromDate = new Date(fromDateStr)
  const toDate = new Date(toDateStr)

  fromDate.setHours(0, 0, 0, 0)
  toDate.setHours(0, 0, 0, 0)

  const diffMs = fromDate.getTime() - toDate.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const absDays = Math.abs(diffDays)

  if (diffDays === 0) return 'today'

  const sameDay = fromDate.getDate() === toDate.getDate()
  const bothAreEndOfMonth = isEndOfMonth(fromDate) && isEndOfMonth(toDate)
  const calendarMonthDiff =
    (fromDate.getFullYear() - toDate.getFullYear()) * 12 +
    (fromDate.getMonth() - toDate.getMonth())

  let value: number
  let unit: string

  if ((sameDay || bothAreEndOfMonth) && Math.abs(calendarMonthDiff) >= 1) {
    value = Math.abs(calendarMonthDiff)
    unit = 'month'
  } else if (absDays % 7 === 0) {
    value = absDays / 7
    unit = 'week'
  } else {
    value = absDays
    unit = 'day'
  }

  const plural = value > 1 ? 's' : ''
  const result = `${value} ${unit}${plural}`
  return `${result} ago`
}

function isEndOfMonth(date: Date): boolean {
  const test = new Date(date)
  test.setDate(date.getDate() + 1)
  return test.getDate() === 1
}

const prevDayNow = () => {
  if (props.status.isFetching) {
    return
  }

  if (compare.isQuarterPicker(dateValue.value[0], dateValue.value[1])) {
    dateValue.value = create.prevOneQuarter(dateValue.value[0])
    return
  }

  if (compare.isMonthPicker(dateValue.value[0], dateValue.value[1])) {
    dateValue.value = create.prevOneMonth(dateValue.value[0])
    return
  }

  dateValue.value = create.prevDays(dateValue.value)
}

const prevDayTooltip = computed<string>(() => {
  if (compare.isQuarterPicker(dateValue.value[0], dateValue.value[1])) {
    return 'Previous Quarter'
  }

  if (compare.isMonthPicker(dateValue.value[0], dateValue.value[1])) {
    return 'Previous Month'
  }

  return `Previous ${days.value} Days`
})

const nextDayNow = () => {
  if (props.status.isFetching || isNextDisabled.value) {
    return
  }

  if (compare.isQuarterPicker(dateValue.value[0], dateValue.value[1])) {
    dateValue.value = create.nextOneQuarter(dateValue.value[0])
    return
  }

  if (compare.isMonthPicker(dateValue.value[0], dateValue.value[1])) {
    dateValue.value = create.nextOneMonth(dateValue.value[0])
    return
  }

  dateValue.value = create.nextDays(dateValue.value)
}

const nextDayTooltip = computed<string>(() => {
  if (compare.isQuarterPicker(dateValue.value[0], dateValue.value[1])) {
    return 'Next Quarter'
  }

  if (compare.isMonthPicker(dateValue.value[0], dateValue.value[1])) {
    return 'Next Month'
  }

  return `Next ${days.value} Days`
})

const days = computed<number>(() => {
  return compare.calculateDaysDifference(dateValue.value[0], dateValue.value[1])
})

const isNextDisabled = computed<boolean>(() => {
  return (
    isToday(new Date(dateValue.value[1])) ||
    isAfter(new Date(dateValue.value[1]), new Date())
  )
})

const onClickPresetV2 = (preset: PresetDate) => {
  dateValue.value = preset.range
  // emit('updateDateRange', preset.value)
  // Close the menu programmatically
  ;(datepicker.value as any)?.closeMenu()
}
const onRangeStart = () => {
  const inputElement = document.querySelector('.dp__action_select')
  if (inputElement) {
    inputElement.setAttribute('disabled', 'true')
  }
}

const onRangeEnd = () => {
  const inputElement = document.querySelector('.dp__action_select')
  if (inputElement) {
    inputElement.removeAttribute('disabled')
  }
}

const customPresetLabel = computed(() => {
  if (dateValue.value?.length !== 2 || !props.dateBonus) return ''

  for (let index = 0; index < props.dateBonus?.length; index++) {
    const element = props.dateBonus[index] as any
    if (element.value === dateValue.value[0]) {
      return element.label
    }
  }

  return ''
})

watch(
  () => props.defaultDateRange,
  (v) => {
    if (v) {
      const dateRange = presetDate.value?.find((item) => item.value === v)
      if (dateRange) {
        onClickPresetV2(dateRange)
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex justify-start gap-1" :class="props.classContainer">
    <div class="flex" :class="props.classLabel">
      <div class="flex items-center mr-2 font-bold text-xs text-gray-500">
        {{ presetText }}
      </div>
      <div class="flex items-center ml-auto">
        <n-tooltip trigger="hover">
          <template #trigger
            ><div
              class="mx-1 text-gray-700 btt-days"
              :class="[
                props.status.isFetching
                  ? 'opacity-70 cursor-not-allowed	'
                  : 'cursor-pointer',
              ]"
              @click="prevDayNow"
            >
              <PrevDay /></div></template
          >{{ prevDayTooltip }}
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <div
              class="mx-1 text-gray-700 btt-days"
              :class="[
                props.status.isFetching || isNextDisabled
                  ? 'opacity-70 cursor-not-allowed	'
                  : 'cursor-pointer',
              ]"
              @click="nextDayNow"
            >
              <NextDay />
            </div> </template
          >{{ nextDayTooltip }}
        </n-tooltip>
      </div>
    </div>
    <div
      class="flex items-center datepicker-menu-custom relative"
      :class="[props.smallPicker ? '' : 'w-64']"
    >
      <span
        class="absolute inset-0 pointer-events-none z-[1] px-2 py-1 text-xs flex items-center"
        v-if="customPresetLabel !== ''"
      >
        {{ customPresetLabel }}
      </span>

      <VueDatePicker
        ref="datepicker"
        v-model="dateValue"
        :required="true"
        range
        @range-start="onRangeStart"
        @range-end="onRangeEnd"
        multi-calendars
        format="yyyy/MM/dd"
        model-type="yyyy-MM-dd"
        :enable-time-picker="false"
        :min-date="props.minDate"
        :teleport="props.teleport"
        :class="props.smallPicker ? 'small-datepicker' : ''"
      >
        <template #yearly="{ label, range, presetDateRange }">
          <span @click="presetDateRange(range)">{{ label }}</span>
        </template>
        <template #left-sidebar>
          <div class="dp__preset_ranges border-unset">
            <div
              :class="[
                'dp__preset_range',
                { selected: presetSelectedV2(preset) },
              ]"
              @click="onClickPresetV2(preset)"
              :key="index"
              v-for="(preset, index) in presetDate"
            >
              {{ preset.label }}
            </div>
          </div>
        </template>
        <!-- give prop empty to hide clear icon -->
        <template #clear-icon> </template>
      </VueDatePicker>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/css/DateRangerV3.scss';
</style>
