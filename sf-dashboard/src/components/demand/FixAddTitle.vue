<script setup lang="ts">
import demainStore from '@/store/details/useDemainStore'
import CustomSwitch from '../common/CustomSwitch.vue'

const dataConfig = demainStore()
</script>

<template>
  <div class="flex my-4 items-center">
    <div class="mr-5 font-medium text-gray-400">Fixed AdTitle</div>
    <CustomSwitch
      v-model="dataConfig.demandConfig.fixed_adtitle"
      :disabled="dataConfig.isLoading || dataConfig.isDisable"
      type="onoff"
      true-label="On"
      false-label="Off"
      size="medium"
    />
  </div>
</template>
