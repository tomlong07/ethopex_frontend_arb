<template>
  <div class="flex items-center">
    <div class="w-20 font-bold">Gam ID</div>
    <div class="input-custom-width-ads flex flex-col">
      <n-input
        v-model:value="dataConfig.adsenseAccountConfig.gam_id"
        placeholder="Gam ID"
        maxlength="100"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
const dataConfig = addsenseAcountStore()
</script>
<style scoped lang="scss">
.input-custom-width-ads {
  width: calc(100% - 5rem);
}
</style>
