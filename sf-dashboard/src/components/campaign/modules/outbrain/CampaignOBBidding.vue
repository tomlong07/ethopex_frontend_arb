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
const biddingOptions = ref<SelectOption[]>([])
const isLoading = ref(false)

const onUpdateValueBidding = (value: string) => {
  if (value === 'TARGET_ROAS_FULLY_AUTOMATED' && props.FreezeData.isAddPage()) {
    props.campaign.cpc = 150
  } else {
    props.campaign.cpc = 0
  }
}
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

onMounted(() => {
  if (props.campaign.IsAPI()) {
    fetchBiddingByTraffic()
  }
})

const name = 'Bidding'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <div class="flex-1 min-w-0">
      <n-input-group>
        <n-select
          v-model:value="props.campaign.bidding"
          value-field="value"
          label-field="label"
          :placeholder="name"
          class="w-2/5"
          :loading="isLoading"
          :options="biddingOptions"
          @update:value="onUpdateValueBidding"
        />
        <n-input-number
          v-model:value="campaign.cpc"
          class="w-3/5"
          :disabled="
            campaign.bidding === 'Max Conversions' && FreezeData.isEditPage()
          "
        >
          <template #prefix
            ><span>{{
              campaign.bidding === 'TARGET_ROAS_FULLY_AUTOMATED' ? '%' : '$'
            }}</span></template
          >
        </n-input-number>
      </n-input-group>
    </div>
  </FloatingWrapper>
</template>
