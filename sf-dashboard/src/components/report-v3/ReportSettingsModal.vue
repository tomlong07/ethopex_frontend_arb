<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import { ctr_user } from '@/services/ctr_user'
import { SelectOption } from 'naive-ui'
import SettingCampaign from './reportSetting/SettingCampaign.vue'
import Close from '@/assets/icons/Close.vue'

const reportStoreV2 = useReportV2(helper.truePath())()

const buildDataSend = (changeKey: string, value: any) => {
  let temp = helper.clone(reportStoreV2.reportSettingsNew)
  temp[changeKey] = value
  return {
    path: window.route.path,
    settings: JSON.stringify(temp),
  }
}

const isLoading = ref<boolean>(false)

onMounted(async () => {
  isLoading.value = true
  //do something
  await getThisFrontendSettings()

  isLoading.value = false
})

const getThisFrontendSettings = async () => {
  const response = await ctr_user.GetFrontendSettings(window.route.path)

  handleUpdateSettings(response)
}

const handleUpdateSettings = (response: any) => {
  if (response.status && response.data?.path === window.route.path) {
    const newData = response.data?.settings
      ? JSON.parse(response.data.settings)
      : {}
    reportStoreV2.changeReportSettings(newData)
  }
}

const changeFrontendSettings = async (
  changeKey: string,
  value: any,
  options?: Record<string, any>
) => {
  isLoading.value = true

  const response = await ctr_user.SaveFrontendSettingsByPath(
    buildDataSend(changeKey, value)
  )

  handleUpdateSettings(response)

  if (changeKey === 'pageSize') {
    reportStoreV2.size = value
  }
  if (changeKey === 'widthOfChart') {
    reportStoreV2.width = value
  }
  if (changeKey === 'isProfitLossColoringDisabled') {
    reportStoreV2.reportSettingsNew.isProfitLossColoringDisabled = value
  }
  if (changeKey === 'smartStickyDate') {
    reportStoreV2.reportSettingsNew.smartStickyDate = value
  }

  if (changeKey === 'alertCamp') {
    reportStoreV2.reportSettingsNew.alertCamp = value
  }
  isLoading.value = false

  if (options?.reload) {
    reportStoreV2.isReload = true
  }
  if (options?.reloadChart) {
    reportStoreV2.isReloadChart = true
  }
  if (options?.reloadTable) {
    reportStoreV2.isReloadTable = value
  }
}

const options: SelectOption[] = [
  {
    label: '10',
    value: 10,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
  {
    label: '200',
    value: 200,
  },
  {
    label: '500',
    value: 500,
  },
]
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

const optionsCellSpacing: SelectOption[] = [
  {
    label: 'Compact',
    value: 'compact',
  },
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Wide',
    value: 'wide',
  },
]

const handleClose = () => {
  reportStoreV2.showModalSettings = false
}

const isCompany = computed(() => {
  return window.arb.isCompany()
})
</script>

