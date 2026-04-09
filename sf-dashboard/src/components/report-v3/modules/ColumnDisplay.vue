<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import { ReportColumn } from '@/types/state/report'
import draggableComponent from 'vuedraggable'
import Drag from '@/assets/icons/Drag.vue'
import Close2 from '@/assets/icons/Close2.vue'

const reportStoreV2 = useReportV2(helper.truePath())()
const show = ref<boolean>(false)
const METRIC_ORDER = 'metric_order'
const showOrderModal = ref<boolean>(false)
const localMetrics = ref<ReportColumn[]>([])
const originalListColAccepted = ref<string[]>([])
const baseOrder = ref<string[]>([])

const searchQuery = ref('')

const filteredMetricReportCols = computed(() => {
  if (!searchQuery.value.trim()) return sortedMetricReportCols.value

  const q = searchQuery.value.toLowerCase()

  return sortedMetricReportCols.value.filter((col) =>
    col.title?.toLowerCase().includes(q)
  )
})

const allMetricKeys = () =>
  reportStoreV2.MetricReportCols.map((m) => m.key).filter(
    (k): k is string => !!k
  )

const metricMap = () =>
  new Map(reportStoreV2.MetricReportCols.map((m) => [m.key, m]))

const savedOrder = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(METRIC_ORDER) || '[]')
  } catch {
    return []
  }
}

// merge baseOrder với thứ tự hiện tại của localMetrics
const mergeWithBase = (base: string[], orderedKeys: string[]) => {
  const checkedSet = new Set(orderedKeys)
  let i = 0
  return base.map((k) => (checkedSet.has(k) ? orderedKeys[i++] ?? k : k))
}

const finalOrder = computed(() => {
  const allKeys = allMetricKeys()
  if (!showOrderModal.value || !baseOrder.value.length) return allKeys

  const localKeys = localMetrics.value
    .map((m) => m.key)
    .filter((k): k is string => !!k)
  const merged = mergeWithBase(baseOrder.value, localKeys)

  const mergedSet = new Set(merged)
  return [...merged, ...allKeys.filter((k) => !mergedSet.has(k))]
})

// sắp xếp metrics bên trái theo finalOrder
const sortedMetricReportCols = computed(() => {
  if (!showOrderModal.value) return reportStoreV2.MetricReportCols

  const orderMap = new Map(finalOrder.value.map((k, i) => [k, i]))
  return [...reportStoreV2.MetricReportCols].sort(
    (a, b) =>
      (orderMap.get(a.key ?? '') ?? Infinity) -
      (orderMap.get(b.key ?? '') ?? Infinity)
  )
})

// khi drag xong => cập nhật baseOrder theo thứ tự mới
watch(
  localMetrics,
  (newList) => {
    if (!showOrderModal.value || !newList.length) return
    const localKeys = newList.map((m) => m.key).filter((k): k is string => !!k)
    baseOrder.value = mergeWithBase(baseOrder.value, localKeys)
  },
  { deep: true }
)

// khi check/uncheck => đồng bộ localMetrics theo baseOrder
watch(
  () => reportStoreV2.listColAccepted,
  (keys) => {
    if (!showOrderModal.value) return

    const posMap = new Map(baseOrder.value.map((k, i) => [k, i]))
    const map = metricMap()

    localMetrics.value = keys
      .filter((k) => map.has(k))
      .sort((a, b) => (posMap.get(a) ?? Infinity) - (posMap.get(b) ?? Infinity))
      .map((k) => map.get(k)!)
  },
  { deep: true }
)

const openOrderModal = () => {
  searchQuery.value = ''
  originalListColAccepted.value = [...reportStoreV2.listColAccepted]

  const allKeys = allMetricKeys()
  const saved = savedOrder()
  const savedSet = new Set(saved)

  baseOrder.value = [...saved, ...allKeys.filter((k) => !savedSet.has(k))]

  const posMap = new Map(baseOrder.value.map((k, i) => [k, i]))

  localMetrics.value = reportStoreV2.MetricReportCols.filter(
    (m) => m.key && reportStoreV2.listColAccepted.includes(m.key)
  ).sort(
    (a, b) =>
      (posMap.get(a.key ?? '') ?? Infinity) -
      (posMap.get(b.key ?? '') ?? Infinity)
  )

  showOrderModal.value = true
}

