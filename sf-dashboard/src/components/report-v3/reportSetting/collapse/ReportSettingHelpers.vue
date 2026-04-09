<script lang="ts" setup>
import SortAsc from '@/assets/icons/SortAsc.vue'
import { useReportV2 } from '@/store/report/report-v2'
import { useReportV2Setting } from '@/store/report/report-v2-settings'

const reportStoreV2 = useReportV2(helper.truePath())()
const reportSetting = useReportV2Setting()

const isLoading = computed(() => reportSetting.isLoading || false)

const isCompany = window.arb.isCompany()
const isDev = window.arb.isDev()
</script>
<template>
  <SettingCollapse
    title="Table Helpers & Enhancements"
    subtitle="Enable advanced features and helpers that extend table functionality."
    value="data-sorting"
    v-model:active-key="reportSetting.activeKey"
  >
    <template #icon>
      <n-icon :component="SortAsc" :size="22" />
    </template>

    <SettingRow
      title="Change Compare"
      description="Displays the changes between the last two data updates."
      note="Only available for today report."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.changeCompare"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('changeCompare', value)"
      />
    </SettingRow>

    <SettingRow
      v-if="isCompany"
      title="Checkbox Mode"
      description="Toggle to show/hide column selection. Turning off will also disable Bulk Actions."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.selectBox"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('selectBox', value, {reload: true})"
      />
    </SettingRow>

    <SettingRow
      v-if="isDev"
      title="Quick Filters"
      description="Moves the clicked cell value to the top of the select options for quick
        access."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.quickSelect"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('quickSelect', value)"
      />
    </SettingRow>
  </SettingCollapse>
</template>
