<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Max Campaign`

watch(
  () => defaultAccountStore.isGoogleAdsense || defaultAccountStore.isFacebook,
  (newVal) => {
    if (!newVal) {
      defaultAccountStore.defaultAccountData.max_campaign = null
    }
  }
)

watch(
  () =>
    defaultAccountStore.defaultAccountData.max_campaign_status === ONOFF.OFF ||
    defaultAccountStore.defaultAccountData.category_allocation === ONOFF.OFF ||
    defaultAccountStore.defaultAccountData.global === ONOFF.OFF,
  (newVal) => {
    if (newVal) {
      defaultAccountStore.defaultAccountData.max_campaign = null
    }
  }
)
const isStatus = computed(() => {
  if (defaultAccountStore.isFacebook) {
    return (
      defaultAccountStore.defaultAccountData.global === ONOFF.ON &&
      defaultAccountStore.defaultAccountData.category_allocation === ONOFF.ON &&
      defaultAccountStore.defaultAccountData.max_campaign_status === ONOFF.ON
    )
  }
  if (defaultAccountStore.isGoogleAdsense) {
    return (
      defaultAccountStore.defaultAccountData.max_campaign_status === ONOFF.ON
    )
  }
  return false
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="isStatus"
  >
    <n-input-number
      :min="0"
      max="1e4"
      v-model:value="defaultAccountStore.defaultAccountData.max_campaign"
      :placeholder="''"
    />
  </FloatingWrapper>
</template>
