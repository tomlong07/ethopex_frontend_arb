<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = addsenseAcountStore()

const name = 'API Key'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      :input-props="{ autocomplete: 'new-password' }"
      v-model:value="dataConfig.adsenseAccountConfig.api_key"
      :loading="dataConfig.isLoading"
      :disabled="dataConfig.isLoading || dataConfig.isDisable"
      placeholder="API Key"
      type="password"
      show-password-on="click"
    />
  </FloatingWrapper>
</template>
