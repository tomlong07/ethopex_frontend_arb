<script lang="ts" setup>
import { Settings20Regular } from '@/assets'
import { useReportV2 } from '@/store/report/report-v2'
import { useReportV2Setting } from '@/store/report/report-v2-settings'

const reportStoreV2 = useReportV2(helper.truePath())()
const reportSetting = useReportV2Setting()

const isLoading = computed(() => reportSetting.isLoading || false)

//Các settings chung, sử dụng cả chart, table
</script>
<template>
  <SettingCollapse
    title="General Preferences"
    subtitle="Default behavior, updates, and report layout."
    value="general"
    v-model:active-key="reportSetting.activeKey"
  >
    <template #icon>
      <n-icon :component="Settings20Regular" :size="22" />
    </template>

    <SettingRow
      title="Auto Update"
      description="Automatically update reports immediately after changing the date range."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.autoUpdate"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('autoUpdate', value)"
      />
    </SettingRow>

    <SettingRow
      title="Auto-Save Report View"
      description="Automatically save and restore your selected group by and columns."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.autoSaveReport"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('autoSaveReport', value)"
      />
    </SettingRow>

    <SettingRow
      title="Show Full Date"
      description="Show full date (including weekday, day, month, and year) in the report."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.showFullDate"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('showFullDate',value, {reloadChart: true, reloadTable: true})"
      />
    </SettingRow>

    <SettingRow
      title="Save Last View"
      description="Remember your last report view and restore it when you return."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.saveLastView"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('saveLastView', value)"
      />
    </SettingRow>
  </SettingCollapse>
</template>
