<template>
  <div class="flex gap-2">
    <FloatingWrapper name="Domain" rounded>
      <n-input
        v-model:value="domainConfig.dataConfig.domain"
        :loading="domainConfig.isLoading"
        :disabled="domainConfig.isLoading || domainConfig.isDisable"
        placeholder="Name of domain"
        class="mb-2"
    /></FloatingWrapper>
  </div>
</template>
<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const domainConfig = useDomainManagerStore()
</script>
<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}

.input-custom-width-dm {
  width: calc(100% - 5rem);
}
</style>
