<script setup lang="ts">
import useReportTopList from '@/store/useReportTopList'

// Store
const reportTopListStore = useReportTopList()

const selectedCount = computed(
  () => reportTopListStore.reportConditions.cols?.length || 0
)

const isDisabled = (value: string | any) => {
  return (
    selectedCount.value >= 10 &&
    !reportTopListStore.reportConditions.cols?.includes(value)
  )
}

const isRealTime = (value: any) => {
  return value.includes('_rt') ? true : false
}

const handleChangeMetric = () => {
  reportTopListStore.buildQuery()
}
</script>

<template>
  <div class="flex p-2 mx-2 border-t border-gray-200">
    <div class="flex flex-row flex-1 justify-between">
      <div class="metric">
        <div class="flex gap-3 items-center h-[30px]">
          <div class="flex font-bold text-xs text-gray-500 items-center">
            Metric:
            <n-switch
              v-model:value="reportTopListStore.showCard.metric"
              class="mx-2"
              size="small"
            >
            </n-switch>
          </div>
          <n-tag v-if="selectedCount >= 10" type="info" class="text-xs">
            You can only select up to 10 metric
          </n-tag>
        </div>
        <n-collapse-transition :show="reportTopListStore.showCard.metric">
          <div class="flex w-full mt-3">
            <n-checkbox-group
              v-if="reportTopListStore.reportConditions"
              v-model:value="reportTopListStore.reportConditions.cols"
              class="flex gap-2 flex-col"
              @update:value="handleChangeMetric"
            >
              <div class="flex flex-wrap items-center gap-2">
                <div
                  v-for="(o, i) in reportTopListStore.metricReportCols"
                  :key="i"
                  class="w-36 text-xs"
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
                        :class="isRealTime(o.key) ? 'blink' : ''"
                        class="column-wrapper-checkbox"
                        :disabled="isDisabled(o.key)"
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
      </div>
    </div>
  </div>
</template>
<style scoped>
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
</style>
<style lang="scss" scoped>
.column-wrapper-checkbox {
  .n-checkbox__label {
    max-width: calc(144px - 14px); /* Giới hạn chiều rộng */
    white-space: nowrap; /* Không xuống dòng */
    overflow: hidden; /* Ẩn phần nội dung bị tràn */
    text-overflow: ellipsis; /* Hiển thị dấu '...' khi bị tràn */
  }
}
</style>
