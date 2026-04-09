<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const defaultAccountStore = useDefaultAccount()
const name = `Accounts`
</script>

<template>
 <FloatingWrapper
    :name="name"
    :required="true"
    :error="defaultAccountStore.showErr['accounts']"
  >
    <n-input
      v-model:value="defaultAccountStore.defaultAccountData.accounts"
      type="textarea"
      :placeholder="name"
      rows="10"
    />
  </FloatingWrapper>
</template>
