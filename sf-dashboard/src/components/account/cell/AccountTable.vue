<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'
import { AgGridVue } from 'ag-grid-vue3'
import helper from '@/utils/helper'

import { useTemplateV2 } from '@/store/templateV2Store'
import {
  ColumnDefault,
  ColumnGoogle,
  ColumnTikTok,
} from '@/definitions/accounts'
import ColumnSettings from '@/components/template-v2/ColumnSettings.vue'
import { TS } from '@/enum/campaign'
import {
  GetRowIdParams,
  RowSelectionOptions,
  themeAlpine,
} from 'ag-grid-community'
import { options } from '@/options/cell'

const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const accountAdStore = useAccountAd()
const templateV2Store = useTemplateV2(helper.truePath())()

const hasFetchedColumns = ref(false)
const isSelected = ref(false)
const isSwitch = ref(false)
const itemSelected = ref<any[]>([])

const onGridReady = (params: any) => {
  accountAdStore.gridApi = params.api
  if (accountAdStore.gridApi) {
    accountAdStore.gridApi.sizeColumnsToFit()
  }
}
const currentPageItems = computed(() => {
  return accountAdsDetail.value?.length || 0
})
const totalItems = computed(() => {
  return accountAdStore.accountAdsDetail?.total_account_ads || 0
})
const accountAdsDetail = computed(() => {
  isSelected.value = false
  return accountAdStore.accountAdsDetail?.account_ads || null
})

const gridOptions = {
  rowHeight: 50,
  getRowId: (params: GetRowIdParams) => String(params.data.id),
}
const defaultColDef = computed(() => {
  return {
    resizable: true,
  }
})

const columnDefs = computed<any[]>(() => {
  switch (accountAdStore.accountAd.object) {
    case TS.GOOGLE:
      if (!window.arb.isAdmin()) {
        return ColumnGoogle.filter(
          (element) => element.field !== 'domain_configs'
        )
      }
      return ColumnGoogle
    case TS.FACEBOOK:
    case TS.TIKTOK:
      return ColumnTikTok
    default:
      return ColumnDefault
  }
})

const handleStopEdit = (event: any) => {
  const target = event.target as Element

  if (!target.closest('#myGrid')) {
    if (accountAdStore.gridApi) {
      accountAdStore.gridApi.stopEditing()
    }
  }
}

const columns = ref<any[]>([])

const getColumns = async () => {
  await templateV2Store.fetchChooseCols('/accounts/edit')
}

onMounted(async () => {
  helper.addStyleOnce(
    `myGrid-accounts-ad`,
    `#myGrid-accounts-ad .ag-cell.ag-cell-auto-height {height: auto;}`
  )
  document.addEventListener('click', handleStopEdit)

  templateV2Store.columnConfigs.columns = columnDefs.value

  if (accountAdStore.gridApi) {
    const pageSize = accountAdStore.currentPagingDetail?.size
    accountAdStore.gridApi.setGridOption(
      'paginationPageSize',
      pageSize && pageSize >= 1 ? pageSize : 10
    )
  }
})

watch(
  () => [accountAdStore.accountAd, accountAdStore.isLoadingTable],
  async ([accountAd, isLoading]: any) => {
    if (!accountAd.object || isLoading) return

    templateV2Store.columnConfigs.columns = columnDefs.value
    if (!hasFetchedColumns.value) {
      hasFetchedColumns.value = true
      await getColumns()
    }

    const filterFields = templateV2Store.columnSettings?.filter(Boolean) || []
    const filteredColumns = columnDefs.value?.filter((col: any) =>
      filterFields.includes((col as { field: string }).field)
    )

    columns.value = [...filteredColumns]
  },
  { immediate: true }
)

onUnmounted(() => {
  document.removeEventListener('click', handleStopEdit)
})

watch(
  () => accountAdStore.currentPagingDetail,
  async (newVal, oldVal) => {
    if (!oldVal) return

    const pageChanged = newVal.page === oldVal.page
    const sizeChanged = newVal.size === oldVal.size

    if (pageChanged || sizeChanged) {
      accountAdStore.gridApi?.showLoadingOverlay()
      await accountAdStore.GetAccountAdsDetail()
      accountAdStore.gridApi?.hideOverlay()
    }
  },
  { deep: true }
)

const totalPage = computed(() => {
  return Math.ceil(
    (accountAdStore.accountAdsDetail?.total_account_ads || 0) /
      (accountAdStore.currentPagingDetail?.size || 1)
  )
})

