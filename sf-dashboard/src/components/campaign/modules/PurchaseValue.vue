<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { PurchaseValueTypeOptions } from '@/options/campaign'
import { PURCHASE_VALUE_TYPE } from '@/enum/campaign'

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

const name = 'Purchase Value'

const nameValue = computed(() => {
  switch (true) {
    case props.campaign.purchase_value?.IsRPC():
      return 'RPC to day min x conversions'
    case props.campaign.purchase_value?.IsFixed():
      return 'RPC '

    default:
      return ''
  }
})

const updatePurchaseValue = (value: PURCHASE_VALUE_TYPE) => {
  props.campaign.purchase_value!.purchase_value_type = value

  switch (true) {
    case props.campaign.purchase_value!.IsRPC():
      props.campaign.purchase_value!.value = undefined
      props.campaign.purchase_value!.conversions = 10

      break

    case props.campaign.purchase_value!.IsFixed():
      props.campaign.purchase_value!.conversions = undefined
      props.campaign.purchase_value!.value = 0.01

      break

    default:
      props.campaign.purchase_value!.value = undefined
      props.campaign.purchase_value!.conversions = undefined

      break
  }
}

const isShowPurchase =
  window.arb.isAdmin() || window.arb.isDev() || window.arb.isAnt()
</script>

<template>
  <div
    class="flex gap-2"
    v-if="
      props.campaign.purchase_value &&
      (isShowPurchase ||
        ((props.campaign.IsCampOfKen() || props.campaign.IsCampOfAnt()) &&
          FreezeData.isEditPage()))
    "
  >
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="props.campaign.purchase_value.purchase_value_type"
        clearable
        tag
        :placeholder="name"
        :options="PurchaseValueTypeOptions"
        :on-update:value="updatePurchaseValue"
      />
    </FloatingWrapper>

    <FloatingWrapper
      rounded
      v-if="props.campaign.purchase_value"
      :name="nameValue"
    >
      <n-input-number
        v-if="props.campaign.purchase_value?.IsRPC()"
        v-model:value="props.campaign.purchase_value.conversions"
      >
      </n-input-number>

      <n-input-number
        v-if="props.campaign.purchase_value?.IsFixed()"
        v-model:value="props.campaign.purchase_value.value"
      >
        <template #prefix>$</template>
      </n-input-number>
    </FloatingWrapper>
  </div>
</template>
