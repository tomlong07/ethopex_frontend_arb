<script setup lang="ts">
import { useDefaultAccount } from '@/store/details/defaultAccount'
const defaultAccountStore = useDefaultAccount()
</script>

<template>
  <div class="flex ml-auto">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="defaultAccountStore.isSubmitBtnLoading"
      @click="defaultAccountStore.submitForm()"
    >
      Submit
    </n-button>
  </div>
</template>
