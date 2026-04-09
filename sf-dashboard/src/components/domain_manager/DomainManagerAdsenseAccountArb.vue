<template>
  <FloatingWrapper name="Adsense Content Arb" rounded>
    <n-select
      v-model:value="domainConfig.dataConfig.adsense_content_arb"
      clearable
      placeholder=""
      filterable
      value-field="id"
      label-field="name"
      :disabled="domainConfig.isLoading || domainConfig.isDisable"
      :options="domainConfig.adsenseAccountOptions"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const domainConfig = useDomainManagerStore()

onMounted(async () => {
  domainConfig.fetchAdsenseAccountOption()
})
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
