<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

import { BIDSTRATEGY } from '@/enum/campaign'
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
  width: {
    type: String,
    default: 'w-40',
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const optionComps = computed<SelectOption[]>(() => {
  if (props.campaign.type === 'WEB_CONVERSION') {
    if (!props.adgroup.bid_strategy) {
      props.adgroup.bid_strategy = BIDSTRATEGY.MAX_CONVERSION
    }
    return [
      { value: BIDSTRATEGY.TARGET_CPA, label: 'Target CPA' },
      {
        value: BIDSTRATEGY.MAX_CONVERSION,
        label: 'Max conversions',
      },
    ]
  }
  if (props.campaign.type === 'WEB_TRAFFIC') {
    props.adgroup.bid_strategy = BIDSTRATEGY.CPC
    return [{ value: BIDSTRATEGY.CPC, label: 'CPC' }]
  }
  return []
})

const disableCpc = computed(() => {
  if (props.adgroup.bid_strategy === BIDSTRATEGY.MAX_CONVERSION) {
    props.adgroup.cpc = undefined
    return false
  }
  return true
})

const name = 'Bidding'
</script>

<template>
  <div class="flex items-center gap-2" v-if="props.campaign.type">
    <FloatingWrapper :name="name">
      <div class="flex-1 min-w-0">
        <n-input-group>
          <n-select
            v-model:value="props.adgroup.bid_strategy"
            :options="optionComps"
            class="w-2/5"
            placeholder="Budget type"
          />
          <n-input-number
            v-if="disableCpc"
            v-model:value="props.adgroup.cpc"
            :precision="2"
            class="w-2/5"
            style="flex: 1"
          >
            <template #prefix> $ </template>
          </n-input-number>
        </n-input-group>
      </div>
    </FloatingWrapper>
  </div>
</template>
