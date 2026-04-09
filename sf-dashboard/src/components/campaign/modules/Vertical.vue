<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import ctr_demand_source from '@/services/ctr_demand_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})
const verticalOptions = ref<SelectOption[]>([])

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.isShowVertical(),
  async (newValue, oldValue) => {
    if (newValue) {
      fetchVerticalOptions()
    } else {
      props.campaign.vertical = undefined
    }
  }
)

const fetchVerticalOptions = async () => {
  const result = await ctr_demand_source.GetVerticals({
    user_flow: props.campaign.demand_source,
  })
  verticalOptions.value = result?.data?.verticals || []
}

// onMounted(() => {
//   if (props.campaign.isShowVertical()) {
//     fetchVerticalOptions()
//   }
// })

watch(
  () => props.statusData.IsTabCampaign(),
  (v) => {
    if (props.campaign.isShowVertical() && v) {
      fetchVerticalOptions()
    }
  },
  { deep: true }
)
const name = 'Vertical'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.isShowVertical()">
    <n-select
      v-model:value="props.campaign.vertical"
      value-field="value"
      label-field="vertical"
      :placeholder="name"
      :options="verticalOptions"
    />
  </FloatingWrapper>
</template>
