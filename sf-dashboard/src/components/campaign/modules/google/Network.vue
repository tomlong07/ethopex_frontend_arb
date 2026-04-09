<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsGGSearch(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.search_network = false
      props.campaign.display_network = false
    } else {
      props.campaign.search_network = undefined
      props.campaign.display_network = undefined
    }
  }
)
</script>

<template>
  <n-card
    title="Networks"
    class="card-flex-gap-4 rounded-[5px] !border-gray2"
    v-if="props.campaign.IsGGSearch()"
  >
    <div class="flex items-center gap-2">
      <div class="w-40 font-bold">Search Network</div>
      <div class="flex-1 min-w-0">
        <n-checkbox v-model:checked="props.campaign.search_network"
          >Include Google search partners</n-checkbox
        >
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-40 font-bold">Display Network</div>
      <div class="flex-1 min-w-0">
        <n-checkbox v-model:checked="props.campaign.display_network"
          >Include Google Display Network</n-checkbox
        >
      </div>
    </div>
  </n-card>
</template>
