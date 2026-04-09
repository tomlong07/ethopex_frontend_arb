<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="facebookConfig.showErr['name']"
  >
    <n-input
      v-model:value="facebookConfig.dataConfig.name"
      :loading="facebookConfig.statusData.isLoading"
      placeholder="Enter name"
      maxlength="100"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const facebookConfig = useFacebookViaStore()
const name = 'Name'
</script>
