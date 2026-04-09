<template>
  <n-spin :show="props.loading" class="flex-1 overflow-auto scroll-thin-custom">
    <div class="flex flex-col gap-4 py-2">
      <!-- Column Controls -->
      <div v-if="!isDisplayMetrics" class="text-center text-gray-500">
        {{ props.loading ? '' : 'No metrics available' }}
      </div>
      <div class="border" v-else>
        <div class="bg-gray-100 p-2 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-700">Columns</span>
            <n-switch v-model:value="showMetrics" size="small"></n-switch>
          </div>
          <n-button size="small" @click="toggleAllColumns">
            {{ isAllSelected ? 'Deselect All' : 'Select All' }}
          </n-button>
        </div>
        <Transition name="collapse">
          <div v-if="showMetrics" class="p-2 bg-gray-50">
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2"
            >
              <n-checkbox
                v-for="(column, index) in modalColumns"
                :key="`${column.field}_${index}`"
                v-model:checked="visibleColumns[column.field]"
                class="text-xs"
              >
                {{ column.headerName || column.field }}
              </n-checkbox>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Metrics and Logic Cards Section -->
      <div
        v-for="(cardData, index) in metricCardsData"
        :key="index"
        class="flex flex-col border"
      >
        <span v-if="cardData.logicName" class="font-bold text-blue-600 p-2">{{
          cardData.logicName
        }}</span>

        <!-- Metric Data Table -->
        <div v-if="visibleColumnsList.length > 0">
          <n-data-table
            :columns="tableColumns"
            :data="[cardData.metricData]"
            :bordered="false"
            size="small"
          />
        </div>
        <div
          v-else
          class="text-sm text-gray-400 flex justify-center items-center py-3"
        >
          {{ props.loading ? '' : 'No columns selected' }}
        </div>

        <!-- Logic Table -->
        <div v-if="cardData.logicData.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="pl-2 py-2 text-left font-medium text-gray-700 border-b"
                >
                  Field
                </th>
                <th
                  class="px-3 py-2 text-left font-medium text-gray-700 border-b"
                >
                  Condition
                </th>
                <th
                  class="px-3 py-2 text-left font-medium text-gray-700 border-b"
                >
                  Comparison
                </th>
                <th
                  class="px-3 py-2 text-left font-medium text-gray-700 border-b"
                >
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(logic, logicIndex) in cardData.logicData"
                :key="logicIndex"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="pl-2 py-3 text-gray-900">{{ logic.Field }}</td>
                <td class="px-3 py-2 text-gray-700">{{ logic.Condition }}</td>
                <td class="px-3 py-2 text-gray-700">{{ logic.Comparison }}</td>
                <td class="px-3 py-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded  font-medium',
                      logic.Result === 'true'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ logic.Result }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          class="text-sm text-gray-400 flex justify-center items-center py-3"
        >
          {{ props.loading ? '' : 'No logic data available' }}
        </div>
      </div>

      <!-- Fallback -->
      <div v-if="!isDisplayMetrics">
        <div
          v-for="(logicItem, index) in parsedLogicArray"
          :key="index"
          class="flex flex-col border mb-4"
        >
          <span v-if="logicItem.logic_name" class="font-bold text-blue-600 p-2">
            {{ logicItem.logic_name }}
          </span>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="pl-2 py-2 text-left font-medium text-gray-700 border-b"
                  >
                    Field
                  </th>
                  <th
                    class="px-3 py-2 text-left font-medium text-gray-700 border-b"
                  >
                    Condition
                  </th>
                  <th
                    class="px-3 py-2 text-left font-medium text-gray-700 border-b"
                  >
                    Comparison
                  </th>
                  <th
                    class="px-3 py-2 text-left font-medium text-gray-700 border-b"
                  >
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(condition, conditionIndex) in logicItem.conditions"
                  :key="conditionIndex"
                  class="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td class="pl-2 py-3 text-gray-900">{{ condition.Field }}</td>
                  <td class="px-3 py-2 text-gray-700">
                    {{ condition.Condition }}
                  </td>
                  <td class="px-3 py-2 text-gray-700">
                    {{ condition.Comparison }}
                  </td>
                  <td class="px-3 py-2">
                    <span
                      :class="[
                        'px-3 py-1 rounded font-medium',
                        condition.Result === 'true'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ condition.Result }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="!props.data?.logic || parsedLogicArray.length === 0"
          class="text-center text-gray-500 py-8"
        >
          {{ props.loading ? '' : 'No logic data available' }}
        </div>
      </div>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { ResponseColumns } from '../../types/state/template'

