<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import CustomSwitch from '../common/CustomSwitch.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Category Allocation`

watch(
  () => defaultAccountStore.isGoogleAdsense || defaultAccountStore.isFacebook,
  (newVal) => {
    if (newVal) {
      if (!defaultAccountStore.defaultAccountData.category_allocation) {
        defaultAccountStore.defaultAccountData.category_allocation = ONOFF.OFF
      }
    } else {
      defaultAccountStore.defaultAccountData.category_allocation = null
    }
  }
)

watch(
  () => defaultAccountStore.defaultAccountData.global === ONOFF.OFF,
  (newVal) => {
    if (newVal) {
      defaultAccountStore.defaultAccountData.category_allocation = null
    }
  }
)
const isStatus = computed(() => {
  if (defaultAccountStore.isFacebook) {
    return defaultAccountStore.defaultAccountData.global === ONOFF.ON
  }
  if (defaultAccountStore.isGoogleAdsense) {
    return true
  }
  return false
})
</script>

<template>
  <div class="flex items-center gap-2" v-if="isStatus">
    <div class="w-32 font-bold text-xs">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="defaultAccountStore.defaultAccountData.category_allocation"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="!defaultAccountStore.permissionAsyncConfigs?.categoryAllocation"
      />
    </div>
  </div>
</template>
