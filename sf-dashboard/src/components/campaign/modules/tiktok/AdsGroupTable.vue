<script setup lang="ts">
import {
  campaignTypeClass,
  StatusCampManager,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { ColDef, GridApi, themeAlpine } from 'ag-grid-community'

import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
import { ValDayparting } from '@/constants/campaign'

import AdsName from '@/components/campaign/cell/AdsName.vue'
import AdsBlock from '@/components/campaign/cell/AdsBlock.vue'
import ActionAdGroup from '@/components/campaign/cell/ActionAdGroup.vue'
import { TS } from '@/enum/campaign'

const AdGroupModal = defineAsyncComponent(
  () => import('@/components/campaign/modules/tiktok/AdGroupModal.vue')
)
const AdTableModal = defineAsyncComponent(
  () => import('@/components/campaign/modules/tiktok/AdTableModal.vue')
)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const columnDefs: ColDef[] = [
  {
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
  },
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.1,
    minWidth: 100,
  },
  {
    headerName: 'Name',
    field: 'name',
    cellRenderer: AdsName,
    flex: 0.3,
    minWidth: 250,
  },
  {
    headerName: 'On/Off',
    field: 'status',
    cellRenderer: AdsBlock,
    cellRendererParams: {
      id_campaign: props.campaign.id,
    },
    flex: 0.1,
    minWidth: 80,
  },
  {
    headerName: 'STATUS',
    field: 'status',
    flex: 0.1,
    minWidth: 100,
  },
  {
    headerName: 'BUDGET',
    field: 'budget',
    // cellRenderer: AdsStatus,
    flex: 0.1,
    minWidth: 100,
  },
  {
    headerName: 'CPC',
    field: 'cpc',
    flex: 0.1,
    minWidth: 100,
  },
  {
    headerName: 'ACTION',
    cellRenderer: ActionAdGroup,
    suppressSizeToFit: true,
    flex: 0.2,
    minWidth: 100,
  },
]

const rowData = computed(() => props.campaign.ad_groups || [])

const gridApi = ref<GridApi | null>(null)
const listSelected = ref<any[]>([])

const idsAdGroupSelected = computed<number[]>(() => {
  const result: number[] = []
  if (listSelected.value.length > 0) {
    listSelected.value.forEach((i: any) => {
      result.push(i.id)
    })
  }

  return result
})

const onGridReady = (params: any) => {
  gridApi.value = params.api
}

const onRowSelected = (event: any) => {
  if (gridApi.value) {
    listSelected.value = gridApi.value.getSelectedRows()

    if (!listSelected.value || !listSelected.value.length) return

    adGroupData.value = new campaignTypeClass(
      helper.clone(listSelected.value.at(-1))
    )
    //set vào để hiển thị đúng
    adGroupData.value.SetAPI()
    adGroupData.value.SetTrafficTiktok()
    adGroupData.value.type = props.campaign.type
    if (adGroupData.value.schedule?.type === 'all') {
      adGroupData.value.schedule.dayparting = ValDayparting
    }
  }
}
const adGroupData = ref<any>(new campaignTypeClass(TS.TIKTOK))
const hasModalEditAdGroup = computed(() => {
  return props.FreezeData.isEditPage() && props.campaign.IsAPI()
})
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <n-card title="Ads Group" class="card-flex-gap-4">
    <template #header-extra v-if="hasModalEditAdGroup">
      <div class="flex gap-2">
        <n-button
          type="info"
          @click="props.statusData.showModalAdsInfo = true"
          :disabled="!listSelected.length"
          >Ads</n-button
        >
        <n-button
          type="info"
          @click="props.statusData.showModalAdGroup = true"
          :disabled="!listSelected.length"
          >Edit</n-button
        >
      </div></template
    >
    <div class="w-full">
      <ag-grid-vue
        id="adgroupGrid"
        :theme="customTheme"
        :animate-rows="true"
        dom-layout="autoHeight"
        row-selection="multiple"
        :column-defs="columnDefs"
        :row-data="rowData"
        @grid-ready="onGridReady"
        @row-selected="onRowSelected"
      >
      </ag-grid-vue>
    </div>

    <AdGroupModal
      :campaign="campaign"
      :statusData="statusData"
      :adGroupData="adGroupData"
      :ids="idsAdGroupSelected"
      v-if="hasModalEditAdGroup"
    />

    <AdTableModal
      :statusData="statusData"
      :FreezeData="FreezeData"
      :adGroupData="adGroupData"
      v-if="hasModalEditAdGroup"
    />
  </n-card>
</template>
