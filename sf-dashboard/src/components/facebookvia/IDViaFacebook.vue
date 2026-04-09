<template>
  <FloatingWrapper
    :name="name"
  >
    <n-input
      v-model:value="facebookConfig.dataConfig.id"
      :loading="facebookConfig.statusData.isLoading"
      placeholder="Enter ID Via"
      maxlength="100"
      :disabled="facebookConfig.modeData.isEditPage()"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const facebookConfig = useFacebookViaStore()
const name = 'ID Via'
</script>
