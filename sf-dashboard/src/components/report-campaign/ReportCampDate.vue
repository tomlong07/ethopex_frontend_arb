<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import { useReportCamp } from '@/store/report-camp'
import '@vuepic/vue-datepicker/dist/main.css'

import { SelectOption } from 'naive-ui'
import { ctr_report } from '@/services/ctr_report'
import date2 from '@/utils/date2'
import { TimeIntervalOptions } from '@/options/time'
const isMobile = helper.mobileDetect()

const reportCampStore = useReportCamp()

const dateValue = ref<string[]>([
  reportCampStore.start_date,
  reportCampStore.end_date,
])
const datepicker = ref(null)
const timeZoneOptions = ref<SelectOption[]>([])

const startDateComputed = computed<string>(() => reportCampStore.start_date)
const endDateComputed = computed<string>(() => reportCampStore.end_date)
const intervalOptions = computed<SelectOption[]>(() => TimeIntervalOptions)

type PresetDate = {
  label: string
  range: string[]
}
const presetDate = computed<PresetDate[]>(() => {
  const timezone = reportCampStore.timezone || 'UTC'
  return [
    {
      label: 'Today',
      range: [date2.today(timezone), date2.today(timezone)],
    },
    {
      label: 'Yesterday',
      range: [date2.yesterday(timezone), date2.yesterday(timezone)],
    },
    {
      label: 'Last 7 days',
      range: [date2.last7Days(timezone), date2.today(timezone)],
    },
    {
      label: 'Last 30 days',
      range: [date2.last30Days(timezone), date2.today(timezone)],
    },
    {
      label: 'This month',
      range: [date2.startMonth(timezone), date2.endMonth(timezone)],
    },
    {
      label: 'Last month',
      range: [date2.startLastMonth(timezone), date2.endLastMonth(timezone)],
    },
    {
      label: 'All time',
      range: [date2.allTime(), date2.today(timezone)],
    },
  ]
})
const presetSelected = computed<number>(() => {
  const startDate = dateValue.value[0]
  const endDate = dateValue.value[1]

  // Find matching preset
  const matchingPresetIndex = presetDate.value.findIndex(
    (preset) => preset.range[0] === startDate && preset.range[1] === endDate
  )

  // Handle empty dates case
  if (startDate === '' && endDate === '') {
    return 5 // Last month
  }

  return matchingPresetIndex
})

const onClickPreset = (index: number) => {
  if (index >= 0 && index < presetDate.value.length) {
    dateValue.value = [...presetDate.value[index].range]
  }
  ;(datepicker.value as any).closeMenu()
}

const onUpdateReport = () => {
  reportCampStore.isFetchingReportCamp = true
  reportCampStore.updateClicked += 1
}

onMounted(async () => {
  const timezones = await ctr_report.TimeZone()
  if (timezones?.status) {
    timezones.data.forEach((item: any) => {
      if (timeZoneOptions.value) {
        timeZoneOptions.value.push({
          label: '(UTC' + item.offset + ') ' + item.name,
          value: item.name,
        })
      }
    })
  }
})

watch(
  dateValue,
  (v) => {
    reportCampStore.start_date = v[0]
    reportCampStore.end_date = v[1]
  },
  { deep: true, immediate: true }
)

watch(
  [startDateComputed, endDateComputed],
  () => {
    dateValue.value = [startDateComputed.value, endDateComputed.value]
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div
    :class="`flex p-2 border-b ${isMobile ? 'flex-col' : 'justify-between'}`"
    class="px-4 py-2"
  >
    <!-- date picker -->
    <div class="flex justify-start flex-row mr-4">
      <div class="flex items-center mr-2 font-bold text-xs text-gray-500">
        Date
      </div>
      <div class="flex items-center w-60">
        <VueDatePicker
          ref="datepicker"
          v-model="dateValue"
          range
          multi-calendars
          format="yyyy/MM/dd"
          model-type="yyyy-MM-dd"
          size="small"
          input-class-name="dp-input-small"
          :enable-time-picker="false"
        >
          <template #yearly="{ label, range, presetDateRange }">
            <span @click="presetDateRange(range)">{{ label }}</span>
          </template>
          <template #left-sidebar>
            <div class="dp__preset_ranges border-unset">
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 0 },
                ]"
                @click="onClickPreset(0)"
              >
                Today
              </div>
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 1 },
                ]"
                @click="onClickPreset(1)"
              >
                Yesterday
              </div>
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 2 },
                ]"
                @click="onClickPreset(2)"
              >
                Last 7 days
              </div>
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 3 },
                ]"
                @click="onClickPreset(3)"
              >
                Last 30 days
              </div>
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 4 },
                ]"
                @click="onClickPreset(4)"
              >
                This month
              </div>
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 5 },
                ]"
                @click="onClickPreset(5)"
              >
                Last month
              </div>
              <div
                :class="[
                  'dp__preset_range',
                  { selected: presetSelected === 6 },
                ]"
                @click="onClickPreset(6)"
              >
                All time
              </div>
            </div>
          </template>
          <!-- give prop empty to hide clear icon (lol) -->
          <template #clear-icon> </template>
        </VueDatePicker>
      </div>
      <div
        class="flex items-center mx-2 pl-2 font-bold text-xs text-gray-500 border-l"
      >
        Interval
      </div>
      <div class="flex items-center w-24 text-xs">
        <n-select
          v-model:value="reportCampStore.time_interval"
          :options="intervalOptions"
          size="small"
        />
      </div>
      <div class="flex items-center mx-2 pl-2 font-bold text-xs text-gray-500">
        Time Zone
      </div>
      <div class="flex items-center w-60">
        <n-select
          v-model:value="reportCampStore.timezone"
          placeholder="Time Zone"
          filterable
          :options="timeZoneOptions"
          size="small"
        />
      </div>
    </div>

    <!-- tools bar -->
    <div
      :class="`flex items-center mr-2 justify-end ${
        isMobile ? 'flex-row-reverse mt-2' : ''
      }`"
    >
      <!-- button update -->
      <n-button
        color="#f43f5e"
        :class="[{ 'mr-2': isMobile }]"
        :loading="reportCampStore.isFetchingReportCamp"
        @click="onUpdateReport"
        size="small"
      >
        Update
      </n-button>
    </div>
  </div>
</template>

<style lang="scss">
.dp__menu {
  &_content_wrapper {
    border-width: 1px;
  }
  .dp__calendar_header_item {
    font-weight: 500 !important;
  }
  .dp__preset_ranges {
    width: 150px;
    color: #f43f5e;
    .dp__preset_range {
      &.selected {
        background: #ddd;
      }
    }
  }
  .dp__action.dp__select {
    border-width: 1px;
    background: #5e6890;
    color: white;
    font-weight: 500;
    padding: 5px 10px;
  }
  .dp__action.dp__cancel {
    border-width: 1px;
    margin-right: 10px;
    color: #000000;
    font-weight: 500;
    padding: 5px 10px;
  }
}
.dp__input_wrap {
  .dp__input_icon_pad {
    padding-left: 15px;
  }
  .dp__input_icon {
    left: unset;
    right: 0;
    border-left: 1px solid #bdbac2;
  }
}
.border-unset {
  border: unset;
}
.dp-input-small {
  height: 28px !important;
  font-size: 12px !important;
  line-height: 1.2 !important;
}
.dp__sidebar_left {
  font-size: 12px !important;
  font-weight: 500;
}
.n-base-selection-label {
  font-size: 12px !important;
}
</style>
