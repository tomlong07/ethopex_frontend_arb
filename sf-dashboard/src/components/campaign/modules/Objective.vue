<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const typeObjectOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)

onMounted(async () => {
  if (props.campaign.IsAPI() || props.campaign.IsTrafficNewsbreak()) {
    await fetchTypeByTraffic()
  }
})

const fetchTypeByTraffic = async () => {
  const result = await ctr_traffic_source.GetType(props.campaign.traffic_source)

  typeObjectOptions.value = result.data?.types || []
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  [() => props.campaign.IsAPI(), () => props.campaign.IsTrafficNewsbreak()],
  async ([isApi, isNewsbreak]) => {
    if (isApi || isNewsbreak) {
      await fetchTypeByTraffic()
    } else {
      props.campaign.type = undefined
    }
  }
)

const name = computed(() => {
  switch (true) {
    case props.campaign.IsTrafficMgId() ||
      props.campaign.IsTrafficTiktok() ||
      props.campaign.IsTrafficNewsbreak():
      return 'Objective'
    case props.campaign.IsTrafficPocPoc():
      return 'Object'
  }

  return 'Object'
})

const isDisabled = computed(() => {
  if (props.campaign.IsTrafficTiktok() && props.FreezeData.isEditPage()) {
    return true
  }

  return false
})
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.campaign.type"
      value-field="value"
      label-field="name"
      :placeholder="name"
      :disabled="isDisabled"
      :loading="isLoading"
      :options="typeObjectOptions"
    />
  </FloatingWrapper>
</template>