const handleSaveOrder = () => {
  localStorage.setItem(METRIC_ORDER, JSON.stringify(finalOrder.value))
  showOrderModal.value = false
  reportStoreV2.refreshMetricOrder()
  reportStoreV2.updateClicked += 1
}

const handleCancelOrder = () => {
  searchQuery.value = ''
  reportStoreV2.listColAccepted = [...originalListColAccepted.value]
  showOrderModal.value = false
  localMetrics.value = []
  baseOrder.value = []
}

const handleResetOrder = () => {
  localStorage.removeItem(METRIC_ORDER)
  baseOrder.value = []
  showOrderModal.value = false
  window.location.reload()
}

const toggleColDisplay = () => {
  if (reportStoreV2.listColAccepted.length === 0) {
    AllColDisplay()
  } else {
    clearColDisplay()
  }
}

const toggleAllMetrics = () => {
  const tickAll = reportStoreV2.MetricReportCols.every(
    (element) =>
      element.key && reportStoreV2.listColAccepted.includes(element.key)
  )

  if (tickAll) {
    reportStoreV2.listColAccepted = reportStoreV2.listColAccepted.filter(
      (key) => !reportStoreV2.MetricReportCols.some((col) => col.key === key)
    )
  } else {
    reportStoreV2.MetricReportCols.forEach((element) => {
      if (element.key && !reportStoreV2.listColAccepted.includes(element.key)) {
        reportStoreV2.listColAccepted.push(element.key)
      }
    })
  }
}

const clearColDisplay = () => {
  reportStoreV2.listColAccepted = []
}

const AllColDisplay = () => {
  reportStoreV2.listColAccepted = [
    ...reportStoreV2.MetricReportCols.map((item) => item.key).filter(
      (key): key is string => Boolean(key)
    ), // Lọc giá trị undefined
    ...reportStoreV2.GroupByReport.concat(reportStoreV2.InfoReportCols)
      .filter((element) => !isDisabled(element) && element.key)
      .map((element) => element.key as string), // Khẳng định kiểu
  ]
}

const isDisabled = (colOption: ReportColumn) => {
  //Các cột bị disabled khi ko có điều kiện
  if (colOption.IsConditionMustGoogleTaboolaCampaign()) {
    if (reportStoreV2.IsConditionMustGoogleTaboolaCampaign) return true
  }

  if (colOption.IsConditionMustTaboolaSection()) {
    if (reportStoreV2.IsConditionMustTaboolaSection) return true
  }

  if (!reportStoreV2.group_by.includes(colOption.key || '')) {
    if (colOption.active) {
      for (let index = 0; index < reportStoreV2.group_by.length; index++) {
        if (reportStoreV2.group_by.includes(colOption.active[index]))
          return false
      }
    }

    return true
  }

  return false
}

watch(
  () => reportStoreV2.filter?.traffic_source,
  (value) => {
    try {
      if (reportStoreV2.IsConditionMustGoogleTaboolaCampaign) {
        const removeKeys = new Set(
          reportStoreV2.InfoReportCols.filter((item) =>
            item.IsConditionMustGoogleTaboolaCampaign()
          ).map((item) => item.key)
        )

        reportStoreV2.listColAccepted = reportStoreV2.listColAccepted.filter(
          (col) => !removeKeys.has(col)
        )
      }

      if (reportStoreV2.IsConditionMustGoogleTaboola) {
        // gom key thỏa điều kiện vào Set để lookup O(1)
        const keysToRemove = new Set(
          reportStoreV2.GroupByReport.filter((item) =>
            item.IsConditionMustGoogleTaboola()
          ).map((item) => item.key)
        )

        // lọc lại luôn thay vì splice từng phần tử
        reportStoreV2.listColAccepted = reportStoreV2.listColAccepted.filter(
          (el) => !keysToRemove.has(el)
        )
        reportStoreV2.group_by = reportStoreV2.group_by.filter(
          (el) => !keysToRemove.has(el)
        )
      }

      if (reportStoreV2.IsConditionMustTaboolaSection) {
        const removeKeys = new Set(
          reportStoreV2.InfoReportCols.filter((item) =>
            item.IsConditionMustTaboolaSection()
          ).map((item) => item.key)
        )

        reportStoreV2.listColAccepted = reportStoreV2.listColAccepted.filter(
          (col) => !removeKeys.has(col)
        )
      }
    } catch {}
  }
)

