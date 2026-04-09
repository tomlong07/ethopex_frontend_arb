<template>
  <FloatingWrapper
    name="Status"
    required
    :error="dataConfig.showErr['status']"
  >
    <n-select
      v-model:value="dataConfig.fundsConfig.status"
      filterable
      placeholder="Select"
      :options="dataConfig.statusOptions"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import useFundsStore from '@/store/details/useFundsStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const dataConfig = useFundsStore()
</script>
