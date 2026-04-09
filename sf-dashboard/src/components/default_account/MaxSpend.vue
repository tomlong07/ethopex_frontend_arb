<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Max Spend`

const isStatus = computed(
  () => defaultAccountStore.defaultAccountData.max_spend_status === ONOFF.ON
)

watch(
  () => defaultAccountStore.defaultAccountData.max_spend_status === ONOFF.OFF,
  (newVal) => {
    if (newVal) {
      defaultAccountStore.defaultAccountData.max_spend = null
    }
  }
)
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="isStatus"
  >
    <n-input-number
      :min="0"
      max="1e6"
      v-model:value="defaultAccountStore.defaultAccountData.max_spend"
      :placeholder="''"
    >
      <template #prefix> $ </template></n-input-number
    >
  </FloatingWrapper>
</template>