const onSelectionChanged = () => {
  const api = accountAdStore.gridApi
  if (!api) return

  const selectedRows = api.getSelectedRows()
  itemSelected.value = selectedRows
  accountAdStore.accountSelected = selectedRows
  isSelected.value = selectedRows.length > 0
  isSwitch.value = selectedRows.length > 0
}

const handleClearSelected = () => {
  const api = accountAdStore.gridApi
  if (!api) return
  api.deselectAllOnCurrentPage()
  itemSelected.value = []
  accountAdStore.accountSelected = []
  isSelected.value = false
}

const handleCopy = async (type: string) => {
  if (!type) return
  const data = itemSelected.value?.map((item) => item[type])

  if (!data?.length) {
    window.message.warning(`No items`)
    return
  }

  const textToCopy = data.join('\n')

  helper.copyText(textToCopy)

  window.message.success(`Copied!`)
}

const showModalLabels2 = () => {
  if (!itemSelected.value.length) return

  accountAdStore.dataLabel = {
    id: '',
    labels: helper.clone(itemSelected.value[0].labels), // reference object
  }
  accountAdStore.type = 'labels'
  accountAdStore.showModal = true
}

const showModalChangeAccountMCC = () => {
  accountAdStore.showModalChangeMCC = !accountAdStore.showModalChangeMCC
}

const handleSelect = (key: string) => {
  handleCopy(key)
}
const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'multiRow',
  enableSelectionWithoutKeys: true,
  enableClickSelection: true,
})
</script>
<template>
  <div class="relative w-full">
    <div
      v-if="isSelected && isSwitch"
      class="flex items-center justify-between bg-blue-500 w-full p-2 h-full z-10 absolute top-0"
    >
      <div class="flex gap-2 items-center">
        <n-button type="error" @click="handleClearSelected">Clear</n-button>
        <n-button
          ghost
          class="text-white hover:!text-red-200"
          @click="handleCopy('account_id')"
          >Copy Account IDs</n-button
        >
        <n-button
          ghost
          class="text-white hover:!text-red-200"
          @click="handleCopy('show_name')"
          >Copy Names</n-button
        >

        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-button class="text-white hover:!text-red-200">Copy Other</n-button>
        </n-dropdown>
        <n-button
          ghost
          class="text-white hover:!text-red-200"
          @click="showModalLabels2"
          v-if="accountAdStore.accountAd.object === TS.GOOGLE"
          >Update Labels</n-button
        >
        <n-button
          ghost
          class="text-white hover:!text-red-200"
          @click="showModalChangeAccountMCC"
          v-if="accountAdStore.accountAd.object === TS.GOOGLE"
          >Change Accounts MCC</n-button
        >
        <div class="flex items-center gap-2 text-white">
          <div class="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {{ itemSelected.length }} item{{
              itemSelected.length !== 1 ? 's' : ''
            }}
            selected
          </div>
        </div>
      </div>
    </div>

    <ColumnSettings class="border-2" />
    <div
      v-if="isSelected"
      class="absolute right-14 transform top-1/2 -translate-y-1/2 z-20"
    >
      <n-switch v-model:value="isSwitch" />
    </div>
  </div>

  <ag-grid-vue
    id="myGrid-accounts-ad"
    :theme="customTheme"
    :animate-rows="true"
    dom-layout="autoHeight"
    :grid-options="gridOptions"
    :column-defs="columns"
    :row-data="accountAdsDetail"
    :enable-cell-text-selection="true"
    :default-col-def="defaultColDef"
    :rowSelection="rowSelection"
    @grid-ready="onGridReady"
    @selection-changed="onSelectionChanged"
  >
  </ag-grid-vue>

  <div class="flex justify-end items-center bg-card py-3 px-4">
    <div class="flex items-center gap-2">
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
        <span class="text-sm">
          Current Items:
          <span class="font-medium text-gray-600">{{
            helper.formatNumber(currentPageItems)
          }}</span>
        </span>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
        <span class="text-sm">
          Total Items:
          <span class="font-medium text-gray-600">{{
            helper.formatNumber(totalItems)
          }}</span>
        </span>
      </div>

      <n-pagination
        v-model:page="accountAdStore.currentPagingDetail.page"
        v-model:page-size="accountAdStore.currentPagingDetail.size"
        :page-count="totalPage"
        show-size-picker
        :page-slot="5"
        :page-sizes="[10, 20, 50, 100, 500]"
      />
    </div>
  </div>

  <ModalChangeAccountMCC
    :accounts="itemSelected"
    @clear-selected="handleClearSelected"
  />
</template>
