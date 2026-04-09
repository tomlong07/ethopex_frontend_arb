<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})
const isLoading = ref<boolean>(false)

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      return
    } else {
      props.adgroup.optimization_event = undefined
    }
  }
)

const optimizationEventOptions = computed(() => {
  // Lấy index từ uniqueKey nếu có dạng "id_index"
  let targetIndex: number | null = null
  const pixelValue = props.adgroup.pixel

  if (!pixelValue) {
    props.adgroup.optimization_event = null
    return []
  }

  if (typeof pixelValue === 'string' && pixelValue.includes('_')) {
    const parts = pixelValue.split('_')
    targetIndex = parseInt(parts[parts.length - 1])
  }

  // Tìm pixel theo index
  let pixel: any = null

  props.statusData.pixelsTemp?.forEach((item: any, index: number) => {
    if (targetIndex === index) {
      pixel = item
    }
  })

  const pixelEventOptions =
    pixel?.events?.map((event: any) => ({
      label: event.name,
      value: event.value,
    })) ?? []

  const allOptions = [...pixelEventOptions]

  if (props.campaign.optimization_goal === 'VALUE') {
    props.adgroup.optimization_event = 'SHOPPING'
    return allOptions.filter((item) => item.value === 'SHOPPING')
  }

  return allOptions
})

watch(
  () => props.adgroup.pixel,
  () => {
    if (optimizationEventOptions.value.length <= 0) {
      props.adgroup.optimization_event = null
    }
  }
)

watch(
  () => props.adgroup.optimization_event,
  (newValue) => {
    props.campaign.optimization_event = newValue
  }
)
</script>

<template>
  <div v-if="props.campaign.IsAPI()" class="flex items-center gap-2">
    <FloatingWrapper name="Optimization event" rounded required>
      <div class="flex-1 min-w-0">
        <n-select
          v-model:value="props.adgroup.optimization_event"
          filterable
          clearable
          :disabled="
            (props.FreezeData.isEditPage() ||
              !props.campaign?.account_supply_id ||
              !props.adgroup?.pixel) &&
            (props.campaign.IsSmartCreated() ||
              (!!props.adgroup.id && !!props.adgroup.ad_group_id))
          "
          :loading="isLoading"
          :options="optimizationEventOptions"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
