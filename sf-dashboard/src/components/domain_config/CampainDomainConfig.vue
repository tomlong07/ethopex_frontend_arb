<template>
  <n-card
    title="Campaigns are being used"
    v-if="domainConfig.modeData.isEditPage()"
    class="rounded-md"
  >
    <template #header-extra>
      <div class="flex gap-4 mr-2.5 items-center">
        <FloatingWrapper name="Status">
          <n-select
            v-model:value="domainConfig.dataConfig.campStatus"
            filterable
            clearable
            placeholder="All"
            :disabled="domainConfig.isLoading"
            :options="statusOptions"
            :on-update:value="handleFilterStatus"
          />
        </FloatingWrapper>
        <!-- <div class="">
                <n-input
                  v-model:value="dataConfig.search"
                  placeholder="Search"
                  :on-focus = "handleSearch"
                />
              </div> -->
      </div>
      <div class="flex gap-2">
        <n-tag type="info">
          Total:
          {{ domainConfig.recordsTotalOn + domainConfig.recordsTotalOff }}
        </n-tag>
        <n-tag type="success">
          On:
          {{ domainConfig.recordsTotalOn }}
        </n-tag>
        <n-tag type="error">
          Off:
          {{ domainConfig.recordsTotalOff }}
        </n-tag>
      </div>
    </template>
    <div class="w-full">
      <n-spin :show="domainConfig.isLoadingCamp">
        <ag-grid-vue
          :theme="customTheme"
          dom-layout="autoHeight"
          :column-defs="columnsDef"
          :row-data="domainConfig.dataCampaigns"
        >
        </ag-grid-vue>
      </n-spin>
      <!-- pagination -->
      <n-pagination
        v-model:page="domainConfig.page"
        v-model:page-size="domainConfig.pageSize"
        show-size-picker
        class="bg-card py-3 justify-end items-center"
        :page-count="pageCount"
        :page-sizes="[10, 20, 30, 50, 100, 500]"
        :on-update:page="updatePage"
        :on-update:page-size="updatePageSize"
      />
    </div>
  </n-card>
</template>
<script setup lang="ts">
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import { SelectOption } from 'naive-ui'
import { newColumnsDefKeywordSet } from '@/constants/keywordSet'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { themeAlpine } from 'ag-grid-community'

const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const domainConfig = useDomainConfigStore()

const columnsDef = newColumnsDefKeywordSet()

const statusOptions = ref<SelectOption[]>([
  {
    label: 'On',
    value: 'on',
    disabled: false,
  },
  {
    label: 'Off',
    value: 'off',
    disabled: false,
  },
])
const handleFilterStatus = (value: any) => {
  domainConfig.dataConfig.campStatus = value
  domainConfig.getCampaignsInDomainConfig()
}

const updatePage = (newVal: number) => {
  domainConfig.page = newVal

  domainConfig.getCampaignsInDomainConfig()
}
const updatePageSize = (newVal: number) => {
  domainConfig.page = 1
  domainConfig.pageSize = newVal

  domainConfig.getCampaignsInDomainConfig()
}
const pageCount = computed<number>(() => {
  const totalRecords = domainConfig.recordsTotal
  const pageSizeValue = domainConfig.pageSize

  if (totalRecords % pageSizeValue === 0) {
    return totalRecords / pageSizeValue
  }

  return Math.floor(totalRecords / pageSizeValue) + 1
})
</script>
