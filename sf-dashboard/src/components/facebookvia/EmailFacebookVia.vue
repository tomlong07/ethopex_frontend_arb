<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="facebookConfig.showErr['email']"
  >
      <n-input
        v-model:value="facebookConfig.dataConfig.email"
        :loading="facebookConfig.statusData.isLoading"
        placeholder="Enter email"
        maxlength="100"
      />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const facebookConfig = useFacebookViaStore()
const name = 'Email'
</script>
