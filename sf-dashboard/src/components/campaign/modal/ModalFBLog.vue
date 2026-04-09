<script lang="ts" setup>
import { useLogCampFB } from '@/store/logCampFBStore'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import DateAndTime from './cell/DateAndTime.vue'
import ChangeBy from './cell/ChangeBy.vue'
import ExtraData from './cell/ExtraData.vue'
import Activity from './cell/Activity.vue'
import ActivityDetailsV2 from './cell/ActivityDetailsV2.vue'
import RefreshIcon from '@/assets/icons/RefreshIcon.vue'
import { themeAlpine } from 'ag-grid-community'

const logCampFBStore = useLogCampFB()
const isMobile = helper.mobileDetect()

const gridOptions = computed(() => {
  return {
    suppressMovableColumns: isMobile,
  }
})

const defaultColDef = computed(() => {
  return {
    resizable: !isMobile,
    minWidth: 150,
  }
})

const columnDefs = computed(() => {
  let cols: any[] = [
    {
      headerName: 'Activity',
      field: 'activity',
      flex: 0.1,
      minWidth: 200,
      cellRenderer: Activity,
      autoHeight: true,
    },
    {
      headerName: 'Activity details',
      field: 'activity_details',
      flex: 0.1,
      minWidth: 500,
      cellRenderer: ActivityDetailsV2,
      autoHeight: true,
      getQuickFilterText: (params: any) => {
        //set cái này để search 2 trường kia
        const data = params.data
        if (!data) return ''
        try {
          return `${data.extra_data} ${JSON.stringify(data.extra_data_handle)}`
        } catch {
          return ''
        }
      },
    },

    {
      headerName: 'Type',
      field: 'object_type',
      flex: 0.1,
      minWidth: 180,
    },

    {
      headerName: 'Change by',
      field: 'actor_name',
      flex: 0.1,
      minWidth: 200,
      cellRenderer: ChangeBy,
      autoHeight: true,
    },
  ]

  cols.push({
    headerName: 'Date and time',
    field: 'date_time_in_timezone',
    minWidth: 230,
    flex: 0.1,
    cellRenderer: DateAndTime,
  })

  if (window.arb.isDev()) {
    cols = cols.concat([
      {
        headerName: 'extra_data',
        field: 'extra_data',
        flex: 0.1,
        minWidth: 800,
      },
      {
        headerName: 'extra_data_handle',
        field: 'extra_data_handle',
        flex: 0.2,
        minWidth: 800,
        cellRenderer: ExtraData,
      },
    ])
  }

  return cols
})

const onGridReady = (params: any) => {
  logCampFBStore.gridApi = params.api
}

const onFilterTextBoxChanged = () => {
  if (logCampFBStore.gridApi) {
    logCampFBStore.gridApi?.setGridOption(
      'quickFilterText',
      logCampFBStore.search
    )
  }
}

watch(
  () => logCampFBStore.showModal,
  (newVal) => {
    if (newVal) {
      logCampFBStore.resetData()

      logCampFBStore.getLogCampaignFB()
    }
  },
  { immediate: true }
)
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <n-modal
    id="log-camp-fb-modal"
    v-model:show="logCampFBStore.showModal"
    preset="card"
    size="huge"
    :style="{ width: '95vw', height: '90vh' }"
    :bordered="false"
    :segmented="{ content: 'soft', footer: 'soft' }"
  >
    <template #header
      ><div class="flex gap-2">
        Facebook Logs
        <n-popover trigger="hover" :show-arrow="false">
          <template #trigger>
            <n-button text @click="logCampFBStore.getLogCampaignFB()">
              <n-icon size="24"><RefreshIcon /></n-icon
            ></n-button>
          </template>
          Refresh Log
        </n-popover>
      </div></template
    >
    <n-spin
      :show="logCampFBStore.isLoading"
      content-class="flex flex-col gap-2"
    >
      <n-input
        v-model:value="logCampFBStore.search"
        placeholder="Search..."
        :on-input="() => onFilterTextBoxChanged()"
      ></n-input>
      <div class="h-full flex-1 overflow-hidden">
        <ag-grid-vue
          style="scrollbar-width: thin"
          id="log-camp-fb-grid"
          :theme="customTheme"
          class="w-full h-[calc(90vh-170px)]"
          :animate-rows="true"
          dom-layout="normal"
          :grid-options="gridOptions"
          :column-defs="columnDefs"
          :row-data="logCampFBStore.data"
          :default-col-def="defaultColDef"
          :enable-cell-text-selection="true"
          @grid-ready="onGridReady"
        />
      </div>
    </n-spin>
  </n-modal>
</template>

<style lang="scss">
#log-camp-fb-modal {
  .n-card__content {
    border: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
#log-camp-fb-grid {
  // .ag-root-wrapper {
  //   min-height: 24rem;
  // }

  .ag-cell {
    height: auto;
  }

  // Scroll dọc
  .ag-body-vertical-scroll,
  .ag-body-vertical-scroll-viewport,
  .ag-body-vertical-scroll-container {
    width: 6px !important;
    max-width: 6px !important;
    min-width: 6px !important;
  }
}
</style>
