<script setup lang="ts">
import { computed } from 'vue'
import SkeletonTable from '../template-v2/skeleton/SkeletonTable.vue'
import useReportLogPayment from '@/store/useReportLogPayment'
import helper from '@/utils/helper'
import useGeneralStore from '@/store/useGeneralStore'

const store = useReportLogPayment()
const generalStore = useGeneralStore()

const displayGroups = computed(() => {
  if (!store.dataReport || store.dataReport.length === 0) {
    return [
      {
        month: 'No data',
        transactions: [],
      },
    ]
  }
  return store.dataReport
})
const isDark = computed(() => generalStore.isDark)
</script>

<template>
  <SkeletonTable v-if="store.isFetchingReport" />

  <div class="relative w-full space-y-4" v-else>
    <div
      v-for="group in displayGroups"
      :key="group.month"
      class="border rounded-lg overflow-hidden bg-card"
    >
      <div class="px-4 py-3 text-lg font-bold border-b bg-white">
        {{ group.month }}
      </div>

      <div
        class="px-4 py-3 text-sm font-semibold border-b bg-white text-right"
        v-if="group.balance"
      >
        Ending balance: {{ helper.formatCurrencyV2(group.balance, 2) }}
      </div>

      <n-table table-layout="fixed" :class="{ 'table-light-header': !isDark }">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 60%" />
          <col style="width: 20%" />
        </colgroup>

        <thead class="text-xs uppercase">
          <tr>
            <th class="text-left !text-gray-400">Date</th>
            <th class="text-left !text-gray-400">Description</th>
            <th style="text-align: right" class="!text-gray-400">
              Amount (USD)
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="group.transactions.length">
            <tr
              v-for="(item, index) in group.transactions"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="text-xs font-medium text-gray-500">
                {{ item.date }}
              </td>
              <td class="text-xs font-medium truncate">
                {{ item.description }}
              </td>
              <td class="text-xs text-right font-medium">
                {{ helper.formatCurrencyV2(item.amount, 2) }}
              </td>
            </tr>
          </template>

          <tr v-else>
            <td colspan="3" class="text-center text-gray-400 py-10">
              No data available
            </td>
          </tr>
        </tbody>
      </n-table>
      <div
        class="px-4 py-3 text-sm font-semibold border-b bg-white text-right"
        v-if="group.start_balance"
      >
        Starting balance: {{ helper.formatCurrencyV2(group.start_balance, 2) }}
      </div>
    </div>
    <div class="flex justify-end items-center bg-card py-3 px-4">
      <n-pagination
        v-model:page="store.payload.page"
        v-model:page-size="store.payload.size"
        :page-count="store.pageCount"
        show-size-picker
        :page-sizes="[10, 20, 50, 100]"
        @update:page="store.handlePageChange"
        @update:page-size="store.handlePageSizeChange"
      />
    </div>
  </div>
</template>
<style lang="css" scoped>
.table-light-header :deep(th) {
  background: white !important;
}
</style>
