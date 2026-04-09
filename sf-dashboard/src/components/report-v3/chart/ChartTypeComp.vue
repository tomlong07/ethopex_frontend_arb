<script setup lang="ts">
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import { CHART_TYPE } from '@/enum/report-v2'
import { ChartItemV2, useReportV2 } from '@/store/report/report-v2'
import { ReportColumn } from '@/types/state/report'
import { SelectOption } from 'naive-ui'

const reportStoreV2 = useReportV2(helper.truePath())()

const props = defineProps({
  chart: {
    type: Object as () => ChartItemV2,
    required: true,
  },

  chartKey: {
    type: String,
    required: true,
  },
})

const MAX_CHART = 6

const optionNow = (type: 'column' | 'spline'): SelectOption[] => {
  const chart = reportStoreV2.chartV2[props.chartKey]
  if (!chart) return console.warn(`Not found chart ${props.chartKey}`), []

  const { colSelected } = chart
  const current = colSelected[type] || []
  const other = type === 'column' ? colSelected.spline : colSelected.column
  const all = [...current, ...other]

  return reportStoreV2.MetricReportCols.filter(
    (opt): opt is ReportColumn & { key: string; title: string } =>
      !!opt.key && !!opt.title && !opt.chartEx
  ).map(({ key, title }) => ({
    label: title!,
    value: key!,
    disabled:
      !current.includes(key!) &&
      (other.includes(key!) || all.length >= MAX_CHART),
  }))
}

const renderTag = ({
  option,
  handleClose,
}: {
  option: SelectOption
  handleClose: () => void
}) => {
  // Tìm ReportColumn từ MetricReportCols thay vì tạo mới
  const reportCol = reportStoreV2.MetricReportCols.find(
    (col) => col.key === option.value
  )
  const configCol = reportCol ? new ReportColumn(reportCol) : null
  const isRealTime = configCol?.IsRealTime() || false

  return h(
    'span',
    {
      class: `inline-flex items-center px-1 py-1 text-xs ${
        isRealTime ? 'blink-border' : ''
      }`,
      style: {
        backgroundColor: '#F3F4F6',
        border: isRealTime ? '1px solid #49a849' : '1px solid #d9d9d9',
        fontSize: '12px',
        maxWidth: '150px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        borderRadius: '2px',
      },
    },
    [
      h('div', {
        title: option.label,
        class: `text-xs truncate ${
          isRealTime ? 'blink-chart blink-2 pr-4' : ''
        }`,
        innerHTML: option.label,
        style: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '120px',
          display: 'inline-block',
        },
      }),
      h('span', {
        class: 'cursor-pointer hover:text-red-500 flex-shrink-0',
        onClick: handleClose,
        innerHTML: '&times;',
        style: {
          marginTop: '-4px',
          marginLeft: '5px',
          cursor: 'pointer',
          fontSize: '20px',
          position: 'relative',
          zIndex: 1,
        },
      }),
    ]
  )
}
const renderLabel = (option: SelectOption) => {
  const col = reportStoreV2.MetricReportCols.find((c) => c.key === option.value)
  const isRealTime = col ? new ReportColumn(col).IsRealTime() : false

  return h('div', {
    title: option.label,
    innerHTML: option.label,
    class: ['text-xs', isRealTime && 'blink-chart'].filter(Boolean).join(' '),
  })
}

const handleUpdateValueV2 = async (value: string[], type: CHART_TYPE) => {
  props.chart.colSelected[type].splice(
    0,
    props.chart.colSelected[type].length,
    ...value
  )

  if (
    !props.chart.colSelected.column?.length &&
    !props.chart.colSelected.spline?.length
  ) {
    window.message.warning('At least one metric must be selected', {
      closable: true,
    })
    return
  }
  reportStoreV2.saveForNewPlk()
  reportStoreV2.renderThisChart(props.chartKey, props.chart)
}
</script>

<template>
  <div class="relative mt-4 mb-4" v-if="props.chart.loading">
    <div
      class="flex justify-center px-2 select-container transition-all duration-200"
    >
      <div class="flex gap-4">
        <div class="flex flex-col flex-1 min-w-0">
          <div class="text-xs text-gray-400 mb-1.5 font-medium">Column</div>
          <div class="flex items-center gap-4 w-64 h-8">
            <n-skeleton width="100%" height="100%" />
          </div>
        </div>

        <div class="flex flex-col flex-1 min-w-0">
          <div class="text-xs text-gray-400 mb-1.5 font-medium">Line</div>

          <div class="flex items-center gap-4 w-64 h-8">
            <n-skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="relative mt-4 mb-4" v-else>
    <div
      class="flex justify-center px-2 select-container transition-all duration-200"
    >
      <div class="flex gap-4">
        <div class="flex flex-col flex-1 min-w-0">
          <div class="text-xs text-gray-400 mb-1.5 font-medium">Column</div>
          <div class="flex items-center gap-4 w-64 h-8">
            <n-select
              v-model:value="chart.colSelected.column"
              multiple
              filterable
              clearable
              :options="optionNow('column')"
              size="medium"
              placeholder="Select metrics for COLUMN"
              max-tag-count="responsive"
              @update:value="(val: string[]) => handleUpdateValueV2(val,  CHART_TYPE.COLUMN)"
              :render-label="renderLabel"
              :render-tag="renderTag"
              :show-checkmark="false"
              :disabled="chart.loading"
            />
          </div>
        </div>

        <div class="flex flex-col flex-1 min-w-0">
          <div class="text-xs text-gray-400 mb-1.5 font-medium">Line</div>

          <div class="flex items-center gap-4 w-64 h-8">
            <n-select
              v-model:value="chart.colSelected.spline"
              multiple
              filterable
              clearable
              :options="optionNow('spline')"
              size="medium"
              placeholder="Select metrics for LINE"
              max-tag-count="responsive"
              @update:value="(val: string[]) => handleUpdateValueV2(val,  CHART_TYPE.SPLINE)"
              :render-label="renderLabel"
              :render-tag="renderTag"
              :show-checkmark="false"
              :disabled="chart.loading"
            />
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  @click="reportStoreV2.removeChartV2(props.chartKey)"
                  :disabled="reportStoreV2.isOneChart || props.chart.loading"
                >
                  <n-icon size="16" class="text-gray-500">
                    <TrashAltRegular />
                  </n-icon>
                </n-button>
              </template>
              <div class="flex flex-col">
                <div class="flex">Remove Chart</div>
              </div>
            </n-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
