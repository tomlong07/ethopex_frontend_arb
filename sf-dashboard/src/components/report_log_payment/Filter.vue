<script setup lang="ts">
import { onMounted } from 'vue'
import RotateRightSolid from '@/assets/icons/RotateRightSolid.vue'
import useReportLogPayment from '@/store/useReportLogPayment'
import { DATE_RANGE } from '@/enum/report-v2'

// !! Refs

// !! Store
const store = useReportLogPayment()

// !! Lifecycle hook
onMounted(async () => {
  store.clearFilter()
  store.onSearchPublisher()
  store.fetchAccountManager()
  store.onUpdateReport()
})

const isAdmin = computed(() => {
  return (window as any).arb?.isAdmin?.() ?? false
})
</script>

<template>
  <div class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper">
    <div class="flex items-center flex-row flex-wrap gap-2">
      <DateRanger
        :defaultDateRange="store.dateRange"
        :defaultDate="[
          store.payload.filter.start_date,
          store.payload.filter.end_date,
        ]"
        :status="store"
        :smallPicker="true"
        classLabel="items-start"
        @updateDate="store.updateDate"
        @updateDateRange="store.updateDateRange"
        :enableDateRangeEmit="true"
        :enabledPresets="[
          DATE_RANGE.TODAY,
          DATE_RANGE.YESTERDAY,
          DATE_RANGE.LAST_3_DAYS,
          DATE_RANGE.LAST_7_DAYS,
          DATE_RANGE.LAST_14_DAYS,
          DATE_RANGE.LAST_30_DAYS,
          DATE_RANGE.THIS_MONTH,
          DATE_RANGE.LAST_MONTH,
          DATE_RANGE.FIRST_QUARTER,
          DATE_RANGE.SECOND_QUARTER,
          DATE_RANGE.THIRD_QUARTER,
          DATE_RANGE.FOURTH_QUARTER,
          DATE_RANGE.LAST_3_MONTHS,
          DATE_RANGE.ALL_TIME,
        ]"
        ref="dateRangerComp"
      />

      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs font-bold h-6 text-gray-500">Publisher</div>
        <n-select
          v-model:value="store.payload.filter.user_id"
          filterable
          placeholder="All"
          :loading="store.isPublisherLoading"
          :options="store.publisherOptions"
          @search="store.onSearchPublisher"
          size="small"
          max-tag-count="responsive"
          clearable
          multiple
          :consistent-menu-width="false"
        />
      </div>

      <div class="flex flex-col gap-1 w-40" v-if="isAdmin">
        <div class="text-xs font-bold h-6 text-gray-500">Account Manager</div>
        <n-select
          v-model:value="store.payload.filter.account_manager"
          filterable
          placeholder="All"
          :loading="store.isAccountManagerLoading"
          :options="store.accountManagerOptions"
          size="small"
          max-tag-count="responsive"
          clearable
          :consistent-menu-width="false"
          multiple
        />
      </div>

      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs font-bold h-6 text-gray-500">Type</div>
        <n-select
          v-model:value="store.payload.filter.type"
          filterable
          :options="store.typeSelectOptions"
          :consistent-menu-width="false"
          size="small"
          max-tag-count="responsive"
          clearable
          :placeholder="'All'"
          multiple
        />
      </div>
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <n-button
        size="small"
        color="#f43f5e"
        :loading="store.isFetchingReport"
        @click="store.onUpdateReport"
      >
        <template #icon>
          <n-icon size="16">
            <RotateRightSolid />
          </n-icon>
        </template>
        Update
      </n-button>
    </div>
  </div>
</template>
