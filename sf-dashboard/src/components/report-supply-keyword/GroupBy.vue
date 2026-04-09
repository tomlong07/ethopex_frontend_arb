<script setup lang="ts">
import useReportSupplyKeyword from "@/store/useReportSupplyKeyword";

// Store
const reportSupplyKeywordStore = useReportSupplyKeyword();
</script>

<template>
  <div class="flex p-2 mx-2 border-t border-gray-200">
    <div class="flex flex-row flex-1 justify-between">
      <div class="font-bold text-xs text-gray-500">
        <div class="flex font-bold text-xs items-center">
          Group By:
          <n-switch
            v-model:value="reportSupplyKeywordStore.isGroupBy"
            :disabled="reportSupplyKeywordStore.isFetchingReport"
            class="mx-2"
            size="small"
          >
          </n-switch>
        </div>
        <n-collapse-transition :show="reportSupplyKeywordStore.isGroupBy">
          <div class="flex w-full mt-3">
            <n-checkbox-group
              v-model:value="reportSupplyKeywordStore.listGroupByColumnAccepted"
              class="flex gap-2 flex-col"
            >
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(o, i) in reportSupplyKeywordStore.groupByColumn"
                  :key="i"
                  class="w-40"
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
                    <span v-html="o.headerTooltip" class="text-xs text-gray-500"></span>
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
