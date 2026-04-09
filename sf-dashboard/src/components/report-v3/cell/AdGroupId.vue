<script setup lang="ts">
import { railStyle } from '@/utils/styleHelper'

import { ONOFF, TS } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import { NSwitch } from 'naive-ui'

const props = defineProps({
  data: Object,
  alertOn: Boolean,
})

const campaignID = props.data?.campaign_name?.id
const adGroupID = props.data?.ad_group?.ad_group_id
const adGroupStatus = props.data?.ad_group?.status || ONOFF.OFF
const active = ref(adGroupStatus)
const isLoading = ref(false)
const isAcceptTs = [TS.FACEBOOK, TS.GOOGLE, TS.TIKTOK].includes(
  props.data?.traffic_source
) //Tắt tạm đợi confirm cái traffic_source

//Chỉ cần handle nội bộ ko cần update ra tabulator
const onClick = async () => {
  if (!isAcceptTs) {
    window.message.warning('This traffic source is not supported')
    return
  }
  if (!campaignID) return

  const newStatus = active.value === ONOFF.ON ? ONOFF.OFF : ONOFF.ON
  if (props.alertOn) {
    const message = `Are you sure you want to change status to ${newStatus}?`
    if (!window.confirm(message)) return
  }

  isLoading.value = true
  const loading = window.message.loading('Changing is on process. Please wait!')

  const result = await ctr_campaign.ChangeStatusAdGroup({
    id: campaignID,
    status: newStatus,
    campaign_id: campaignID,
    ad_group_id: adGroupID,
  })

  if (result?.status) {
    active.value = newStatus
    window.message.success('Status updated successfully')
  }

  loading.destroy()

  isLoading.value = false
}
</script>

<template>
  <div class="flex items-center w-full gap-2" v-if="adGroupID">
    <div class="truncate flex-1 min-w-0">
      {{ props.data?.ad_group?.name }}
    </div>
    <n-switch
      v-if="props.data?.traffic_source"
      class="flex-shrink-0 w-16"
      :rail-style="railStyle"
      :value="active"
      :on-update:value="onClick"
      checked-value="on"
      unchecked-value="off"
      :loading="isLoading"
    />
  </div>
</template>
