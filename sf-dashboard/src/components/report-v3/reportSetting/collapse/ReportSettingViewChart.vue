<script lang="ts" setup>
import ChartData from '@/assets/icons/ChartData.vue'
import ChartSimple from '@/assets/icons/ChartSimple.vue'
import { useReportV2 } from '@/store/report/report-v2'
import { useReportV2Setting } from '@/store/report/report-v2-settings'
import { SelectOption } from 'naive-ui'

const reportStoreV2 = useReportV2(helper.truePath())()
const reportSetting = useReportV2Setting()

const isLoading = computed(() => reportSetting.isLoading || false)

const optionsWidthOfChart: SelectOption[] = [
  {
    label: '50%',
    value: 50,
  },
  {
    label: '100%',
    value: 100,
  },
]
//Các settings của chart
</script>
<template>
  <SettingCollapse
    title="Chart Settings"
    subtitle="Control how charts are displayed."
    value="view-chart"
    v-model:active-key="reportSetting.activeKey"
  >
    <template #icon>
      <n-icon :component="ChartSimple" :size="22" />
    </template>

    <SettingRow title="Smart Chart Mode">
      <template #description>
        The chart is hidden when: <br />
        - Accessed on a <b>mobile device</b><br />
        - Date is not grouped by <b>Date</b> or only a single date is
        selected<br />
        - Until the user clicks the
        <b>Show Chart</b> button
      </template>
      <n-switch
        :loading="isLoading"
        v-model:value="reportStoreV2.reportSettingsNew.smartChart"
        :on-update:value="(value:string) => reportSetting.changeFrontendSettings('smartChart', value, {reloadChart: true})"
      />
    </SettingRow>

    <SettingRow
      title="Width Of Chart"
      description="Change the width and display of the chart."
    >
      <!-- <n-select
        :loading="isLoading"
        class="w-28"
        :consistent-menu-width="false"
        v-model:value="reportStoreV2.reportSettingsNew.widthOfChart"
        :options="optionsWidthOfChart"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('widthOfChart', value, {reloadChart: true})"
      /> -->

      <n-radio-group
        v-model:value="reportStoreV2.reportSettingsNew.widthOfChart"
        :on-update:value="(value:number) => reportSetting.changeFrontendSettings('widthOfChart', value, {reloadChart: true})"
      >
        <n-radio-button
          v-for="item in optionsWidthOfChart"
          :key="item.value"
          :value="item.value"
          :label="String(item.label)"
        />
      </n-radio-group>
    </SettingRow>
  </SettingCollapse>
</template>
