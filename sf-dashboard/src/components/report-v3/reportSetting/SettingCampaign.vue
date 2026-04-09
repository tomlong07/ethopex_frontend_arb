<script setup lang="ts">
import { DATE_RANGE } from '@/enum/report-v2'
import date2 from '@/utils/date2'
import { SelectOption } from 'naive-ui'
import { useReportV2 } from '@/store/report/report-v2'
const reportStoreV2 = useReportV2(helper.truePath())()

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
})

const optionGroupBy: SelectOption[] = [
  {
    label: 'Date',
    value: 'date',
  },
]

const optionsDateOpen: SelectOption[] = [
  {
    label: 'Current Range',
    value: 'current',
  },
  {
    label: 'Today',
    value: DATE_RANGE.TODAY,
    range: () => {
      return [
        date2.today(reportStoreV2.timezone),
        date2.today(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'Yesterday',
    value: DATE_RANGE.YESTERDAY,
    range: () => {
      return [
        date2.yesterday(reportStoreV2.timezone),
        date2.yesterday(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'Last 3 days',
    value: DATE_RANGE.LAST_3_DAYS,
    range: () => {
      return [
        date2.last3Days(reportStoreV2.timezone),
        date2.yesterday(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'Last 7 days',
    value: DATE_RANGE.LAST_7_DAYS,
    range: () => {
      return [
        date2.last7Days(reportStoreV2.timezone),
        date2.yesterday(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'Last 14 days',
    value: DATE_RANGE.LAST_14_DAYS,
    range: () => {
      return [
        date2.last14Days(reportStoreV2.timezone),
        date2.yesterday(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'Last 30 days',
    value: DATE_RANGE.LAST_30_DAYS,
    range: () => {
      return [
        date2.last30Days(reportStoreV2.timezone),
        date2.yesterday(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'This month',
    value: DATE_RANGE.THIS_MONTH,
    range: () => {
      return [
        date2.startMonth(reportStoreV2.timezone),
        date2.endMonth(reportStoreV2.timezone),
      ]
    },
  },
  {
    label: 'Last month',
    value: DATE_RANGE.LAST_MONTH,
    range: () => {
      return [
        date2.startLastMonth(reportStoreV2.timezone),
        date2.endLastMonth(reportStoreV2.timezone),
      ]
    },
  },

  {
    label: 'First Quarter',
    value: DATE_RANGE.FIRST_QUARTER,
    range: () => {
      return [
        date2.startFirstQuarter(reportStoreV2.timezone),
        date2.endFirstQuarter(reportStoreV2.timezone),
      ]
    },
  },

  {
    label: 'Second Quarter',
    value: DATE_RANGE.SECOND_QUARTER,
    range: () => {
      return [
        date2.startSecondQuarter(reportStoreV2.timezone),
        date2.startSecondQuarter(reportStoreV2.timezone),
        date2.endSecondQuarter(reportStoreV2.timezone),
      ]
    },
  },

  {
    label: 'Third Quarter',
    value: DATE_RANGE.THIRD_QUARTER,
    range: () => {
      return [
        date2.startThirdQuarter(reportStoreV2.timezone),
        date2.endThirdQuarter(reportStoreV2.timezone),
      ]
    },
  },

  {
    label: 'Fourth Quarter',
    value: DATE_RANGE.FOURTH_QUARTER,
    range: () => {
      return [
        date2.startFourthQuarter(reportStoreV2.timezone),
        date2.endFourthQuarter(reportStoreV2.timezone),
      ]
    },
  },

  {
    label: 'All time',
    value: DATE_RANGE.ALL_TIME,
    range: () => {
      return [date2.allTime(), date2.today(reportStoreV2.timezone)]
    },
  },
]

const emit = defineEmits<{
  (e: 'changeFrontendSettings', key: string, value: any, options?: any): void
}>()

const changeFrontendSettings = (
  changeKey: string,
  value: any,
  options?: Record<string, any>
) => {
  emit('changeFrontendSettings', changeKey, value, options)
}

const dateLabelNow = computed(() => {
  const option = optionsDateOpen.find(
    (opt) => opt.value === reportStoreV2.reportSettingsNew.dateOpen
  )
  return option ? option.label : 'Not Set'
})
</script>

<template>
  <tr>
    <td>Campaign By Date Mode</td>
    <td class="flex flex-col gap-2 justify-start items-start">
      <n-switch
        :loading="props.isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.campaignViewMode"
        :on-update:value="(value:string) => changeFrontendSettings('campaignViewMode', value, {reload: true})"
      />

      <div class="w-32">
        <div class="text-xs text-gray-500">Range</div>
        <n-select
          :loading="isLoading"
          :consistent-menu-width="false"
          v-model:value="reportStoreV2.reportSettingsNew.dateOpen"
          :options="optionsDateOpen"
          :disabled="!reportStoreV2.reportSettingsNew.campaignViewMode"
          placeholder="Date Range"
          :on-update:value="(value:number) => changeFrontendSettings('dateOpen', value, {reload: true})"
        />
      </div>

      <div class="w-32">
        <div class="text-xs text-gray-500">Group By</div>
        <n-select
          :loading="isLoading"
          :consistent-menu-width="false"
          v-model:value="reportStoreV2.reportSettingsNew.groupBy"
          :options="optionGroupBy"
          :disabled="!reportStoreV2.reportSettingsNew.campaignViewMode"
          placeholder="Group By"
          :on-update:value="(value:number) => changeFrontendSettings('groupBy', value, {reload: true})"
        />
      </div>
    </td>
    <td>
      Open campaign in new tab with sort by date and select date follow your
      date setting. (Now is <b>{{ dateLabelNow }}</b
      >)
    </td>
    <td></td>
  </tr>
</template>
