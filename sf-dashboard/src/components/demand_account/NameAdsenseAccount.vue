<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = addsenseAcountStore()
const name = 'Name'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="dataConfig.adsenseAccountConfig.name"
      :loading="dataConfig.isLoading"
      :disabled="dataConfig.isLoading || dataConfig.isDisable"
    />
  </FloatingWrapper>
</template>
