<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { CampaignContext } from '@/types/components/campaign-v2'
import { GDOptions } from '@/options/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const gdOptions = ref<SelectOption[]>(GDOptions)

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.data.campaign.isShowGD(),
  async (newValue, oldValue) => {
    if (!newValue) {
      props.data.campaign.gd = undefined
    }
  }
)

const changeGDFollowUserFlow = () => {
  if (props.data.campaign.user_flow === '3click') {
    gdOptions.value.forEach((item) => {
      if (item.value === 'AP1005627') {
        item.disabled = false
      } else {
        item.disabled = true
      }
    })
  } else {
    gdOptions.value.forEach((item) => {
      if (item.value === 'AP1005627') {
        item.disabled = true
      } else {
        item.disabled = false
      }
    })
  }
}

watch(
  () => props.data.statusData?.IsTabCampaign(),
  (v) => {
    if (v) changeGDFollowUserFlow()
  },
  { deep: true }
)

const name = 'GD'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.data.campaign.isShowGD()">
    <n-select
      v-model:value="props.data.campaign.gd"
      filterable
      :placeholder="name"
      :options="gdOptions"
    />
  </FloatingWrapper>
</template>
