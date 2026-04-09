<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { systemOptions } from '@/options/campaign'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

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

const isShow = computed(() => {
  return (
    props.campaign.IsDemandGen() &&
    props.campaign.IsAPI() &&
    props.campaign.device?.length
  )
})

onMounted(() => {})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (!newValue) {
      props.campaign.operating_systems = undefined
    }
  }
)

const name = `Operating System`
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-select
      v-model:value="props.campaign.operating_systems"
      multiple
      filterable
      :placeholder="name"
      :options="systemOptions"
      clearable
      :disabled="props.FreezeData.isEditPage()"
    />
  </FloatingWrapper>
</template>
