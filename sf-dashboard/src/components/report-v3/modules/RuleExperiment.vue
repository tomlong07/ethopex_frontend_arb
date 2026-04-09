<script setup lang="ts">
import Experiment from '@/assets/icons/Experiment.vue'
import useReportRule from '@/store/report/report-rule'
import { NPopover, NButton } from 'naive-ui'

const props = defineProps<{
  rowData: any
}>()

const reportRule = useReportRule()

const handleExperimentClick = () => {
  if (!props.rowData?.campaign_name?.id) return
  reportRule.campaignID = props.rowData?.campaign_name?.id
  reportRule.dataSatisfy = null
  reportRule.updateData = Date.now()

  if (reportRule.isInit) return

  reportRule.isInit = true

  if (!reportRule.isLoadingRules) return

  // reportRule.fetchRules()
}
</script>

<template>
  <NPopover trigger="hover" placement="bottom">
    <template #trigger>
      <div class="inline-block cursor-pointer">
        <NButton @click="handleExperimentClick()" text>
          <Experiment class="focus:outline-none"
        /></NButton>
      </div>
    </template>

    Test the Rule
  </NPopover>
</template>
