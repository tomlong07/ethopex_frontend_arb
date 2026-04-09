<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import useReportNotes from '@/store/report/report-v2-modal-note'

import useActivityStore from '@/store/useActivityStore'
import { useGroupFilterStore } from '@/store/activity/groupFilter'
import Download2 from '@/assets/icons/Download2.vue'
import AddNote from '@/assets/icons/AddNote.vue'
import Logging from '@/assets/icons/Logging.vue'
import Download from '@/assets/icons/Download.vue'

const activityStore = useActivityStore()
const groupFilterStore = useGroupFilterStore()
const noteStore = useReportNotes()

const reportStoreV2 = useReportV2(helper.truePath())()

const downloadReport = () => {
  if (reportStoreV2.reportPermission.export) {
    reportStoreV2.downloadExcelNow = Date.now()
  }
}

const openCampaignLog = async () => {
  try {
    if (reportStoreV2.filter?.campaigns?.length === 1) {
      // activityStore.payload.filter.campaign =
      //   reportStoreV2.filter?.campaigns[0].toString()

      groupFilterStore.payload.filter.campaign =
        reportStoreV2.filter?.campaigns[0].toString()

      activityStore.isDefaultAllTime = true

      await helper.sleep(100)
      activityStore.showModal = true
    }
  } catch {}
}

const openModalNote = async () => {
  try {
    if (reportStoreV2.filter?.campaigns?.length === 1) {
      noteStore.showModal = true
      noteStore.campaignId = Number(reportStoreV2.filter?.campaigns[0])
    }
  } catch {}
}

const downloadJsonCampaign = async (
  copyToClipboard = false,
  downloadFullTable = true
) => {
  reportStoreV2.downloadJSON(copyToClipboard, downloadFullTable)
}

const isComp = window.arb.isCompany()
</script>
<template>
  <div class="ml-auto flex gap-2 items-center custom-col-right-report h-9">
    <n-button
      text
      v-if="isComp && reportStoreV2.filter?.campaigns?.length === 1"
      title="Campaign Log"
      @click="openCampaignLog"
      ><n-icon :component="Logging" size="16"
    /></n-button>

    <n-button
      text
      v-if="
        reportStoreV2.hasPermissionNote &&
        reportStoreV2.filter?.campaigns?.length === 1
      "
      title="Add Note"
      @click="openModalNote"
      ><n-icon :component="AddNote" size="20"
    /></n-button>

    <n-icon
      v-if="reportStoreV2.reportPermission.export"
      class="cursor-pointer"
      title="Download"
      size="16"
      @click="downloadReport"
      :component="Download"
    ></n-icon>

    <n-popconfirm
      v-if="reportStoreV2.reportSettingsNew.CampDownLoadJson"
      :show-icon="true"
      positive-text="Download"
      negative-text="Copy"
      @positive-click="downloadJsonCampaign(false)"
      @negative-click="downloadJsonCampaign(true)"
    >
      <template #trigger>
        <n-icon
          class="cursor-pointer"
          title="JSON Data"
          size="16"
          :component="Download2"
        />
      </template>
      <template #default> Action with JSON data </template>
    </n-popconfirm>
  </div>
</template>
