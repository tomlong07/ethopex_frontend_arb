<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

// const biddingOptions = computed<SelectOption[]>(() => {
//   // if (props.campaign.IsPMax()) {
//   //   return biddingOptionsGoogle.filter(
//   //     (option) => option.value !== 'targetSpend'
//   //   );
//   // }
//   return biddingOptionsGoogle;
// });

// const onUpdateBidding = (value: string) => {
//   props.campaign.bidding_status = false;
//   props.campaign.cpc = 0;
// };

const onUpdateValueBidding = (value: boolean) => {
  if (props.campaign.ad_groups) {
    props.campaign.ad_groups[props.index].bidding_status = value
    if (!value) {
      props.campaign.ad_groups[props.index].cpc = 0
    }
  }
}

// const renderOption = ({
//   node,
//   option,
// }: {
//   node: VNode;
//   option: SelectOption;
// }) => {
//   if (option.disabled) {
//     return h(NTooltip, null, {
//       trigger: () => node,
//       default: () => {
//         return 'Not available';
//       },
//     });
//   }

//   return node;
// };

watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    // if (props.campaign.ad_groups) {
    //   //Nếu khi đổi campaign_type, bidding đang chọn ko có thì đổi về option đầu tiên khả dụng
    //   const bidding = props.campaign.ad_groups[props.index].bidding;
    //   if (bidding) {
    //     if (
    //       !biddingOptions.value.find((element) => element.value === bidding)
    //     ) {
    //       props.campaign.ad_groups[props.index].bidding = biddingOptions
    //         .value[0].value as string;
    //     }
    //   }
    // }
  }
)

onMounted(() => {
  if (props.campaign.ad_groups) {
    // if (!props.campaign.ad_groups[props.index].bidding) {
    //   props.campaign.ad_groups[props.index].bidding = biddingOptions.value[0]
    //     .value as string;
    // }
    if (!props.campaign.ad_groups[props.index].cpc)
      props.campaign.ad_groups[props.index].cpc = 0
    if (!props.campaign.ad_groups[props.index].bidding_status)
      props.campaign.ad_groups[props.index].bidding_status = false
  }
})

const name = 'Bidding'

const isDisabledBiddingStatus = computed<boolean>(() => {
  if (props.campaign.IsDemandGen()) {
    if (!props.campaign.ad_groups) return true
    if (props.campaign.ad_groups) {
      if (props.campaign.ad_groups[props.index].bidding === 'targetSpend') {
        return true
      }

      if (props.FreezeData.isAddPage()) {
        if (
          !props.campaign.bidding ||
          !props.campaign.bidding_status ||
          !props.campaign.cpc
        )
          return true
      }

      if (props.FreezeData.isEditPage()) {
        if (props.campaign.ad_groups[props.index].id) {
          return false
        } else {
          if (
            !props.campaign.bidding ||
            !props.campaign.bidding_status ||
            !props.campaign.cpc
          )
            return true
        }
      }

      return false
    }

    return false
  }

  return false
})

const isDisabledBiddingCpc = computed<boolean>(() => {
  if (props.campaign.IsGGDisplay()) return false
  return (
    isDisabledBiddingStatus.value ||
    !props.campaign.ad_groups ||
    !props.campaign.ad_groups[props.index].bidding_status
  )
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="
      props.campaign.ad_groups &&
      (props.campaign.IsDemandGen() || props.campaign.IsManualCPC())
    "
  >
    <n-input-group class="flex gap-2 place-items-center">
      <n-checkbox
        v-if="props.campaign.IsDemandGen()"
        v-model:checked="props.campaign.ad_groups[props.index].bidding_status"
        class="w-28"
        :disabled="isDisabledBiddingStatus"
        :on-update:checked="onUpdateValueBidding"
      >
        Set Target
      </n-checkbox>
      <n-input-number
        class="flex-grow"
        v-model:value="props.campaign.ad_groups[props.index].cpc"
        :min="props.campaign.IsManualCPC() ? '0.01' : '0'"
        max="10000"
        :precision="props.campaign.IsManualCPC() ? 2 : undefined"
        :disabled="isDisabledBiddingCpc"
      >
        <template
          #prefix
          v-if="props.campaign.bidding !== 'maximizeConversionValue'"
          ><span>$</span></template
        >
        <template
          #suffix
          v-if="props.campaign.bidding === 'maximizeConversionValue'"
          ><span>% </span></template
        >
      </n-input-number>
    </n-input-group>
  </FloatingWrapper>
</template>
