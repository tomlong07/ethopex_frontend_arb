<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import { ctr_user } from '@/services/ctr_user'
import Close from '@/assets/icons/Close.vue'
import ReportSettingTableAction from './reportSetting/collapse/ReportSettingTableAction.vue'
import { useReportV2Setting } from '@/store/report/report-v2-settings'

const reportStoreV2 = useReportV2(helper.truePath())()

const reportSetting = useReportV2Setting()

onMounted(async () => {
  reportSetting.isLoading = true
  await getThisFrontendSettings()
  reportSetting.isLoading = false
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

const handleClose = () => {
  reportStoreV2.showModalSettings = false
}
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
      <n-spin :show="reportSetting.isLoading">
        <div class="flex gap-3 flex-col">
          <ReportSettingGeneral />
          <ReportSettingViewChart />
          <ReportSettingTableAction />
          <ReportSettingHelpers />
          <ReportSettingMiscellaneous />
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