<template>
  <n-modal
    v-model:show="reportStoreV2.showModalSettings"
    preset="dialog"
    type="success"
    :closable="false"
    :show-icon="false"
    class="modal-setting-report custom-ncard-dark-mode"
    style="width: 1500px; height: 95vh; padding: 0"
  >
    <n-card class="h-16" embedded>
      <div class="flex items-center gap-2 text-xl px-4 h-full select-none">
        Report Settings
        <n-icon
          size="26"
          class="ml-auto cursor-pointer not-filter-icon"
          @click="handleClose"
        >
          <Close />
        </n-icon>
      </div>
    </n-card>

    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      class="overflow-y-scroll"
      style="
        height: calc(95vh - 8rem);
        padding-left: 10px;
        padding-right: 10px;
        scrollbar-width: thin;
      "
    >
      <n-spin :show="isLoading">
        <div class="flex gap-4 flex-col">
          <n-table :single-line="false">
            <thead>
              <tr>
                <th>Name</th>
                <th>Setting</th>
                <th>Description</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Change Compare</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew.changeCompare
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('changeCompare', value)"
                  />
                </td>
                <td>Displays the changes between the last two data updates.</td>
                <td>Only available for today report.</td>
              </tr>

              <tr>
                <td>Auto Update</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.autoUpdate"
                    :on-update:value="(value:string) => changeFrontendSettings('autoUpdate', value)"
                  />
                </td>
                <td>
                  Automatically update reports immediately after changing the
                  date range.
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Page Size</td>
                <td>
                  <n-select
                    class="w-24"
                    :loading="isLoading"
                    :consistent-menu-width="false"
                    v-model:value="reportStoreV2.reportSettingsNew.pageSize"
                    :options="options"
                    :on-update:value="(value:number) => changeFrontendSettings('pageSize', value)"
                  />
                </td>
                <td>Default page size of report.</td>
                <td></td>
              </tr>

              <SettingCampaign
                @changeFrontendSettings="changeFrontendSettings"
                :isLoading="isLoading"
              />

              <tr>
                <td>Save Last View</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.saveLastView"
                    :on-update:value="(value:string) => changeFrontendSettings('saveLastView', value)"
                  />
                </td>
                <td>
                  Remember your last report view and restore it when you return.
                </td>
                <td></td>
              </tr>

              <tr v-if="isCompany">
                <td>Checkbox mode</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.selectBox"
                    :on-update:value="(value:string) => changeFrontendSettings('selectBox', value, {reload: true})"
                  />
                </td>
                <td>
                  <!-- Toggle button to show or hide the column selection settings. -->
                  Toggle to show/hide column selection. Turning off will also
                  disable Bulk Actions.
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Width Of Chart</td>
                <td>
                  <n-select
                    :loading="isLoading"
                    :consistent-menu-width="false"
                    v-model:value="reportStoreV2.reportSettingsNew.widthOfChart"
                    :options="optionsWidthOfChart"
                    :on-update:value="(value:number) => changeFrontendSettings('widthOfChart', value, {reloadChart: true})"
                  />
                </td>
                <td>Change the width and display of the chart.</td>
                <td></td>
              </tr>

              <tr>
                <td>Sort By Date View</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew.defaultSortDate
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('defaultSortDate', value)"
                  />
                </td>
                <td>
                  Automatically sort by date (newest to oldest) when group by
                  <span class="font-bold">date</span> and selecting
                  <span class="font-bold">a time range by days</span>.
                </td>
                <td></td>
              </tr>

              <tr v-if="reportStoreV2.reportPermission.export">
                <td>Campaign Download file JSON</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew.CampDownLoadJson
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('CampDownLoadJson', value)"
                  />
                </td>
                <td>Displays a button to download campaign data as JSON</td>
                <td></td>
              </tr>

              <tr>
                <td>Smart Chart Mode</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.smartChart"
                    :on-update:value="(value:string) => changeFrontendSettings('smartChart', value, {reloadChart: true})"
                  />
                </td>
                <td>
                  The chart is hidden when: <br />
                  - Accessed on a <b>mobile device</b><br />
                  - Date is not grouped by <b>Date</b> or only a single date is
                  selected<br />
                  - Until the user clicks the
                  <b>Show Chart</b> button
                </td>
                <td></td>
              </tr>

              <tr v-if="reportStoreV2.reportPermission.autoProfile">
                <td>Auto Apply Profile</td>
                <td>
                  <n-select
                    :loading="isLoading"
                    :consistent-menu-width="false"
                    label-field="name"
                    value-field="id"
                    placeholder="Select Profile"
                    v-model:value="reportStoreV2.reportSettingsNew.autoProfile"
                    :options="reportStoreV2.profileOptions"
                    :on-update:value="(value:number) => changeFrontendSettings('autoProfile', value, {reload: true})"
                  />
                </td>
                <td>
                  All report links in the table will automatically open using
                  the selected profile.
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Show Full Date</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.showFullDate"
                    :on-update:value="(value:string) => changeFrontendSettings('showFullDate',value, {reloadChart: true, reloadTable: true})"
                  />
                </td>
                <td>
                  Show full date (including weekday, day, month, and year) in
                  the report.
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Disable Profit/Loss Coloring</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew
                        .isProfitLossColoringDisabled
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('isProfitLossColoringDisabled',value, {reload: true})"
                  />
                </td>
                <td>Show report values without profit/loss colors.</td>
                <td></td>
              </tr>

              <tr>
                <td>Cell Spacing</td>
                <td>
                  <n-select
                    :loading="isLoading"
                    :consistent-menu-width="false"
                    placeholder="Select Profile"
                    v-model:value="reportStoreV2.reportSettingsNew.cellSpacing"
                    :options="optionsCellSpacing"
                    :on-update:value="(value:number) => changeFrontendSettings('cellSpacing', value, {reload: true})"
                  />
                </td>
                <td>Enable horizontal scroll bar for the report table</td>
                <td></td>
              </tr>

              <!-- New option added here -->
              <tr>
                <td>Mute Alerts</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.alertCamp"
                    :on-update:value="(value:string) => changeFrontendSettings('alertCamp', value, { reloadTable: true})"
                  />
                </td>
                <td>
                  Control whether you receive alerts when campaign status
                  changes.
                </td>
                <td></td>
              </tr>

              <tr>
                <td>Auto-Save Report View</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew.autoSaveReport
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('autoSaveReport', value)"
                  />
                </td>
                <td>
                  Automatically save and restore your selected group by and
                  columns.
                </td>
                <td>Only applies when enabled.</td>
              </tr>

              <tr>
                <td>Sort Direction</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew.sortDirection
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('sortDirection', value)"
                  />
                </td>
                <td>
                  Controls whether sort direction (ASC/DESC) is shown when
                  sorting table columns.
                </td>
                <td></td>
              </tr>
              <!-- 
              <tr>
                <td>Quick Select From Table</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="reportStoreV2.reportSettingsNew.quickSelect"
                    :on-update:value="(value:string) => changeFrontendSettings('quickSelect', value)"
                  />
                </td>
                <td>
                  Moves the clicked cell value to the top of the select options
                  for quick access.
                </td>
                <td></td>
              </tr> -->

              <!-- <tr>
                <td>Pinned Date</td>
                <td>
                  <n-switch
                    :loading="isLoading"
                    v-model:value="
                      reportStoreV2.reportSettingsNew.smartStickyDate
                    "
                    :on-update:value="(value:string) => changeFrontendSettings('smartStickyDate', value, {reload: true})"
                  />
                </td>
                <td>
                  When grouping by date, make the date automatically sticky.
                </td>
                <td></td>
              </tr> -->
            </tbody>
          </n-table>
        </div>
      </n-spin>
    </n-card>

    <n-card class="h-16 p-2 justify-center" embedded>
      <div class="flex h-full select-none">
        <div
          class="ml-auto flex flex-row gap-4 items-center"
          @click="handleClose"
        >
          <n-button size="small">Close</n-button>
        </div>
      </div></n-card
    >
  </n-modal>
</template>
<style lang="scss">
.modal-setting-report {
  .n-dialog__content {
    margin: 0;
  }
}
</style>
