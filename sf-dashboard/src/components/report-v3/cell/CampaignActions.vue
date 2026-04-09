<script setup lang="ts">
import { NPopover } from 'naive-ui'
import { useReportV2 } from '@/store/report/report-v2'
import { useGroupFilterStore } from '@/store/activity/groupFilter'
import useActivityStore from '@/store/useActivityStore'
import useReportNotes from '@/store/report/report-v2-modal-note'
import AddNote from '@/assets/icons/AddNote.vue'
import SettingIcon from '@/assets/icons/SettingIcon.vue'
import Calendar from '@/assets/icons/Calendar.vue'
import Clipboard from '@/assets/icons/Clipboard.vue'
import DownloadData from '../modules/DownloadData.vue'
import RuleExperiment from '../modules/RuleExperiment.vue'
import LoggingAntGame from '../modules/LoggingAntGame.vue'

//Ko dùng async dc, cái cột của tabulator nó ko nhận width

const props = defineProps<{
  rowData: any
}>()
const isComp = window.arb.isCompany()
const isShowRuleTest = window.arb.isDev() || window.arb.isAnt()

const reportStoreV2 = useReportV2(helper.truePath())()
const groupFilterStore = useGroupFilterStore()
const activityStore = useActivityStore()
const noteStore = useReportNotes()

async function handleLogClick(e: Event) {
  e.stopPropagation()
  const id = props.rowData?.campaign_name?.id

  if (id) {
    groupFilterStore.payload.filter.campaign = id.toString()
    activityStore.isDefaultAllTime = true
    await helper.sleep(100)
    activityStore.showModal = true
  }
}

function handleNoteClick(e: Event) {
  e.stopPropagation()
  noteStore.campaignId = Number(props.rowData?.campaign_name?.id)
  noteStore.showModal = true
}
</script>

<template>
  <div class="flex gap-2 items-center cursor-pointer custom-actions-report">
    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <SettingIcon :size="20" class="setting-icon-report" />
      </template>
      <span>Settings</span>
    </NPopover>

    <LoggingAntGame :rowData="rowData" @action="handleLogClick" v-if="isComp" />

    <DownloadData
      v-if="reportStoreV2.reportSettingsNew.CampDownLoadJson"
      :rowData="rowData"
    />

    <NPopover
      placement="bottom"
      trigger="hover"
      v-if="reportStoreV2.hasPermissionNote && rowData?.campaign_name?.id"
    >
      <template #trigger>
        <AddNote :size="24" @click="handleNoteClick" />
      </template>
      <span>Note</span>
    </NPopover>

    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <Calendar class="week-data focus:outline-none" :size="18" />
      </template>
      <span>Data from the last 7 days</span>
    </NPopover>

    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <Clipboard class="ad-group-data focus:outline-none" :size="18" />
      </template>
      <span>Data by Ad Group</span>
    </NPopover>

    <RuleExperiment :rowData="rowData" v-if="isShowRuleTest" />
  </div>
</template>