interface LogicCondition {
  Field: string
  Condition: string
  Comparison: string
  Result: string
}

const props = defineProps<{
  data: any
  loading?: boolean
}>()

// State for column visibility
const visibleColumns = ref<Record<string, boolean>>({})
const showMetrics = ref<boolean>(false)

const getLocalStorageKey = () => {
  const path = helper.truePath()
  return `log_rule_satisfy_columns_${path.replace(/\//g, '_')}`
}

const getShowMetricsKey = () => {
  const path = helper.truePath()
  return `log_rule_satisfy_show_metrics_${path.replace(/\//g, '_')}`
}

const loadVisibleColumnsFromStorage = (): Record<string, boolean> | null => {
  try {
    const key = getLocalStorageKey()
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Error loading columns from localStorage:', error)
    return null
  }
}

const loadShowMetricsFromStorage = (): boolean => {
  try {
    const key = getShowMetricsKey()
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : false
  } catch (error) {
    console.error('Error loading showMetrics from localStorage:', error)
    return false
  }
}

const saveVisibleColumnsToStorage = (columns: Record<string, boolean>) => {
  try {
    const key = getLocalStorageKey()
    localStorage.setItem(key, JSON.stringify(columns))
  } catch (error) {
    console.error('Error saving columns to localStorage:', error)
  }
}

const saveShowMetricsToStorage = (value: boolean) => {
  try {
    const key = getShowMetricsKey()
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving showMetrics to localStorage:', error)
  }
}

const defaultSelectedHeaders = [
  'CPA',
  'CVR',
  'CPC',
  'Conversions',
  'CPA',
  'CPA',
]
const columnConfigs = ref<ResponseColumns>({})

const fetchPermissionColumns = async () => {
  const result = await ctr_permission_settings.PermissionColumns('/satisfy')

  columnConfigs.value = result.data?.options || {}
}
onMounted(() => {
  fetchPermissionColumns()
  showMetrics.value = loadShowMetricsFromStorage()
})

const modalColumns = computed(() => {
  const storeCols = (columnConfigs.value.columns || []).filter(
    (c: any) => c.modal
  )

  if (storeCols.length > 0) {
    return storeCols.map((c: any) => {
      if (c.field === 'bid') return { ...c, headerName: 'New Bid' }
      if (c.field === 'budget') return { ...c, headerName: 'New Budget' }
      return c
    })
  }

  // --- Fallback: suy ra cột từ metrics của props.data ---
  const sample =
    props.data?.metrics && props.data.metrics[0] ? props.data.metrics[0] : null
  if (!sample || typeof sample !== 'object') return []
  const fields = Object.keys(sample).filter(
    (k) => k !== 'log_condition' && k !== 'logic_name'
  )

  // map thành cấu hình cột tối thiểu
  return fields.map((field) => {
    if (field === 'bid') return { field, headerName: 'New Bid', modal: true }
    if (field === 'budget')
      return { field, headerName: 'New Budget', modal: true }
    return { field, headerName: field, modal: true }
  })
})

const visibleColumnsList = computed(() => {
  return Object.keys(visibleColumns.value).filter(
    (column) => visibleColumns.value[column]
  )
})

const isAllSelected = computed(() => {
  const totalModalColumns = modalColumns.value.length
  const selectedCount = modalColumns.value.filter(
    (column) => visibleColumns.value[column.field]
  ).length
  return totalModalColumns > 0 && selectedCount === totalModalColumns
})

const tableColumns = computed(() => {
  return visibleColumnsList.value.map((column) => {
    const config = modalColumns.value.find((c) => c.field === column)
    return {
      title: config?.headerName || column,
      key: column,
      width: 150,
    }
  })
})

const formatMetric = (key: any, value: any) => {
  if (!columnConfigs.value.columns) return value

  const columnConfig = columnConfigs.value.columns.find(
    (col) => col.field === key
  )

  if (!columnConfig || !columnConfig.format) {
    return value
  }

  switch (true) {
    case columnConfig.format === 'percent':
      return helper.getPercent(value, columnConfig.decimal || 1)
    case columnConfig.format === 'number':
      return helper.numberTranform(value, columnConfig.decimal || 2)
    case columnConfig.format === 'currency':
      return helper.currencyFormatter(value, columnConfig.decimal || 2)
    default:
      return value
  }
}

