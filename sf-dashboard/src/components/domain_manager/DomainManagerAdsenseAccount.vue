<template>
  <div class="flex gap-2">
    <div class="w-40 font-bold">Adsense Accounts</div>
    <div class="w-[calc(100%-10rem)]">
      <n-select
        v-model:value="domainConfig.dataConfig.adsense_accounts"
        multiple
        clearable
        placeholder="All"
        filterable
        value-field="id"
        label-field="name"
        :disabled="domainConfig.isLoading || domainConfig.isDisable"
        :options="domainConfig.adsenseAccountOptions"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'

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
