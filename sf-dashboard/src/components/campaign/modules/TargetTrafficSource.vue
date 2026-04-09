<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ref } from 'vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { INEX } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const targetTrafficSourceOptions = ref<SelectOption[]>([])
const isLoading = ref(false)

const hasSelectedTrafficSources = computed(() => {
  return (props.campaign.filters?.traffic_source?.values?.length ?? 0) > 0
})

const fetchTargetTrafficSource = async () => {
  isLoading.value = true
  const result = await ctr_traffic_source.GetAllTrafficSource()

  targetTrafficSourceOptions.value =
    result?.data?.traffic_sources?.map((item: any) => ({
      label: item.name,
      value: item.value,
    })) || []
  isLoading.value = false
}

onMounted(() => {
  if (!props.campaign.filters) {
    props.campaign.filters = {}
  }

  if (!props.campaign.filters.traffic_source) {
    props.campaign.filters.traffic_source = {
      values: [],
      operator: INEX.INCLUDE,
    }
  }

  fetchTargetTrafficSource()
})

watch(
  () => props.campaign.filters?.traffic_source?.values?.length,
  (newLength) => {
    const trafficSource = props.campaign.filters?.traffic_source
    if (!trafficSource) return

    if (newLength === 0 && trafficSource.operator === INEX.EXCLUDE) {
      trafficSource.operator = INEX.INCLUDE
    }
  }
)
</script>

<template>
  <div
    v-if="props.campaign.filters && props.campaign.filters.traffic_source"
    class="flex-1 min-w-0 flex items-center gap-2 name-affect-comp"
  >
    <FloatingWrapper name="Traffic Source">
      <n-select
        v-model:value="props.campaign.filters.traffic_source.values"
        :options="targetTrafficSourceOptions"
        filterable
        clearable
        multiple
        :loading="isLoading"
        placeholder="All"
      />
    </FloatingWrapper>
    <CustomSwitch
      v-model="props.campaign.filters.traffic_source.operator"
      type="inex"
      true-label="Include"
      false-label="Exclude"
      size="small"
      :disabled="!hasSelectedTrafficSources"
    />
  </div>
</template>
