<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import CustomSwitch from '../common/CustomSwitch.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Max Campaign Status`

watch(
  () => defaultAccountStore.isFacebook || defaultAccountStore.isGoogleAdsense,
  (newVal) => {
    if (newVal) {
      if (!defaultAccountStore.defaultAccountData.max_campaign_status) {
        defaultAccountStore.defaultAccountData.max_campaign_status = ONOFF.ON
      }
    } else {
      defaultAccountStore.defaultAccountData.max_campaign_status = null
    }
  }
)
watch(
  () =>
    defaultAccountStore.defaultAccountData.category_allocation === ONOFF.OFF ||
    defaultAccountStore.defaultAccountData.global === ONOFF.OFF,
  (newVal) => {
    if (newVal) {
      defaultAccountStore.defaultAccountData.max_campaign_status = null
    }
  }
)

const isStatus = computed(() => {
  if (defaultAccountStore.isFacebook) {
    return (
      defaultAccountStore.defaultAccountData.global === ONOFF.ON &&
      defaultAccountStore.defaultAccountData.category_allocation === ONOFF.ON
    )
  }
  if (defaultAccountStore.isGoogleAdsense) {
    return (
      defaultAccountStore.defaultAccountData.category_allocation === ONOFF.ON
    )
  }
  return false
})
</script>

<template>
  <div class="flex items-center gap-2" v-if="isStatus">
    <div class="w-32 font-bold text-xs">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="defaultAccountStore.defaultAccountData.max_campaign_status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
