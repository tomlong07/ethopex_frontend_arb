<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const defaultAccountStore = useDefaultAccount()
const name = `Name`
</script>
<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="defaultAccountStore.showErr['name']"
  >
    <n-input
      v-model:value="defaultAccountStore.defaultAccountData.name"
      :placeholder="''"
    />
  </FloatingWrapper>
</template>
