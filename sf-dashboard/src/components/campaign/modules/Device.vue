<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import api_v2 from '@/core/api_v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { deviceOptionsGGDisplay } from '@/options/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  clearable: {
    type: Boolean,
    default: false,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const isLoading = ref<boolean>(false)
const devicesOptions = ref<SelectOption[]>([])

const deviceOptionsShow = computed<SelectOption[]>(() => {
  const isNotSelect = !props.campaign?.device || !props.campaign.device.length
  if (isNotSelect) {
    return devicesOptions.value
  }

  const isHasAll = props.campaign?.device?.includes('ALL')

  let options: SelectOption[] = []

  for (let index = 0; index < devicesOptions.value.length; index++) {
    const element = helper.clone(devicesOptions.value[index])
    if (isHasAll) {
      if (element.value === 'ALL') {
        options.push(element)
      } else {
        element.disabled = true
        options.push(element)
      }
    } else {
      if (element.value === 'ALL') {
        element.disabled = true

        options.push(element)
      } else {
        options.push(element)
      }
    }
  }

  return options
})

const fetchDevicesByTraffic = async () => {
  const devicesOptionsResult = await api_v2.request({
    url: 'traffic-source/get-device',
    params: { traffic_source: props.campaign.traffic_source },
  })
  devicesOptions.value = devicesOptionsResult?.data?.devices || []
}

const isShow = computed(() => {
  if (props.campaign.IsTrafficGoogle()) {
    return props.campaign.IsDemandGen() && props.campaign.IsAPI()
  }

  return props.campaign.IsAPI()
})

const isShowForGGDisplay = computed(() => {
  return props.campaign.IsGGDisplay() && props.campaign.IsAPI()
})

onMounted(() => {
  if (isShow.value) {
    fetchDevicesByTraffic()
  }
  if (isShowForGGDisplay.value) {
    devicesOptions.value = deviceOptionsGGDisplay

    if (!props.campaign.device) {
      props.campaign.device = ['ALL']
    }
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      fetchDevicesByTraffic()
    } else {
      props.campaign.device = undefined
    }
  }
)

watch(
  () => isShowForGGDisplay.value,
  async (newValue, oldValue) => {
    if (newValue) {
      devicesOptions.value = deviceOptionsGGDisplay
      props.campaign.device = ['ALL']
    } else {
      props.campaign.device = undefined
    }
  }
)

const isDisabled = computed(() => {
  if (props.campaign.IsTrafficPocPoc()) return false
  return props.FreezeData.isEditPage()
})
</script>

<template>
  <FloatingWrapper name="Device" rounded v-if="isShow || isShowForGGDisplay">
    <n-select
      v-model:value="props.campaign.device"
      multiple
      filterable
      :clearable="props.clearable"
      value-field="value"
      label-field="name"
      :loading="isLoading"
      :options="deviceOptionsShow"
      :disabled="isDisabled"
    />
  </FloatingWrapper>
</template>
