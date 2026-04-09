<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import RefreshIcon from '@/assets/icons/RefreshIcon.vue'
import MagicIcon from '@/assets/icons/MagicIcon.vue'
import { themeAlpine } from 'ag-grid-community'

const useGooglePerformanceRule = GooglePerformanceRule()

const searchText = ref<string>('')

const currentPage = ref(1)
const currentPageSize = ref(50)

// State cho tooltip
const showTooltip = ref(false)
const tooltipContent = ref('')
const tooltipPosition = ref({ top: 0, left: 0 })

let debounceTimeout: number | undefined

const handlePageChange = async () => await loadData()
const handlePageSizeChange = async () => {
  currentPage.value = 1
  await loadData()
}

const loadData = async () => {
  const id = useGooglePerformanceRule.currentRuleId
  const status = useGooglePerformanceRule.statusRuleId
  if (id && status) {
    await useGooglePerformanceRule.satisfyRule(id, status, {
      page: currentPage.value,
      limit: currentPageSize.value,
      search: searchText.value,
    })
  }
}

const handleUpdate = async (isSearch = false) => {
  // isSearch = false thì sẽ k cần debounce khi ấn Refresh
  if (isSearch) {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = window.setTimeout(async () => {
      currentPage.value = 1
      await loadData() // debounce 700 giây khi search
    }, 700)
  } else {
    await loadData()
  }
}

// Xử lý tooltip
const showLogTooltip = (event: MouseEvent, content: string) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  tooltipPosition.value = {
    top: rect.bottom + -10,
    left: rect.left,
  }
  tooltipContent.value = content
  showTooltip.value = true
}

const hideLogTooltip = () => {
  showTooltip.value = false
  tooltipContent.value = ''
}

// Setup event listeners cho tooltip
onMounted(() => {
  const handleMouseEvents = () => {
    // Sử dụng event delegation
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement
      if (target.classList.contains('log-cell-content')) {
        const fullLog = target.getAttribute('data-full-log')
        if (fullLog && fullLog.length > 50) {
          showLogTooltip(event, fullLog)
        }
      }
    })

    document.addEventListener('mouseout', (event) => {
      const target = event.target as HTMLElement
      if (target.classList.contains('log-cell-content')) {
        setTimeout(() => {
          hideLogTooltip()
        }, 100) // Delay nhỏ để tránh flicker
      }
    })
  }

  nextTick(() => {
    handleMouseEvents()
  })
})

const genderType = (type: string) => {
  if (type == 'new') {
    return 'info'
  } else if (type == 'pending') {
    return 'warning'
  } else if (type == 'error') {
    return 'error'
  } else if (type == 'done') {
    return 'success'
  } else if (type == 'running') {
    return 'warning'
  } else {
    return 'info'
  }
}

const allColumns = [
  { headerName: 'ID', field: 'id', width: 100, hide: false, filter: false },
  {
    headerName: 'Placement',
    field: 'domain',
    width: 200,
    hide: false,
    filter: false,
    cellRenderer: (params: any) => {
      if (!params.value) return ''
      return `<a href="https://${params.value}" target="_blank" class="no-underline text-blue-500 underline">${params.value}</a>`
    },
  },
  {
    headerName: 'Placement Status',
    field: 'placement_status',
    width: 200,
    hide: false,
    filter: false,
  },
  {
    headerName: 'Log',
    field: 'log',
    flex: 1,
    hide: false,
    filter: false,
    cellRenderer: (params: any) => {
      if (!params.value) return ''
      // Hiển thị 1 dòng đầu tiên và thêm ... nếu có nhiều dòng
      const firstLine = params.value.split('\n')[0]
      const maxLength = 50
      const displayText =
        firstLine.length > maxLength
          ? firstLine.substring(0, maxLength) + '...'
          : firstLine

      const cellId = `log-cell-${params.node.id || params.rowIndex}`

      return `
        <div 
          id="${cellId}"
          class="log-cell-content" 
          style="
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            padding: 4px;
            height: 100%;
          "
          data-full-log="${params.value
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')}"
        >
          ${displayText}
        </div>
      `
    },
    cellStyle: {
      padding: '0',
      height: 'auto',
    },
  },
  {
    headerName: 'Impression',
    field: 'impression',
    width: 120,
    hide: false,
    filter: false,
  },
  {
    headerName: 'Created At',
    field: 'created_at',
    width: 200,
    hide: false,
    filter: false,
  },
  {
    headerName: 'Updated At',
    field: 'updated_at',
    width: 200,
    hide: false,
    filter: false,
  },
]

