<script setup lang="ts">
import Download2 from '@/assets/icons/Download2.vue'
import { useReportV2 } from '@/store/report/report-v2'
import { NPopconfirm, NPopover } from 'naive-ui'

const reportStoreV2 = useReportV2(helper.truePath())()

const props = defineProps<{ rowData: any }>()

const downloadJsonCampaign = async (
  copyToClipboard = false,
  downloadFullTable = false
) => {
  reportStoreV2.downloadJSON(copyToClipboard, downloadFullTable, props.rowData)
}
</script>

<template>
  <NPopover placement="bottom" trigger="hover">
    <template #trigger>
      <NPopconfirm
        :show-icon="true"
        positive-text="Download"
        negative-text="Copy"
        @positive-click="() => downloadJsonCampaign(false)"
        @negative-click="() => downloadJsonCampaign(true)"
        :style="{ zIndex: 1000 }"
      >
        <template #trigger>
          <div @click.stop>
            <Download2 class="cursor-pointer" title="JSON Data" size="20" />
          </div>
        </template>
        <template #default> Action with JSON data </template>
      </NPopconfirm>
    </template>
    <span>Download</span>
  </NPopover>
</template>
