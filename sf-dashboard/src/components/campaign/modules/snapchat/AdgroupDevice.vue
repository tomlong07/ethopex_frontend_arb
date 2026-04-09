<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  adGroups,
  FreezeClass,
} from '@/types/components/campaign-v2'
import api_v2 from '@/core/api_v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { linkField } from './helpers'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const isLoading = ref<boolean>(false)
const devicesOptions = ref<SelectOption[]>([])
const deviceModel = linkField<string[] | null>(
  'device',
  [() => props.adGroup],
  { fallback: [] }
)
const selectedDevices = computed<string[]>(() => deviceModel.value ?? [])
const devicesOptionsShow = computed<SelectOption[]>(() => {
  let res = []
  for (let index = 0; index < devicesOptions.value.length; index++) {
    const element = devicesOptions.value[index]
    const hasIOS = selectedDevices.value.includes('iOS')
    const hasAndroid = selectedDevices.value.includes('ANDROID')

    switch (true) {
      case element.value === 'iOS' && hasIOS && !hasAndroid:
        res.push({ ...element, disabled: true })

        break
      case element.value === 'ANDROID' && hasAndroid && !hasIOS:
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
  if (!selectedDevices.value.length) {
    deviceModel.value = devicesOptions.value.map(
      (element) => element.value as string
    )
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
      deviceModel.value = undefined as unknown as string[] | null
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Device" rounded>
    <n-select
      v-model:value="deviceModel"
      multiple
      filterable
      value-field="value"
      label-field="name"
      :loading="isLoading"
      :options="devicesOptionsShow"
      :disabled="props.FreezeData.isEditPage()"
    />
  </FloatingWrapper>
</template>
