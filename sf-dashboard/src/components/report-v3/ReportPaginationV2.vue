<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

defineProps<{
  tableIsLoading?: boolean
}>()

const pageCount = computed(() => {
  const total = reportStoreV2.reportDataV2?.recordsTotal || 0
  const size = reportStoreV2.size || 1
  return Math.max(1, Math.ceil(total / size))
})

//Không next page nếu order by dimension Khánh said 24/12/24
const isOrderByDimension = computed<boolean>(() => {
  if (reportStoreV2.sort.length > 0) {
    const field = reportStoreV2.sort[0].field
    return [
      'campaign_name',
      'section',
      'date',
      'publisher',
      'traffic_source',
      'demand_source',
      'account_supply_id',
      'traffic_source_acc_id',
      'account_demand_id',
      'layout_id',
      'keyword',
      'device',
      'landing_page_id',
      'ad_group_id',
      'ad_id',
      'ad_format',
      'domain',
      'link_type',
      'keyword_set_type',
      'label',
    ].includes(field)
  }

  return false
})

const changePage = (page: number) => {
  if (isOrderByDimension.value) {
    window.message.warning('Order by dimension only available with page 1')
    return
  }
  reportStoreV2.page = page
}
const changePageSize = (pageSize: number) => {
  reportStoreV2.size = pageSize
}
</script>

<template>
  <div class="flex items-center justify-end pt-4 pb-4">
    <div class="pr-2 custom-text-pagination-rp">
      <n-skeleton
        :width="100"
        :height="34"
        v-if="tableIsLoading"
        sharp
        round
        size="small"
      />

      <template v-else>
        {{
          `${
            reportStoreV2.reportDataV2?.recordsTotal
              ? new Intl.NumberFormat('en-US').format(
                  Number(reportStoreV2.reportDataV2.recordsTotal)
                )
              : 0
          } Items`
        }}
      </template>
    </div>

    <n-skeleton
      v-if="tableIsLoading"
      :width="150"
      :height="34"
      sharp
      round
      size="medium"
    />
    <n-pagination
      v-else
      v-model:page="reportStoreV2.page"
      v-model:page-size="reportStoreV2.size"
      show-size-picker
      :class="[{ 'disabled-page': isOrderByDimension }]"
      :page-count="pageCount"
      :page-sizes="[10, 50, 100, 200, 500]"
      :on-update:page="changePage"
      :on-update:page-size="changePageSize"
    />
    <!-- a -->
  </div>
</template>

<style lang="scss" scoped>
.disabled-page {
  .n-pagination-item {
    opacity: 0.5;
  }
}
.n-skeleton {
  border-radius: 6px !important;
}
</style>
