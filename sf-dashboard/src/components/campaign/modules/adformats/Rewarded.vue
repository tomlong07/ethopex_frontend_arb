<script lang="ts" setup>
import { campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import DialogRewarded from './dialog/DialogRewarded.vue'

const name = 'Rewarded'
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const rewarded = computed({
  get: () =>
    props.campaign.ad_formats?.rewarded ?? {
      status: 'off',
      floor_price: 0,
    },
  set: (value) => {
    if (props.campaign.ad_formats) {
      props.campaign.ad_formats.rewarded = value
    }
  },
})

const currentStatus = computed({
  get: () => rewarded.value.status === 'on',
  set: (value: boolean) => {
    rewarded.value = {
      ...rewarded.value,
      status: value ? 'on' : 'off',
    }
  },
})
</script>
<template>
  <div>
    <div class="flex flex-row place-items-center gap-4">
      <div class="w-20 flex-shrink-0">
        <CustomSwitch
          v-model="currentStatus"
          type="boolean"
          true-label="On"
          false-label="Off"
          size="small"
        />
      </div>
      <div class="w-[7rem] flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <FloatingWrapper :name="name" rounded>
          <n-input-number
            v-model:value="rewarded.floor_price"
            placeholder="Floor Price"
            class="w-full"
            :min="0"
          />
        </FloatingWrapper>
      </div>
    </div>
  </div>
  <DialogRewarded :campaign="props.campaign" />
</template>
