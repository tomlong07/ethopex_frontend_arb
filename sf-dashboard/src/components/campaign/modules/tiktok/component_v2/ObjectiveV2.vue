<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { CampaignContext } from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const typeObjectOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)

onMounted(async () => {
  if (props.data.campaign.IsAPI() || props.data.campaign.IsTrafficNewsbreak()) {
    await fetchTypeByTraffic()
  }
})

const fetchTypeByTraffic = async () => {
  const result = await ctr_traffic_source.GetType(
    props.data.campaign.traffic_source
  )

  typeObjectOptions.value = result.data?.types || []
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  [
    () => props.data.campaign.IsAPI(),
    () => props.data.campaign.IsTrafficNewsbreak(),
  ],
  async ([isApi, isNewsbreak]) => {
    if (isApi || isNewsbreak) {
      await fetchTypeByTraffic()
    } else {
      props.data.campaign.type = undefined
    }
  }
)

const name = computed(() => {
  switch (true) {
    case props.data.campaign.IsTrafficMgId() ||
      props.data.campaign.IsTrafficTiktok() ||
      props.data.campaign.IsTrafficNewsbreak():
      return 'Objective'
    case props.data.campaign.IsTrafficPocPoc():
      return 'Object'
  }

  return 'Object'
})

const isDisabled = computed(() => {
  if (
    props.data.campaign.IsTrafficTiktok() &&
    props.data.FreezeData.isEditPage()
  ) {
    return true
  }

  return false
})
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.data.campaign.type"
      value-field="value"
      label-field="name"
      :placeholder="name"
      :disabled="isDisabled"
      :loading="isLoading"
      :options="typeObjectOptions"
    />
  </FloatingWrapper>
</template>
