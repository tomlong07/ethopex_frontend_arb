<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import { ctr_campaign } from '@/services/ctr_campaign'
import { ColumnItem } from '@/types/state/general'
import {
  AutoSizeStrategy,
  ColDef,
  ICellRendererParams,
  RowSelectionOptions,
  SortDirection,
  themeAlpine,
} from 'ag-grid-community'
import { NIcon, NSwitch, NPopover, NButton } from 'naive-ui'

import Close from '@/assets/icons/Close.vue'

import Checkmark from '@/assets/icons/Checkmark.vue'
import { railStyle } from '@/utils/styleHelper'

import date2 from '@/utils/date2'
import { ctr_abtest } from '@/services/ctr_abtest'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import StatusAB58 from '@/components/ab_test/cell/StatusAB58.vue'
import LinkFromAPI from './LinkFromAPI.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },

  offIcon: {
    type: Boolean,
    default: false,
  },
})

const status = ref(props.params.data.ab_test_domain || 'off')
const loading = ref(false)

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''

const changeStatusABTestDomain = async (newValue: string) => {
  loading.value = true

  await helper.sleep(500)
  const result = await ctr_campaign.ChangeStatusABTestDomain(urlAction, {
    campaign_ids: [props.params.data.id],
    status: newValue,
  })

  if (result.status) {
    status.value = newValue

    window.message.success('Success!')

    props.params.data.ab_test_domain = newValue
  }

  loading.value = false
}

const loadingABLogs = ref(false)

const data = ref<any[]>([])

const fetchABLogs = async () => {
  loadingABLogs.value = true
  const payload = {
    filter: {
      campaigns: [props.params.data.id],
      domains: [],
      adsenses: [],
      status: [],
      start_date: '2022-01-01',
      end_date: date2.today('UTC'),
    },
    columns: [
      'campaign_id',
      'domain',
      'status',
      'current_traffics',
      'rpm',
      'revenue',
      'conversions',
      'rpc',
      'pub_id',
      'ab_test_start_date',
      'ab_test_end_date',
      'ab_test_traffics',
      'created_at',
      'id',
    ],
    page: 1,
    size: 50,
    search: '',
    customFilter: {},
    sort: [
      {
        field: 'created_at',
        dir: 'desc',
      },
    ],
  }

  const result = await ctr_abtest.ABTestElasticSearch(payload)

  data.value = result.data?.items || []

  loadingABLogs.value = false
}

const columnDefs: ColDef<any>[] = [
  {
    field: 'domain',
    headerName: 'Domain',
    minWidth: 120,
    cellRenderer: LinkFromAPI,
    cellRendererParams: {
      columnConfig: { link: 'http' },
    },
  },

  {
    field: 'status',

    headerName: 'Status',
    minWidth: 120,
    cellRenderer: StatusAB58,
    cellRendererParams: {
      classPlus: 'mini-font',
    },
  },
  {
    field: 'current_traffics',
    headerName: 'SV Requests',
    minWidth: 110,
    type: 'rightAligned',
    valueFormatter: (params: any) => {
      return helper.numberTranform(params.value || 0) as string
    },
  },
  {
    field: 'rpm',
    headerName: 'RPM',
    minWidth: 60,
    type: 'rightAligned',
    valueFormatter: (params: any) => {
      return helper.currencyFormatterAuto3(params.value || 0)
    },
  },
  {
    field: 'revenue',
    headerName: 'Revenue',
    minWidth: 90,
    type: 'rightAligned',
    valueFormatter: (params: any) => {
      return helper.currencyFormatterAuto3(params.value || 0)
    },
  },
  {
    field: 'conversions',
    headerName: 'Conversions',
    minWidth: 110,
    type: 'rightAligned',
    valueFormatter: (params: any) => {
      return helper.numberTranform(params.value || 0) as string
    },
  },
  {
    field: 'rpc',
    headerName: 'RPC',
    minWidth: 60,
    type: 'rightAligned',
    valueFormatter: (params: any) => {
      return helper.currencyFormatterAuto3(params.value || 0)
    },
  },

  {
    field: 'show_name',
    headerName: 'Adsense',
    minWidth: 100,
    cellRenderer: LinkFromAPI,
    cellRendererParams: {
      columnConfig: { link: '/demand-account/{{adsense_id}}' },
    },
  },
]

const defaultColDef = {
  // set every column width
  minWidth: 50,
  resizable: true,
  sortingOrder: ['desc', 'asc'] as SortDirection[],
}
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'multiRow',
  checkboxes: false,
  headerCheckbox: false,
})
const autoSizeStrategy = ref<AutoSizeStrategy>({
  type: 'fitGridWidth',
  defaultMinWidth: 100,
})
</script>
<template>
  <div class="cursor-pointer flex items-center gap-2 cell-status">
    <n-switch
      v-model:value="status"
      checked-value="on"
      unchecked-value="off"
      :loading="loading"
      :rail-style="railStyle"
      :on-update:value="changeStatusABTestDomain"
    >
      <template #checked-icon v-if="!offIcon">
        <n-icon :component="Checkmark" color="#121212" />
      </template>
      <template #unchecked-icon v-if="!offIcon">
        <n-icon :component="Close" />
      </template>
    </n-switch>

    <n-popover
      trigger="hover"
      @update:show="(show:boolean) => show && fetchABLogs()"
      raw
      :show-arrow="false"
      class="popover-abtest-812"
    >
      <template #trigger>
        <n-button text>
          <template #icon>
            <n-icon :component="InformationCircleOutline" size="16" />
          </template>
        </n-button>
      </template>
      <div class="p-2 bg-white rounded-xl w-[820px] h-[150px] overflow-hidden">
        <div
          v-if="loadingABLogs"
          class="flex items-center justify-center h-full text-gray-500 text-xxs"
        >
          Loading...
        </div>

        <div v-else-if="data" class="w-full h-full">
          <ag-grid-vue
            :rowSelection="rowSelection"
            class="w-full h-full mini-font"
            :theme="customTheme"
            :animate-rows="true"
            dom-layout="normal"
            :column-defs="columnDefs"
            :row-data="data"
            :default-col-def="defaultColDef"
            :enable-cell-text-selection="true"
            :server-side-sorting="false"
            :suppress-multi-sort="true"
            :pagination="true"
            :suppress-pagination-panel="true"
            :rowHeight="30"
            :headerHeight="30"
            :autoSizeStrategy="autoSizeStrategy"
          />
        </div>

        <div
          v-else
          class="flex items-center justify-center h-full text-gray-400 text-xxs"
        >
          Data Not Found
        </div>
      </div>
    </n-popover>
  </div>
</template>

<style lang="scss">
.popover-abtest-812 {
  border-radius: 0.75rem;
}

.ag-theme-alpine.mini-font {
  .ag-header-row,
  .ag-row,
  .n-tag {
    font-size: 11px !important;
  }

  .ag-cell {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}

.mini-font {
  .n-popover__content {
    font-size: 11px !important;
  }
}
</style>
