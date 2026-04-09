<script setup lang="ts">
import useBlockSection from '@/store/details/useBlockSection'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_block_section } from '@/services/ctr_block_section'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = useBlockSection()
const trafficSourceList = ref<SelectOption[]>([])
const name = 'Traffic Source'

const fetchTrafficSources = async () => {
  dataConfig.isGettingSource = true

  const res = await ctr_traffic_source.GetAllTrafficSource()

  trafficSourceList.value = res?.data?.traffic_sources || []

  dataConfig.isGettingSource = false
}
const getTrafficSrcData = async () => {
  dataConfig.isGetting = true
  const res = await ctr_block_section.GetBlockSectionAdminByTrafficSource(
    dataConfig.trafficSelected
  )

  dataConfig.sectionData = res?.data || {}
  dataConfig.isGetting = false
}
onMounted(async () => {
  fetchTrafficSources()
})
const trafficSourceListShow = computed(() => {
  return trafficSourceList.value.map((item) => {
    if (item.value == 'taboola' || item.value == 'outbrain') {
      return {
        name: item.name,
        value: item.value,
      }
    }
    return {
      name: item.name,
      value: item.value,
      disabled: true,
    }
  })
})
</script>

<template>
  <div class="pb-5">
    <FloatingWrapper
      :name="name"
    >
      <n-select
        v-model:value="dataConfig.trafficSelected"
        filterable
        placeholder=""
        value-field="value"
        label-field="name"
        :options="trafficSourceListShow"
        :loading="dataConfig.isGettingSource"
        @update:value="getTrafficSrcData"
      />
    </FloatingWrapper>
  </div>
</template>
