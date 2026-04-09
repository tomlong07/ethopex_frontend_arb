<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = addsenseAcountStore()

const name = 'Pub ID'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="dataConfig.adsenseAccountConfig.pub_id"
      placeholder="Pub ID"
      maxlength="100"
    />
  </FloatingWrapper>
</template>
