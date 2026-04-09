<script setup lang="ts">
import useModalSatisfyStore from '@/store/modalSatisfy'
import useReportRule from '@/store/report/report-rule'
import RuleSelect from './RuleSelect.vue'
import PublisherSelect from './PublisherSelect.vue'
import TrafficSourceSelect from './TrafficSourceSelect.vue'

const modalSatisfyStore = useModalSatisfyStore()
const reportRule = useReportRule()

const ModalRuleSatisfy = defineAsyncComponent(
  () => import('@/components/rule3/satisfy/ModalRuleSatisfy.vue')
)

const selectedPublisher = ref<number[] | null>(null)
const selectedTrafficSource = ref<string[] | null>(null)

const handleSatisfyItem = async () => {
  modalSatisfyStore.showModal = true

  const savedFilters = reportRule.loadFiltersFromStorage()

  selectedPublisher.value = savedFilters.publisher
  selectedTrafficSource.value = savedFilters.traffic_source
  reportRule.ruleSelected = savedFilters.rule

  if (savedFilters.publisher && savedFilters.publisher.length > 0) {
    await reportRule.fetchPublisher('', savedFilters.publisher)
  } else {
    await reportRule.fetchPublisher()
  }
  await reportRule.fetchTrafficSource()
  if (!savedFilters.publisher && !savedFilters.traffic_source) {
    await reportRule.fetchRules({
      publisher: selectedPublisher.value,
      traffic_source: selectedTrafficSource.value,
      search: '',
      size: 20,
    })
  }
}

watch(
  () => reportRule.updateData,
  (newVal) => {
    if (newVal) {
      modalSatisfyStore.dataRowSatisfy = null
      reportRule.isReady = false
      handleSatisfyItem()
    }
  }
)
watch([selectedPublisher, selectedTrafficSource], async () => {
  await reportRule.fetchRules({
    publisher: selectedPublisher.value,
    traffic_source: selectedTrafficSource.value,
    search: '',
  })

  const ruleStillExists = reportRule.ruleOptions.find(
    (r) => r.id === reportRule.ruleSelected
  )

  if (!ruleStillExists) {
    reportRule.ruleSelected = null
  }

  reportRule.saveFiltersToStorage({
    publisher: selectedPublisher.value,
    traffic_source: selectedTrafficSource.value,
    rule: reportRule.ruleSelected,
  })
})

const handleTabChange = (index: string) => {
  const items = reportRule.dataSatisfy?.items || []
  const item = items[Number(index)]
  if (item) {
    reportRule.activeTab = index
    modalSatisfyStore.dataRowSatisfy = item
  }
}

const ajaxGetData = async () => {
  await reportRule.gettingDataRule({
    campaign_id: reportRule.campaignID,
    rule_id: reportRule.ruleSelected,
  })

  handleTabChange('0')
}
const hasResultFalse = (rule: any) => {
  return (
    rule?.metrics?.some((m: any) =>
      m.log_condition?.includes('Result: false')
    ) || false
  )
}

const barStyle = computed(() => {
  const activeItem =
    reportRule?.dataSatisfy?.items?.[reportRule.activeTab as any]
  if (activeItem && hasResultFalse(activeItem)) {
    return '--n-bar-color: #ef4444'
  }
  return '--n-bar-color: #2762ea'
})
</script>

<template>
  <div class="space-y-4">
    <ModalRuleSatisfy
      title="Test the Rule"
      :isLoading="reportRule.isGetting"
      :isReady="reportRule.isReady"
    >
      <div class="bg-white">
        <div class="flex justify-between items-center gap-4">
          <div class="flex gap-2">
            <PublisherSelect v-model="selectedPublisher" />
            <TrafficSourceSelect v-model="selectedTrafficSource" />
          </div>
        </div>

        <div class="flex gap-2 items-center my-2">
          <div>
            <RuleSelect
              v-model="reportRule.ruleSelected"
              :publisher="selectedPublisher"
              :traffic-source="selectedTrafficSource"
            />
          </div>
          <n-button
            size="small"
            color="#f43f5e"
            @click="ajaxGetData"
            :disabled="!reportRule.ruleSelected || reportRule.isGetting"
            >Test</n-button
          >
        </div>
      </div>
      <n-tabs
        type="line"
        size="small"
        :value="String(reportRule.activeTab)"
        :style="barStyle"
        @update:value="(val: string) => handleTabChange(val)"
        v-if="reportRule?.dataSatisfy?.items"
      >
        <n-tab
          v-for="(item, index) in reportRule.dataSatisfy.items"
          :key="index"
          :name="String(index)"
          :class="[hasResultFalse(item) ? '!text-red-500' : '']"
        >
          {{ item.name || `${reportRule.dataSatisfy.TabName()} ${index + 1}` }}
        </n-tab>
      </n-tabs>
    </ModalRuleSatisfy>
  </div>
</template>
