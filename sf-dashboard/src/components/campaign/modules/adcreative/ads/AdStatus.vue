<script lang="ts" setup>
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { ONOFF } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  item: {
    type: Object as () => any,
    required: true,
  },
})

const tempStatus = ref<ONOFF>(props.item.status)

const ChangeStatusAd = async (value: ONOFF) => {
  const statusLoading = window.message.loading('Processing...')

  try {
    const payload = {
      campaign_id: props.campaign.id,
      creative_submit_id: props.item.id,
      status: value,
    }

    const result = await ctr_campaign.ChangeStatusAds(payload)

    if (result?.status) {
      props.item.status = value
      window.message.success('Status changed successfully')
    } else {
      tempStatus.value = props.item.status
    }
  } catch {
    tempStatus.value = props.item.status
  } finally {
    statusLoading.destroy()
  }
}
const NegativeStatus = (value: ONOFF) => {
  props.item.status = value == ONOFF.OFF ? ONOFF.ON : ONOFF.OFF
}

watch(
  () => props.item.status,
  (v) => {
    if (v) {
      tempStatus.value = v
    }
  }
)
const name = 'Status'
</script>
<template>
  <div class="flex items-center gap-2">
    <div class="w-40">{{ name }}</div>
    <div class="w-[calc(100%-10rem)]">
      <div v-if="!props.item.status">N/A</div>
      <n-popconfirm
        v-else
        @positive-click="ChangeStatusAd(tempStatus)"
        @negative-click="NegativeStatus(tempStatus)"
        :positive-text="tempStatus === 'on' ? 'Turn On' : 'Turn Off'"
        negative-text="Cancel"
      >
        <template #trigger>
          <CustomSwitch
            v-model="props.item.status"
            type="onoff"
            true-label="On"
            false-label="Off"
            size="small"
          />
        </template>
        {{ tempStatus === 'on' ? 'Turn on this ad?' : 'Turn off this ad?' }}
      </n-popconfirm>
    </div>
  </div>
</template>
