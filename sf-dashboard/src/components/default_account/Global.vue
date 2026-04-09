<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import CustomSwitch from '../common/CustomSwitch.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Global`

watch(
  () => defaultAccountStore.isFacebook,
  (newVal) => {
    if (newVal) {
      if (!defaultAccountStore.defaultAccountData.max_campaign_status) {
        defaultAccountStore.defaultAccountData.max_campaign_status = ONOFF.OFF
      }
    } else {
      defaultAccountStore.defaultAccountData.max_campaign_status = null
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2" v-if="defaultAccountStore.isFacebook">
    <div class="w-28 font-bold text-xs">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="defaultAccountStore.defaultAccountData.global"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
