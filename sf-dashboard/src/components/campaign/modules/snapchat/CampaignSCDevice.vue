<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import api_v2 from '@/core/api_v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
const isLoading = ref<boolean>(false)
const devicesOptions = ref<SelectOption[]>([])
const devicesOptionsShow = computed<SelectOption[]>(() => {
  let res = []
  for (let index = 0; index < devicesOptions.value.length; index++) {
    const element = devicesOptions.value[index]
    switch (true) {
      case element.value === 'iOS' &&
        props.campaign.device?.includes('iOS') &&
        !props.campaign.device?.includes('ANDROID'):
        res.push({ ...element, disabled: true })

        break
      case element.value === 'ANDROID' &&
        props.campaign.device?.includes('ANDROID') &&
        !props.campaign.device?.includes('iOS'):
        res.push({ ...element, disabled: true })

        break

      default:
        res.push(element)

        break
    }
  }

  return res
})

const fetchDevicesByTraffic = async () => {
  const devicesOptionsResult = await api_v2.request({
    url: 'traffic-source/get-device',
    params: { traffic_source: props.campaign.traffic_source },
  })
  devicesOptions.value = devicesOptionsResult?.data?.devices || []

  //Chọn tất device lúc đầu
  if (!props.campaign.device || !props.campaign.device.length) {
    props.campaign.device = []
    devicesOptions.value.forEach((element) => {
      props.campaign.device?.push(element.value as string)
    })
  }
}

onMounted(() => {
  if (props.campaign.IsAPI()) {
    fetchDevicesByTraffic()
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      fetchDevicesByTraffic()
    } else {
      props.campaign.device = undefined
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Device" rounded>
    <n-select
      v-model:value="campaign.device"
      multiple
      filterable
      value-field="value"
      label-field="name"
      :loading="isLoading"
      :options="devicesOptionsShow"
    />
  </FloatingWrapper>
</template>
