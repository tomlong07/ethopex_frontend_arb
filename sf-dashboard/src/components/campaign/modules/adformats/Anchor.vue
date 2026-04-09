<script lang="ts" setup>
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const name = 'Anchor'
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const anchor = computed({
  get: () =>
    props.campaign.ad_formats?.anchor ?? {
      status: 'off',
      floor_price: 0,
    },
  set: (value) => {
    if (props.campaign.ad_formats) {
      props.campaign.ad_formats.anchor = value
    }
  },
})

const currentStatus = computed({
  get: () => anchor.value.status === 'on',
  set: (value: boolean) => {
    anchor.value = {
      ...anchor.value,
      status: value ? 'on' : 'off',
    }
  },
})
</script>
<template>
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
          v-model:value="anchor.floor_price"
          placeholder="Floor Price"
          class="w-full"
          :min="0"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
