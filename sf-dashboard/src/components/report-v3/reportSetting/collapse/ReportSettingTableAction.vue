<script lang="ts" setup>
import Grid4 from '@/assets/icons/Grid4.vue'
import { CellSpacingOptions, PageSizeOptions } from '@/options/report'
import { useReportV2 } from '@/store/report/report-v2'
import { useReportV2Setting } from '@/store/report/report-v2-settings'

const reportStoreV2 = useReportV2(helper.truePath())()
const reportSetting = useReportV2Setting()

const isLoading = computed(() => reportSetting.isLoading || false)
</script>
<template>
  <SettingCollapse
    title="Table Display Settings"
    subtitle="Customize the appearance and behavior of data tables and reports."
    value="table-action"
    v-model:active-key="reportSetting.activeKey"
  >
    <template #icon>
      <n-icon :component="Grid4" :size="22" />
    </template>

    <SettingRow
      title="Cell Spacing"
      description="Adjust the spacing between cells to suit your preference."
    >
      <!-- <n-select
        :loading="isLoading"
        :consistent-menu-width="false"
        class="w-28"
        placeholder="Select Profile"
        v-model:value="reportStoreV2.reportSettingsNew.cellSpacing"
        :options="CellSpacingOptions"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('cellSpacing', value, {reload: true})"
      /> -->

      <n-radio-group
        v-model:value="reportStoreV2.reportSettingsNew.cellSpacing"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('cellSpacing', value, {reload: true})"
      >
        <n-radio-button
          v-for="item in CellSpacingOptions"
          :key="item.value"
          :value="item.value"
          :label="String(item.label)"
        />
      </n-radio-group>
    </SettingRow>
    <SettingRow
      title="Disable Profit/Loss Coloring"
      description="Show report values without profit/loss colors."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="
          reportStoreV2.reportSettingsNew.isProfitLossColoringDisabled
        "
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('isProfitLossColoringDisabled',value, {reload: true})"
      />
    </SettingRow>

    <SettingRow title="Page Size" description="Default page size of report.">
      <!-- <n-select
        class="w-28"
        :loading="isLoading"
        :consistent-menu-width="false"
        v-model:value="reportStoreV2.reportSettingsNew.pageSize"
        :options="PageSizeOptions"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('pageSize', value)"
      /> -->
      <n-radio-group
        v-model:value="reportStoreV2.reportSettingsNew.pageSize"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('pageSize', value)"
      >
        <n-radio-button
          v-for="item in PageSizeOptions"
          :key="item.value"
          :value="item.value"
          :label="String(item.label)"
        />
      </n-radio-group>
    </SettingRow>

    <SettingRow
      title="Sort Direction"
      description="Controls whether sort direction (ASC/DESC) is shown when sorting table columns."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.sortDirection"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('sortDirection', value)"
      />
    </SettingRow>
    <SettingRow
      title="Auto Sort by Revenue"
      description="Automatically sorts data by Revenue (Descending) when a dimension is selected.
If the selected dimension list includes Date, the data will be sorted by Date (Descending) instead."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.sortRevenue"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('sortRevenue', value)"
      />
    </SettingRow>
  </SettingCollapse>
</template>