const columnVisibility = reactive({
  id: true,
  domain: true,
  placement_status: true,
  log: true,
  impression: true,
  created_at: true,
  updated_at: true,
})
const columnDefs = computed(() =>
  allColumns.map((col) => ({
    ...col,
    hide: !columnVisibility[col.field as keyof typeof columnVisibility],
  }))
)

const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  autoHeight: true,
}
const customThemes = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <n-modal
    v-model:show="useGooglePerformanceRule.showSatisfyModal"
    :mask-closable="true"
    preset="card"
    :closable="true"
    style="max-width: 95vw; overflow-x: hidden"
    :style="{ 'max-height': '95vh' }"
    :bordered="false"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-xl font-semibold">
          Satisfy Rule Results (Rule id:
          {{ useGooglePerformanceRule.currentRuleId }})

          <n-tag
            class="n-tag-exclude"
            :bordered="false"
            :type="genderType(useGooglePerformanceRule.statusRuleId)"
            size="medium"
          >
            {{ useGooglePerformanceRule.statusRuleId }}
          </n-tag>
        </h2>
      </div>
    </template>

    <!-- Loading cho toàn bộ modal -->
    <n-spin
      :show="useGooglePerformanceRule.isSatisfyLoading"
      style="min-height: 500px"
    >
      <div class="flex flex-col" style="height: 80vh">
        <!-- Stats Cards -->
        <div
          class="flex items-center justify-between gap-4 mb-6 bg-[#F3F4F6] border p-4"
          v-if="useGooglePerformanceRule.satisfyData"
        >
          <div class="flex flex-wrap items-center gap-4">
            <n-tag
              class="n-tag-exclude"
              :bordered="false"
              type="info"
              size="medium"
            >
              Total: {{ useGooglePerformanceRule.satisfyData.total || '0' }}
            </n-tag>
            <n-tag
              class="n-tag-exclude"
              :bordered="false"
              type="warning"
              size="medium"
            >
              Pending:
              {{ useGooglePerformanceRule.satisfyData.total_pending || '0' }}
            </n-tag>
            <n-tag
              :bordered="false"
              class="bg-[#ebddff] text-[#4c1d95] n-tag-exclude"
              size="medium"
            >
              Scanned:
              {{ useGooglePerformanceRule.satisfyData.total_scanned || '0' }}
            </n-tag>
            <!-- <n-tag class="n-tag-exclude" :bordered="false" type="warning" size="medium">
              Running:
              {{ useGooglePerformanceRule.satisfyData.total_running || '0' }}
            </n-tag> -->
            <n-tag
              class="n-tag-exclude"
              :bordered="false"
              type="error"
              size="medium"
            >
              Error:
              {{ useGooglePerformanceRule.satisfyData.total_error || '0' }}
            </n-tag>
            <n-tag
              class="n-tag-exclude"
              :bordered="false"
              type="success"
              size="medium"
            >
              Match:
              {{ useGooglePerformanceRule.satisfyData.total_success || '0' }}
            </n-tag>
          </div>
          <div class="flex items-center gap-2">
            <n-button type="primary" ghost @click="handleUpdate(false)">
              <template #icon><n-icon :component="RefreshIcon" /></template>
              Refresh
            </n-button>

            <n-popconfirm
              v-if="useGooglePerformanceRule.currentRuleId"
              positive-text="Apply!"
              @positive-click="
                useGooglePerformanceRule.applyRule(
                  useGooglePerformanceRule.currentRuleId
                )
              "
            >
              <template #trigger>
                <n-button type="warning" @click="">
                  <template #icon><n-icon :component="MagicIcon" /></template>
                  Apply Rule
                </n-button>
              </template>
              Google Performance Rule - Confirm to Apply Rule
            </n-popconfirm>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex justify-end -mt-[24px] bg-[#F3F4F6] border border-b-0 border-t-0 p-4"
        >
          <div class="flex gap-2">
            <n-input
              v-model:value="searchText"
              placeholder="Search..."
              clearable
              @input="handleUpdate(true)"
              style="width: 250px"
            />
          </div>
        </div>
        <!-- Table -->
        <div class="p-4 border bg-[#F3F4F6] text-sm text-gray-600">
          Columns:
          <n-checkbox v-model:checked="columnVisibility.id" class="ml-2"
            >Id</n-checkbox
          >
          <n-checkbox v-model:checked="columnVisibility.domain" class="ml-2"
            >Placement</n-checkbox
          >
          <n-checkbox
            v-model:checked="columnVisibility.placement_status"
            class="ml-2"
            >Placement Status</n-checkbox
          >
          <n-checkbox v-model:checked="columnVisibility.impression" class="ml-2"
            >Impression</n-checkbox
          >
          <n-checkbox v-model:checked="columnVisibility.created_at" class="ml-2"
            >Created At</n-checkbox
          >
          <n-checkbox v-model:checked="columnVisibility.updated_at" class="ml-2"
            >Updated At</n-checkbox
          >
        </div>

        <!-- AG-Grid Table -->
        <!-- Wrapper cần fixed chiều cao + overflow -->
        <div class="ag-grid-wrapper">
          <ag-grid-vue
            class="ag-grid-full"
            :theme="customThemes"
            :columnDefs="columnDefs"
            :rowData="useGooglePerformanceRule.satisfyData?.items || []"
            :defaultColDef="defaultColDef"
            :pagination="false"
            :suppressPaginationPanel="true"
            :rowSelection="'single'"
            :domLayout="'normal'"
            :alwaysShowHorizontalScroll="false"
          ></ag-grid-vue>

          <div
            v-if="
              !useGooglePerformanceRule.satisfyData?.items?.length &&
              !useGooglePerformanceRule.isSatisfyLoading
            "
            class="p-4 text-center text-gray-500"
          >
            No Rows To Show
          </div>
        </div>

        <!-- Pagination -->
        <div class="p-4 border-t flex justify-end">
          <n-pagination
            v-model:page="currentPage"
            v-model:page-size="currentPageSize"
            :item-count="
              useGooglePerformanceRule.satisfyData?.total_success || 0
            "
            :page-sizes="[10, 20, 50, 100]"
            show-size-picker
            show-quick-jumper
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </div>
    </n-spin>

    <!-- Log Tooltip -->
    <teleport to="body">
      <div
        v-if="showTooltip"
        class="log-tooltip"
        :style="{
          position: 'fixed',
          top: tooltipPosition.top + 'px',
          left: tooltipPosition.left + 'px',
          zIndex: 10000,
          background: 'white',
          color: '#333',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '12px',
          maxWidth: '450px',
          maxHeight: '200px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.4',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none',
          wordBreak: 'break-word',
        }"
      >
        {{ tooltipContent }}
      </div>
    </teleport>
  </n-modal>
</template>

<style scoped>
.ag-grid-wrapper {
  height: 100%; /* Bắt buộc */
  width: 100%; /* Bắt buộc */
  overflow: hidden; /* Quan trọng để không tràn ngoài */
  position: relative;
}

.ag-grid-full {
  height: 100%;
  width: 100%;
}

:deep(.ag-theme-alpine) {
  --ag-header-background-color: #f3f4f6;
  --ag-odd-row-background-color: #fafafa;
}
</style>
