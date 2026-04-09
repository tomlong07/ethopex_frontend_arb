<script lang="ts" setup>
import Dialog from '@/components/common/Dialog.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const name = 'UnlockContent'
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const unlock_content = computed({
  get: () =>
    props.campaign.ad_formats?.unlock_content ?? {
      status: 'off',
      floor_price: 0,
    },
  set: (value) => {
    if (props.campaign.ad_formats) {
      props.campaign.ad_formats.unlock_content = value
    }
  },
})

const currentStatus = computed({
  get: () => unlock_content.value.status === 'on',
  set: (value: boolean) => {
    unlock_content.value = {
      ...unlock_content.value,
      status: value ? 'on' : 'off',
    }
  },
})
const unlockConfig = computed(() => props.campaign.ad_formats?.unlock_content)
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
            v-model:value="unlock_content.floor_price"
            placeholder="Floor Price"
            class="w-full"
            :min="0"
          />
        </FloatingWrapper>
      </div>
    </div>
  </div>
  <Dialog
    v-if="unlockConfig?.status === 'on' && unlockConfig?.type"
    :campaign="props.campaign"
    :typeValue="unlockConfig?.type"
  />
</template>
