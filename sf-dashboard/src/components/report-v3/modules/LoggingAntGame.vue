<script lang="ts" setup>
import ArrowRight from '@/assets/icons/ArrowRight.vue'
import Logging from '@/assets/icons/Logging.vue'
import helper from '@/utils/helper'
import { NPopover, NIcon } from 'naive-ui'
import DateToolTip from './DateToolTip.vue'
import { FindBiddingLabel, FindConversionGoalLabel } from '@/labels/campaign'

const emit = defineEmits(['action'])
const props = defineProps<{ rowData: any }>()

// các field cần check
const FIELDS = ['cpc', 'bidding', 'budget']
const META_FIELDS = ['conversion_goals', 'min_epc', 'conversion_logic']

const isLoggingToolTip = computed(() => props.rowData?.loggingToolTip)

// parse JSON an toàn
const safeParse = (val: any) => {
  try {
    return JSON.parse(val || '{}')
  } catch {
    try {
      const fixed = val.replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
      return JSON.parse(fixed)
    } catch {
      return {}
    }
  }
}
function diffLogs(logs: any[]) {
  if (!Array.isArray(logs)) return []

  // Nhóm logs theo created_at
  const grouped: Record<string, any[]> = {}

  logs.forEach((log) => {
    const key = log.created_at
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(log)
  })

  const result = Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // mới → cũ
    .map((date) => {
      const logsAtDate = grouped[date]
      const mergedChanges: Record<string, { old: any; new: any }> = {}

      logsAtDate.forEach((log) => {
        const oldData = safeParse(log.old)
        const newData = safeParse(log.new)

        FIELDS.forEach((key) => {
          const oldVal = oldData?.[key]
          const newVal = newData?.[key]
          if (oldVal !== newVal)
            mergedChanges[key] = { old: oldVal ?? null, new: newVal ?? null }
        })

        META_FIELDS.forEach((key) => {
          const oldVal = oldData?.campaign_meta?.[key]
          const newVal = newData?.campaign_meta?.[key]
          if (oldVal !== newVal)
            mergedChanges[key] = { old: oldVal ?? null, new: newVal ?? null }
        })
      })

      if (Object.keys(mergedChanges).length === 0) return null
      return { created_at: date, ...mergedChanges }
    })
    .filter(Boolean) as any[]

  return result
}

const tooltipChanges = computed(() => diffLogs(isLoggingToolTip.value))

// field labels để render UI
const FIELD_LABELS: Record<string, string> = {
  cpc: 'CPC',
  bidding: 'Bidding',
  budget: 'Budget',
  conversion_goals: 'Conversion goals',
  min_epc: 'Min EPC',
  conversion_logic: 'Conversion logic',
}

const displayVal = (val: any, field: string) => {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'string') {
    if (val.trim() === '') return '-'

    if (field === 'conversion_goals') {
      return FindConversionGoalLabel(val)
    }

    if (field === 'bidding') {
      return FindBiddingLabel(
        val,
        props.rowData?.traffic_source,
        props.rowData?.campaign_name?.campaign_type
      )
    }
    return val
  }

  if (['cpc', 'budget', 'min_epc'].includes(field)) {
    return helper.currencyFormatterAuto3(val)
  }
  return val
}
</script>

<template>
  <NPopover trigger="hover" placement="bottom">
    <template #trigger>
      <Logging
        :size="20"
        @click="emit('action', $event)"
        :class="{ 'fill-blue-700': tooltipChanges.length }"
      />
    </template>

    <div
      class="max-w-sm w-[450px] bg-white overflow-hidden max-h-[500px] overflow-y-scroll"
      style="scrollbar-width: none"
      v-if="tooltipChanges.length"
    >
      <!-- Rows -->
      <template v-for="(row, idx) in tooltipChanges" :key="idx">
        <div class="bg-white border rounded-lg shadow-sm overflow-hidden mb-2">
          <div
            class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 border-b flex justify-between items-center"
          >
            <DateToolTip :time-val="row.created_at" />

            <!-- Badge đánh dấu newest -->
            <span
              v-if="idx === 0 && tooltipChanges.length > 1"
              class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600"
            >
              Newest
            </span>
          </div>

          <!-- Card body -->

          <div class="grid grid-cols-[140px_1fr] gap-2 px-3 py-2 text-sm">
            <template v-for="field in Object.keys(row)" :key="field">
              <div
                v-if="field !== 'created_at'"
                class="text-gray-600 font-semibold text-xs"
              >
                {{ FIELD_LABELS[field] || field }}
              </div>
              <div
                v-if="field !== 'created_at'"
                class="grid grid-cols-3 items-end"
              >
                <div class="text-red-500 font-mono text-xs text-start">
                  {{ displayVal(row[field]?.old, field) ?? '-' }}
                </div>
                <n-icon
                  :component="ArrowRight"
                  size="14"
                  class="stroke-slate-600"
                />
                <div class="text-green-600 font-mono text-xs text-start">
                  {{ displayVal(row[field]?.new, field) ?? '-' }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div v-else>Log</div>
  </NPopover>
</template>
