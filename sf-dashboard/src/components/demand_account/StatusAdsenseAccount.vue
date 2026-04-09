<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import CustomSwitch from '../common/CustomSwitch.vue'
const dataConfig = addsenseAcountStore()
</script>
<template>
  <div class="flex-1 min-w-0">
    <div class="w-20 font-semibold mb-1 -mt-2 text-sm">Status</div>

    <CustomSwitch
      v-model="dataConfig.adsenseAccountConfig.status"
      :disabled="dataConfig.isLoading || dataConfig.isDisable"
      true-label="On"
      false-label="Off"
      size="medium"
    />
  </div>
</template>
