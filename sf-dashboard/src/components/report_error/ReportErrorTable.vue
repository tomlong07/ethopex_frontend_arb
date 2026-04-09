<script setup lang="ts">
import { useReportError } from '@/store/report-error'

interface TableConfig {
  target_dimension: string
  name: string
  columns: any[]
}

const reportErrorStore = useReportError()

const selectedTables = computed(
  () => reportErrorStore.reportParams.defaultDemension || []
)

const formatNumber = (value: number | string, isRate: boolean = false) => {
  if (value === null || value === undefined) return '-'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return value

  if (isRate) {
    return num.toFixed(2) + '%'
  }

  return num.toLocaleString()
}
const createNameColumn = (title: string) => ({
  title,
  key: 'name',
  width: 200,
  ellipsis: {
    tooltip: true,
  },
  render: (row: any) => {
    const fullText = row.name || '-'
    if (fullText === '-' || fullText.length === 0) return fullText
    if (fullText.charAt(0) !== fullText.charAt(0).toUpperCase()) {
      return fullText.charAt(0).toUpperCase() + fullText.slice(1)
    }
    return fullText
  },
})

const createNumberColumn = (
  title: string,
  key: string,
  isRate: boolean = false
) => ({
  title,
  key,
  width: 100,
  align: 'right' as const,
  render: (row: any) => {
    return formatNumber(row[key], isRate)
  },
})

const tableConfigs: Record<string, TableConfig> = {
  landing_page: {
    target_dimension: 'landing_page',
    name: 'Landing Page',
    columns: [
      createNameColumn('Name'),
      createNumberColumn('Error 1', 'error_page_1'),
      createNumberColumn('Error 2', 'error_page_2'),
      createNumberColumn('Rate error page 1', 'rate_error_page_1', true),
      createNumberColumn('Rate error page 2', 'rate_error_page_2', true),
    ],
  },
  domain: {
    target_dimension: 'domain',
    name: 'Domain',
    columns: [
      createNameColumn('Name'),
      createNumberColumn('Error 1', 'error_page_1'),
      createNumberColumn('Error 2', 'error_page_2'),
      createNumberColumn('Rate error page 1', 'rate_error_page_1', true),
      createNumberColumn('Rate error page 2', 'rate_error_page_2', true),
    ],
  },
  country: {
    target_dimension: 'country',
    name: 'Country',
    columns: [
      createNameColumn('Name'),
      createNumberColumn('Error 1', 'error_page_1'),
      createNumberColumn('Error 2', 'error_page_2'),
      createNumberColumn('Rate error page 1', 'rate_error_page_1', true),
      createNumberColumn('Rate error page 2', 'rate_error_page_2', true),
    ],
  },
  campaign: {
    target_dimension: 'campaign',
    name: 'Campaign',
    columns: [
      createNameColumn('Name'),
      createNumberColumn('Error 1', 'error_page_1'),
      createNumberColumn('Error 2', 'error_page_2'),
      createNumberColumn('Rate error page 1', 'rate_error_page_1', true),
      createNumberColumn('Rate error page 2', 'rate_error_page_2', true),
    ],
  },
  category: {
    target_dimension: 'category',
    name: 'Category',
    columns: [
      createNameColumn('Name'),
      createNumberColumn('Error 1', 'error_page_1'),
      createNumberColumn('Error 2', 'error_page_2'),
      createNumberColumn('Rate error page 1', 'rate_error_page_1', true),
      createNumberColumn('Rate error page 2', 'rate_error_page_2', true),
    ],
  },
  traffic_source: {
    target_dimension: 'traffic_source',
    name: 'Traffic Source',
    columns: [
      createNameColumn('Name'),
      createNumberColumn('Error 1', 'error_page_1'),
      createNumberColumn('Error 2', 'error_page_2'),
      createNumberColumn('Rate error page 1', 'rate_error_page_1', true),
      createNumberColumn('Rate error page 2', 'rate_error_page_2', true),
    ],
  },
}

const visibleTables = ref<TableConfig[]>([])

const updateVisibleTables = () => {
  visibleTables.value = selectedTables.value
    .map((dimension) => tableConfigs[dimension])
    .filter(Boolean)
}

const fetchAllDataParallel = async () => {
  const dimensions = reportErrorStore.reportParams.defaultDemension || []

  if (dimensions.length === 0) return

  // Tạo array các promise để call song song
  const tablePromises = dimensions.map((dimension) =>
    reportErrorStore.fetcheTableData(dimension)
  )

  // Chạy tất cả song song, không cần đợi nhau
  Promise.allSettled(tablePromises)
}

onMounted(async () => {
  if (reportErrorStore.isBothView || reportErrorStore.isTableView) {
    updateVisibleTables()
    await fetchAllDataParallel()
  }
})

watch(
  () => reportErrorStore.updateClicked,
  async (isFetching) => {
    if (!isFetching) return
    reportErrorStore.isFetchingTableUpdate = true
    if (reportErrorStore.isBothView || reportErrorStore.isTableView) {
      updateVisibleTables()
      await fetchAllDataParallel()
    }
    reportErrorStore.isFetchingTableUpdate = false
  }
)

const getGridClasses = () => {
  const width = reportErrorStore.reportSettingErr.widthOfTable

  switch (width) {
    case 100:
      return 'grid grid-cols-1'
    case 50:
      return 'grid grid-cols-1 lg:grid-cols-2'
    case 33:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    case 25:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    default:
      return 'grid grid-cols-1 lg:grid-cols-2'
  }
}
</script>

<template>
  <div class="gap-2 mt-2 mb-4" :class="getGridClasses()">
    <n-card
      v-for="tableConfig in visibleTables"
      :key="tableConfig.target_dimension"
      :title="tableConfig.name"
      class="min-h-0"
    >
      <template
        v-if="
          reportErrorStore.loadingTables.includes(tableConfig.target_dimension)
        "
      >
        <div class="flex justify-center items-center py-20">
          <n-spin size="large" />
        </div>
      </template>
      <template v-else>
        <n-data-table
          :columns="tableConfig.columns"
          :data="
            reportErrorStore.tableDataCache[tableConfig.target_dimension] || []
          "
          striped
          size="small"
          class="compact-table"
          :scroll-x="600"
        />
      </template>
    </n-card>
  </div>
</template>
<style scoped>
.compact-table :deep(.n-data-table-td) {
  padding-left: 16px !important;
  padding-right: 16px !important;
  font-size: 13px !important;
}

.compact-table :deep(.n-data-table-th) {
  padding-left: 16px !important;
  padding-right: 16px !important;
  font-size: 13px !important;
}

/* Giảm khoảng cách giữa các cột */
.compact-table :deep(.n-data-table-td + .n-data-table-td) {
  border-left: none !important;
}

.compact-table :deep(.n-data-table-th + .n-data-table-th) {
  border-left: none !important;
}

/* Đảm bảo table responsive và không có scroll ngang */
.compact-table {
  width: 100%;
  overflow: visible;
}

.compact-table :deep(.n-data-table) {
  width: 100% !important;
}
</style>
