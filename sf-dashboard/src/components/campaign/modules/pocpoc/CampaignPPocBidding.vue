<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
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

const isLoading = ref<boolean>(false)
const biddingOptions = ref<SelectOption[]>([])

const fetchBiddingByTraffic = async () => {
  isLoading.value = true
  const result = await ctr_traffic_source.GetBidding({
    traffic_source: props.campaign.traffic_source,
  })
  biddingOptions.value = result?.data || []

  isLoading.value = false
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      await fetchBiddingByTraffic()
    } else {
      props.campaign.bidding = undefined
    }
  }
)

const onUpdateValueBidding = (value: string) => {
  props.campaign.cpc = 0
}
onMounted(() => {
  if (props.campaign.IsAPI()) {
    fetchBiddingByTraffic()
  }
})

const name = 'Bidding'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <n-input-group>
      <n-select
        :placeholder="name"
        v-model:value="props.campaign.bidding"
        value-field="value"
        label-field="label"
        class="w-2/5"
        :disabled="FreezeData.isEditPage()"
        :loading="isLoading"
        :options="biddingOptions"
        @update:value="onUpdateValueBidding"
      />
      <n-input-number
        v-model:value="props.campaign.cpc"
        class="w-3/5"
        :disabled="props.campaign.bidding === 'rev_share'"
      >
        <template #prefix><span>$</span></template>
      </n-input-number>
    </n-input-group>
  </FloatingWrapper>
</template>
