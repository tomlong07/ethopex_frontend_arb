<script setup lang="ts">
import { ReportColumn } from '@/types/state/report'
import { CellComponent } from 'tabulator-tables'
import { buildKeyUnique } from '@/components/report-v3/report_helpers'

import ReportDown from '@/assets/icons/ReportDown.vue'
import ReportUp from '@/assets/icons/ReportUp.vue'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },

  plus: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const opts = new ReportColumn(props.plus)

const symbol = opts?.symbol || ''
const leftSymbol = opts?.leftSymbol || false

const reportDataV2 = props.plus?.reportDataV2
const reportDataV2_Prev = props.plus?.prevReportDataV2

const isRowTotal = reportDataV2 ? true : false

const hasCompare = ref(false)
const oldData = ref<any>()

const diff = ref(0)

const oldValueShow = ref()

if (reportDataV2_Prev) {
  hasCompare.value = true

  if (isRowTotal) {
    oldData.value = reportDataV2_Prev?.total || {}

    const newTotalValue = props.cell.getValue()
    const oldTotalValue = oldData.value[props.cell.getField()]
    oldValueShow.value = oldTotalValue
    diff.value = newTotalValue - oldTotalValue
  } else {
    oldData.value = reportDataV2_Prev?.items || []

    if (oldData.value?.length) {
      const newData = props.cell.getData() as { [key: string]: any }

      let keyUnique = buildKeyUnique(newData)

      for (let index = 0; index < oldData.value.length; index++) {
        const element = oldData.value[index]
        const keyUniqueForThisRow = buildKeyUnique(element)

        if (keyUnique === keyUniqueForThisRow) {
          oldValueShow.value = element[props.cell.getField()]

          diff.value = props.cell.getValue() - oldValueShow.value

          break
        }
      }
    }
  }
}

let dataRaw = '-'
try {
  dataRaw = props.cell.getValue()
} catch {}

const formatValue = ref()

try {
  formatValue.value = helper.formatNumberV2(dataRaw, opts.precision)
} catch (error) {
  console.error(error)
}

const isHasColorDiv = computed(() => {
  return opts.IsHasColor() && !opts.isBottom
})

const className = computed(() => {
  if (isHasColorDiv.value) {
    const isNegative = Number(dataRaw) < 0
    let className = ''
    switch (true) {
      case opts.IsColorDefault():
        className = isNegative ? 'text-red-500' : 'text-green-700'
        break
      case opts.IsColorV2():
        className = isNegative ? 'text-green-700' : 'text-red-500'
        break
    }
    return className
  }

  return ''
})

const showSymbol = computed(() => {
  return symbol && formatValue.value !== '-'
})

const formatNumberByValue = (value: any) => {
  const res = helper.formatNumberV2(value, opts.precision)
  if (res === '-') {
    return ''
  }

  return res
}
const isPercentByMetric = opts.percentByMetric
let percentByMetricData = ''
let metricData = 0

if (!isRowTotal && dataRaw != '-') {
  if (isPercentByMetric) {
    const deeps = isPercentByMetric.split('.')
    if (deeps?.length) {
      try {
        metricData = helper.getValueByPath(props.cell.getData(), deeps)

        if (metricData) {
          const percentByMetricRaw =
            ((dataRaw as unknown as number) / metricData) * 100

          if (percentByMetricRaw) {
            percentByMetricData = `${formatNumberByValue(percentByMetricRaw)}%`
          }
        }
      } catch {}
    }
  }
}

const showDiff = computed(() => {
  return hasCompare.value && Math.abs(diff.value) > 0.0001
})

const oldText = computed(() => {
  if (leftSymbol) {
    return symbol + formatNumberByValue(oldValueShow.value)
  }

  return formatNumberByValue(oldValueShow.value) + symbol
})

const classDiff = computed(() => {
  if (opts.IsColorV3()) {
    if (diff.value > 0) return 'negative'
    if (diff.value < 0) return 'positive'

    return ''
  }

  if (diff.value > 0) return 'positive'
  if (diff.value < 0) return 'negative'

  return ''
})
</script>

<template>
  <div>
    <span :class="className"
      ><template v-if="leftSymbol && showSymbol">{{ symbol }}</template
      >{{ formatNumberByValue(dataRaw) }}
      <template v-if="!leftSymbol && showSymbol">{{ symbol }}</template>
      <span
        v-if="percentByMetricData"
        class="text-xxs text-gray-500"
        :title="`Spending: ${percentByMetricData} of budget $${formatNumberByValue(
          metricData
        )}`"
        >({{ percentByMetricData }})</span
      >
      <span
        v-if="showDiff"
        class="span-comparison inline-flex items-center"
        :class="classDiff"
        :title="oldText"
      >
        <ReportUp v-if="diff > 0" />
        <ReportDown v-if="diff < 0" />

        <span>{{ formatNumberByValue(diff) }}</span></span
      >
    </span>
  </div>
</template>
