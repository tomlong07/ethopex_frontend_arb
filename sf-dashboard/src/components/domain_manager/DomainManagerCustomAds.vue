<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const domainConfig = useDomainManagerStore()
</script>
<template>
  <FloatingWrapper name="Custom Ads.txt" rounded>
    <n-input
      v-model:value="domainConfig.dataConfig.custom_ads_txt"
      placeholder="Enter custom ads."
      type="textarea"
      :autosize="{
        minRows: 8,
        maxRows: 20,
      }"
    />
  </FloatingWrapper>
</template>