const notification = (colOption: ReportColumn) => {
  if (!colOption.key || !colOption.notification || !colOption.headerTooltip)
    return

  if (reportStoreV2.listColAccepted.includes(colOption.key)) {
    window.message.info(colOption.headerTooltip)
  }
}

const isAllMetricsSelected = computed(() => {
  return reportStoreV2.MetricReportCols.every(
    (element) =>
      element.key && reportStoreV2.listColAccepted.includes(element.key)
  )
})

const removeMetric = (key: string | undefined) => {
  if (!key) return
  
  const index = reportStoreV2.listColAccepted.indexOf(key)
  if (index > -1) {
    reportStoreV2.listColAccepted.splice(index, 1)
  }
}
</script>

<template>
  <div class="font-bold text-xs text-gray-500">
    <div class="flex font-bold text-xs items-center h-9">
      Column Display:
      <n-switch
        v-model:value="show"
        :disabled="reportStoreV2.isFetchingReport"
        class="mx-2"
        size="small"
      >
      </n-switch>
      <div class="flex font-bold text-xs text-gray-800">
        <n-button
          v-if="show"
          size="tiny"
          @click="toggleColDisplay"
          title="Click to toggle all columns"
          >All</n-button
        >
      </div>
    </div>

    <n-collapse-transition :show="show">
      <div class="flex w-full mt-3">
        <n-checkbox-group
          v-model:value="reportStoreV2.listColAccepted"
          class="flex gap-2 flex-col"
        >
          Info:
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(o, i) in reportStoreV2.InfoReportCols"
              :key="i"
              class="w-36"
            >
              <n-popover
                trigger="hover"
                :disabled="!isDisabled(o) || !o.headerTooltip"
                :show-arrow="false"
              >
                <template #trigger>
                  <n-checkbox
                    size="small"
                    :value="o.key"
                    :label="o.title"
                    :disabled="isDisabled(o)"
                    class="column-wrapper-checkbox"
                    @click="notification(o)"
                  />
                </template>
                <span
                  v-html="o.headerTooltip"
                  v-if="isDisabled(o)"
                  class="text-xs"
                ></span>
              </n-popover>
            </div>
          </div>

          <div class="flex gap-2 items-center">
            Metrics:
            <n-button
              size="tiny"
              @click="toggleAllMetrics"
              title="Click to toggle all metrics"
              >All</n-button
            >
            <n-button
              size="tiny"
              @click="openOrderModal"
              title="Customize columns"
              >Customize columns</n-button
            >
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(o, i) in reportStoreV2.MetricReportColsSorted"
              :key="i"
              class="w-36"
            >
              <n-popover
                trigger="hover"
                :disabled="!o.headerTooltip"
                :show-arrow="false"
              >
                <template #trigger>
                  <n-checkbox
                    size="small"
                    :value="o.key"
                    :label="o.title"
                    :class="o.IsRealTime() ? 'blink' : ''"
                    class="column-wrapper-checkbox"
                  />
                </template>
                <span
                  v-html="o.headerTooltip"
                  class="text-xs text-gray-500"
                ></span>
              </n-popover>
            </div>
          </div>
        </n-checkbox-group>
      </div>
    </n-collapse-transition>

    <!-- Order Modal -->
    <n-modal
      v-model:show="showOrderModal"
      preset="card"
      title="Customize metric columns"
      class="w-[1000px]"
      :bordered="false"
      size="small"
      :segmented="{
        content: 'soft',
        footer: 'soft',
      }"
    >
      <div class="flex gap-4 h-[65vh]">
        <div class="flex-1 border-r border-gray-200 pr-4 flex flex-col">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-semibold text-gray-700">
              Select the column to display
            </h3>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-500">
                Selected: {{ localMetrics.length }} columns
              </span>
              <n-button size="tiny" @click="toggleAllMetrics">
                {{ isAllMetricsSelected ? 'Deselect All' : 'Select All' }}
              </n-button>
            </div>
          </div>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search metrics..."
            size="small"
            clearable
            class="mb-2"
          />
          <p v-if="searchQuery.trim()" class="text-xs text-gray-500 mb-2">
            {{ filteredMetricReportCols.length }} results for
            <span class="font-semibold">"{{ searchQuery }}"</span>
          </p>
          <n-checkbox-group
            v-model:value="reportStoreV2.listColAccepted"
            class="space-y-1 flex-1 overflow-y-auto pr-2"
          >
            <div
              class="text-xs font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1 z-10"
            >
              Metrics Columns
            </div>
            <div class="space-y-1">
              <div
                v-for="(col, i) in filteredMetricReportCols"
                :key="'metric-' + col.key"
                class="group relative"
              >
                <n-popover
                  trigger="hover"
                  :disabled="!col.headerTooltip"
                  :show-arrow="false"
                  :to="false"
                >
                  <template #trigger>
                    <n-checkbox
                      :value="col.key"
                      size="small"
                      class="w-full p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center justify-between w-full gap-2">
                        <span class="text-sm">{{ col.title }}</span>
                        <span v-if="col.IsRealTime()" class="blink-dot"></span>
                      </div>
                    </n-checkbox>
                  </template>
                  <span
                    v-html="col.headerTooltip"
                    class="text-xs text-gray-500"
                  ></span>
                </n-popover>
              </div>

              <div
                v-if="filteredMetricReportCols.length === 0"
                class="py-6 text-center text-xs text-gray-400"
              >
                No metrics found for "{{ searchQuery }}"
              </div>
            </div>
          </n-checkbox-group>
        </div>

        <div class="w-80">
          <div class="mb-3">
            <h3 class="font-semibold text-gray-700">Customize columns</h3>
            <p class="text-xs text-gray-500 mt-1">
              Drag and drop to reorder selected columns
            </p>
          </div>

          <div
            v-if="localMetrics.length === 0"
            class="flex items-center justify-center h-[calc(65vh-5rem)] border-2 border-dashed border-gray-200 rounded-lg"
          >
            <p class="text-sm text-gray-400">No columns selected</p>
          </div>

          <draggableComponent
            v-else
            v-model="localMetrics"
            item-key="key"
            class="space-y-2 max-h-[calc(65vh-3rem)] overflow-y-auto pr-2"
            :animation="300"
            :scroll="true"
            :scroll-speed="20"
          >
            <template #item="{ element }">
              <div
                class="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex justify-between items-center transition-colors group cursor-grab active:cursor-grabbing"
              >
                <div class="flex items-center gap-2 flex-shrink-0">
                  <div
                    class="flex items-center drag-handle cursor-move p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <n-icon :component="Drag" size="16" class="text-gray-400" />
                  </div>
                </div>

                <div class="flex gap-3 items-center flex-1 min-w-0 mx-2">
                  <div class="flex flex-col min-w-0">
                    <span class="font-medium text-gray-700 truncate">
                      {{ element.title }}
                    </span>
                    <span class="text-xs text-gray-400 truncate">
                      {{ element.key }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <n-button
                    text
                    size="tiny"
                    @click.stop="removeMetric(element.key)"
                  >
                    <n-icon :component="Close2" size="16" class="text-gray-400 hover:text-red-500" />
                  </n-button>
                </div>
              </div>
            </template>
          </draggableComponent>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end items-center">
          <div class="flex gap-2">
            <n-button @click="handleResetOrder" size="small" color="#2d5cc8">
              Reset
            </n-button>
            <n-button @click="handleCancelOrder" size="small">
              Cancel
            </n-button>
            <n-button
              type="primary"
              color="#f43f5e"
              @click="handleSaveOrder"
              size="small"
              :disabled="localMetrics.length === 0"
            >
              Save
            </n-button>
          </div>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.blink {
  position: relative;
  width: fit-content;
}
.blink:after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  width: 8.39px;
  height: 8.39px;
  border-radius: 50%;
  background-color: #49a849;
  animation: flash 1s infinite;
}

.blink-dot {
  width: 8.39px;
  height: 8.39px;
  border-radius: 999px;
  background: #49a849;
  animation: flash 1s infinite;
  transform: translateY(1px);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<style lang="scss">
.column-wrapper-checkbox {
  .n-checkbox__label {
    max-width: calc(144px - 14px); /* Giới hạn chiều rộng */
    white-space: nowrap; /* Không xuống dòng */
    overflow: hidden; /* Ẩn phần nội dung bị tràn */
    text-overflow: ellipsis; /* Hiển thị dấu '...' khi bị tràn */
  }
}
</style>
