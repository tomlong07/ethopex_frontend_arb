<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'

import CustomSwitch from '../common/CustomSwitch.vue'
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

<template>
  <div class="flex">
    <div class="mr-5 flex items-center font-medium text-gray-400">Status</div>
    <CustomSwitch
      v-model="domainConfig.dataConfig.status"
      :disabled="domainConfig.isLoading || domainConfig.isDisable"
      type="onoff"
      true-label="On"
      false-label="Off"
    />
  </div>
</template>
