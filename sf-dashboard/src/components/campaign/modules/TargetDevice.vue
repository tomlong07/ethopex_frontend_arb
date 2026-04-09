<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { INEX } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  clearable: {
    type: Boolean,
    default: false,
  },
})
const isLoading = ref<boolean>(false)
const devicesOptions = ref<SelectOption[]>([])

const deviceOptionsShow = computed(() => 
  devicesOptions.value.filter(opt => opt.value !== 'ALL')
)

const fetchDevicesByTraffic = async () => {
  const devicesOptionsResult = await ctr_traffic_source.GetDevice(props.campaign.traffic_source)
  devicesOptions.value = devicesOptionsResult?.data?.devices || []
}

// Kiểm tra xem có option nào được chọn chưa
const hasSelectedDevices = computed(() => {
  return (props.campaign.filters?.device?.values?.length ?? 0) > 0
})

watch(
  () => props.campaign.filters?.device?.values?.length,
  (newLength) => {
    const device = props.campaign.filters?.device
    if (!device) return

    if (newLength === 0 && device.operator === INEX.EXCLUDE) {
      device.operator = INEX.INCLUDE
    }
  }
)

onMounted(() => {
  if (!props.campaign.filters) {
    props.campaign.filters = {}
  }

  if (!props.campaign.filters.device) {
    props.campaign.filters.device = {
      values: [],
      operator: INEX.INCLUDE,
    }
  }

  fetchDevicesByTraffic()
})
</script>

<template>
  <div
    v-if="props.campaign.filters?.device"
    class="flex-1 min-w-0 flex items-center gap-2 name-affect-comp"
  >
    <FloatingWrapper name="Device" rounded>
      <n-select
        v-model:value="props.campaign.filters.device.values"
        multiple
        filterable
        :clearable="props.clearable"
        value-field="value"
        label-field="name"
        placeholder="All"
        :loading="isLoading"
        :options="deviceOptionsShow"
      />
    </FloatingWrapper>
    <CustomSwitch
      v-model="props.campaign.filters.device.operator"
      type="inex"
      true-label="Include"
      false-label="Exclude"
      size="small"
      :disabled="!hasSelectedDevices"
    />
  </div>
</template>
