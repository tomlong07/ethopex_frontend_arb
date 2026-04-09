<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'

import Checkmark from '@/assets/icons/Checkmark.vue'
import { railStyle } from '@/utils/styleHelper'
import { ctr_campaign } from '@/services/ctr_campaign'
import { NIcon, NSwitch } from 'naive-ui' //Import để dùng ở component ở report tabulator

const props = defineProps({
  campaignId: {
    type: Number,
    required: false,
  },
  item: {
    type: Object as () => any,
    required: true,
  },
})

const isChanging = ref<boolean>(false)

const changeAdStatus = async (newVal: string) => {
  isChanging.value = true
  const statusLoading = window.message.loading('Processing...')

  let payload: { [key: string]: any } = {
    campaign_id: props.campaignId,
    ad_id: props.item.id,
    status: newVal,
  }

  const result = await ctr_campaign.ChangeStatusAds(payload)

  statusLoading.destroy()

  if (result?.status) {
    window.message.success('Status changed successfully')
    props.item.status = newVal
  }

  isChanging.value = false
}
</script>

<template>
  <n-switch
    class="ml-auto"
    :rail-style="railStyle"
    v-model:value="props.item.status"
    checked-value="on"
    unchecked-value="off"
    :loading="isChanging"
    :on-update:value="changeAdStatus"
  >
    <template #checked-icon>
      <n-icon :component="Checkmark" color="#121212" />
    </template>
    <template #unchecked-icon> <n-icon :component="Close" /> </template
  ></n-switch>
</template>
