<script setup lang="ts">
import { computed } from 'vue'
import useReportTopList from '@/store/useReportTopList'
import SkeletonSelect from '../common/SkeletonSelect.vue'

const reportTopListStore = useReportTopList()

const selectedCount = computed(
  () => reportTopListStore.reportConditions.group_by?.length || 0
)

// Hàm check disabled
const isDisabled = (value: string | any) => {
  return (
    selectedCount.value >= 3 &&
    !reportTopListStore.reportConditions.group_by?.includes(value)
  )
}
const handleChangeGroup = () => {
  reportTopListStore.buildQuery()
}
</script>

<template>
  <div class="flex p-2 mx-2 border-t border-gray-200">
    <div class="flex flex-row flex-1 justify-between">
      <div class="dimension">
        <div class="flex gap-3 items-center h-[30px]">
          <div class="flex font-bold text-xs text-gray-500 items-center">
            Dimension:
            <n-switch
              v-model:value="reportTopListStore.showCard.dimension"
              :disabled="reportTopListStore.isFetchingReport"
              class="mx-2"
              size="small"
            />
          </div>
          <n-tag v-if="selectedCount >= 3" type="info" class="text-xs">
            You can only select up to 3 dimensions.
          </n-tag>
        </div>

        <n-collapse-transition :show="reportTopListStore.showCard.dimension">
          <div
            v-if="reportTopListStore.isFetchingCol"
            class="flex flex-wrap gap-2"
          >
            <SkeletonSelect
              class="w-40"
              size="small"
              v-for="(_, index) in Array(7)"
              :key="index"
            />
          </div>

          <div class="flex w-full mt-3" v-else>
            <n-checkbox-group
              v-if="reportTopListStore.reportConditions"
              v-model:value="reportTopListStore.reportConditions.group_by"
              @update:value="handleChangeGroup"
              class="flex gap-2 flex-col"
            >
              <div class="flex flex-wrap items-center gap-2">
                <div
                  v-for="(o, i) in reportTopListStore.GroupByReport"
                  :key="i"
                  class="w-36 text-xs"
                >
                  <n-checkbox
                    size="small"
                    :value="o.key"
                    :label="o.title"
                    class="column-wrapper-checkbox"
                    :disabled="isDisabled(o.key)"
                    :class="o.IsRealTime() ? 'blink' : ''"
                  />
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