const parseLogics = (logicsString: string): LogicCondition[] => {
  const result: LogicCondition[] = []
  if (!logicsString) return result

  const logicItems = logicsString.split(/<br>|\n/).filter((item) => item.trim())

  logicItems.forEach((item) => {
    const cleanItem = item.replace(/^\[|\]$/g, '').trim()

    const parts = cleanItem.split(' | ')
    const logicCondition: LogicCondition = {
      Field: '',
      Condition: '',
      Comparison: '',
      Result: '',
    }

    parts.forEach((part) => {
      if (part.startsWith('Field: '))
        logicCondition.Field = part.replace('Field: ', '').trim()
      else if (part.startsWith('Condition: '))
        logicCondition.Condition = part.replace('Condition: ', '').trim()
      else if (part.startsWith('Comparison: '))
        logicCondition.Comparison = part.replace('Comparison: ', '').trim()
      else if (part.startsWith('Result: '))
        logicCondition.Result = part.replace('Result: ', '').trim()
    })

    if (logicCondition.Field) result.push(logicCondition)
  })

  return result
}

const parsedLogicArray = computed(() => {
  if (!props.data?.logic) return []
  try {
    const logicData =
      typeof props.data.logic === 'string'
        ? JSON.parse(props.data.logic)
        : props.data.logic

    if (Array.isArray(logicData)) {
      return logicData
    }
    return []
  } catch (error) {
    console.error('Error parsing logic data:', error)
    return []
  }
})

const metricCardsData = computed(() => {
  if (!props.data?.metrics) return []

  return props.data.metrics.map((metricsData: any, index: number) => {
    const metricData: Record<string, any> = {}

    Object.keys(props.data).forEach((key) => {
      if (visibleColumns.value[key] && key !== 'metrics') {
        metricData[key] = props.data[key]
      }
    })

    Object.keys(metricsData).forEach((key) => {
      if (visibleColumns.value[key]) {
        metricData[key] = formatMetric(key, metricsData[key])
      }
    })

    const logicData = metricsData.log_condition
      ? parseLogics(metricsData.log_condition)
      : []

    return {
      metricData,
      logicData,
      metricIndex: index,
      logicName: metricsData.logic_name,
    }
  })
})

const isDisplayMetrics = computed(() => {
  return metricCardsData.value.length > 0
})

const defaultSelectedHeadersLocal = defaultSelectedHeaders

const toggleAllColumns = () => {
  const shouldSelectAll = !isAllSelected.value
  const newVisibleColumns: Record<string, boolean> = { ...visibleColumns.value }

  modalColumns.value.forEach((column) => {
    newVisibleColumns[column.field] = shouldSelectAll
  })

  visibleColumns.value = newVisibleColumns
}

// autoSelect theo rule_type
const autoSelectFields = computed<string[]>(() => {
  const type = props.data?.rule_type?.toLowerCase?.()
  if (!type) return []

  const selected: string[] = []
  if (type.includes('bid')) selected.push('bid', 'current_bid')
  if (type.includes('budget')) selected.push('budget', 'current_budget')

  return selected
})

// initialize visibleColumns when modalColumns changes or data prop changes
watch(
  [() => modalColumns.value, () => props.data],
  ([cols]) => {
    const list = Array.isArray(cols) ? cols : []

    const next: Record<string, boolean> = {}
    list.forEach((column: any) => {
      next[column.field] = false
    })

    const savedColumns = loadVisibleColumnsFromStorage()

    if (savedColumns) {
      // Lấy từ localStorage
      list.forEach((column: any) => {
        if (Object.prototype.hasOwnProperty.call(savedColumns, column.field)) {
          next[column.field] = !!savedColumns[column.field]
        }
      })
    } else {
      // Mặc định
      list.forEach((column: any) => {
        const headerName = column.headerName || column.field
        if (defaultSelectedHeadersLocal.includes(headerName)) {
          next[column.field] = true
        }
      })
    }
    // Ưu tiên trường hợp check rule_type để auto select
    const auto = new Set(autoSelectFields.value)
    list.forEach((column: any) => {
      if (auto.has(column.field)) next[column.field] = true
    })

    visibleColumns.value = next
  },
  { immediate: true, deep: true }
)

watch(
  () => visibleColumns.value,
  (newColumns) => {
    if (Object.keys(newColumns).length > 0) {
      saveVisibleColumnsToStorage(newColumns)
    }
  },
  { deep: true }
)

watch(
  () => showMetrics.value,
  (newValue) => {
    saveShowMetricsToStorage(newValue)
  }
)
</script>

<style scoped>
/* Collapse transition */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.5s ease, opacity 0.5s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 1200px; /* đặt đủ lớn để chứa nội dung */
  opacity: 1;
}
</style>
