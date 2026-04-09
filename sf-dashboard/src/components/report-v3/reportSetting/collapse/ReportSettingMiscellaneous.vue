<script lang="ts" setup>
import MagicIcon from '@/assets/icons/MagicIcon.vue'
import { useReportV2 } from '@/store/report/report-v2'
import { useReportV2Setting } from '@/store/report/report-v2-settings'

const reportStoreV2 = useReportV2(helper.truePath())()
const reportSetting = useReportV2Setting()

const isLoading = computed(() => reportSetting.isLoading || false)
</script>
<template>
  <SettingCollapse
    title="Miscellaneous Settings"
    value="campaign"
    v-model:active-key="reportSetting.activeKey"
  >
    <template #icon>
      <n-icon :component="MagicIcon" :size="22" />
    </template>

    <SettingRow
      v-if="reportStoreV2.reportPermission.autoProfile"
      title="Auto Apply Profile"
      description="All report links in the table will automatically open using the selected profile."
    >
      <n-select
        :loading="isLoading"
        class="w-36"
        :consistent-menu-width="false"
        label-field="name"
        value-field="id"
        placeholder="Select Profile"
        v-model:value="reportStoreV2.reportSettingsNew.autoProfile"
        :options="reportStoreV2.profileOptions"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('autoProfile', value, {reload: true})"
      />
    </SettingRow>

    <SettingRow
      v-if="reportStoreV2.reportPermission.export"
      title="Campaign Download file JSON"
      description="Displays a button to download campaign data as JSON"
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.CampDownLoadJson"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('CampDownLoadJson', value)"
      />
    </SettingRow>

    <SettingRow
      title="Mute Alerts"
      description="Control whether you receive alerts when campaign status changes."
    >
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.alertCamp"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('alertCamp', value, { reloadTable: true})"
      />
    </SettingRow>

    <SettingRow title="Sort By Date View">
      <template #description>
        Automatically sort by date (newest to oldest) when group by
        <span class="font-bold">date</span> and selecting
        <span class="font-bold">a time range by days</span>.
      </template>
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.defaultSortDate"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('defaultSortDate', value)"
      />
    </SettingRow>
  </SettingCollapse>
</template>
