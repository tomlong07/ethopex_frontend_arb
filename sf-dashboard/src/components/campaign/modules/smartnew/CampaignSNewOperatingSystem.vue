<script setup lang="ts">
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
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <n-select
        v-model:value="props.campaign.operating_systems"
        multiple
        filterable
        :placeholder="name"
        :options="systemOptions"
        clearable
        :disabled="props.FreezeData.isEditPage()"
      />
    </div>
  </div>
</template>
