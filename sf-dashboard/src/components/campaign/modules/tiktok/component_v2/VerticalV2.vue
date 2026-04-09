<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { CampaignContext } from '@/types/components/campaign-v2'
import ctr_demand_source from '@/services/ctr_demand_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const verticalOptions = ref<SelectOption[]>([])

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.data.campaign.isShowVertical(),
  async (newValue, oldValue) => {
    if (newValue) {
      fetchVerticalOptions()
    } else {
      props.data.campaign.vertical = undefined
    }
  }
)

const fetchVerticalOptions = async () => {
  const result = await ctr_demand_source.GetVerticals({
    user_flow: props.data.campaign.demand_source,
  })
  verticalOptions.value = result?.data?.verticals || []
}

// onMounted(() => {
//   if (campaign.isShowVertical()) {
//     fetchVerticalOptions()
//   }
// })

watch(
  () => props.data.statusData.IsTabCampaign(),
  (v) => {
    if (props.data.campaign.isShowVertical() && v) {
      fetchVerticalOptions()
    }
  },
  { deep: true }
)
const name = 'Vertical'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.data.campaign.isShowVertical()"
  >
    <n-select
      v-model:value="props.data.campaign.vertical"
      value-field="value"
      label-field="vertical"
      :placeholder="name"
      :options="verticalOptions"
    />
  </FloatingWrapper>
</template>
