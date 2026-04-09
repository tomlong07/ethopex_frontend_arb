<script lang="ts" setup>
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { optionType } from '@/options/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const name = 'Display'
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const display = computed({
  get: () =>
    props.campaign.ad_formats?.display ?? {
      status: 'off',
      type: 'banner',
      floor_price: 0,
    },
  set: (value) => {
    if (props.campaign.ad_formats) {
      props.campaign.ad_formats.display = value
    }
  },
})

const currentStatus = computed({
  get: () => display.value.status === 'on',
  set: (value: boolean) => {
    display.value = {
      ...display.value,
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
    <div class="w-[7rem] flex-shrink-0">
      <n-select
        v-model:value="display.type"
        placeholder="Select Type"
        :options="optionType"
      />
    </div>
    <div class="flex-1 min-w-0">
      <FloatingWrapper :name="name" rounded>
        <n-input-number
          v-model:value="display.floor_price"
          placeholder="Floor Price"
          class="w-full"
          :min="0"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
