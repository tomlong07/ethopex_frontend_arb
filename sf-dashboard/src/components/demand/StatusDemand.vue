<script setup lang="ts">
import demainStore from '@/store/details/useDemainStore'
import CustomSwitch from '../common/CustomSwitch.vue'

const dataConfig = demainStore()
</script>

<template>
  <div class="flex my-4 items-center">
    <div class="mr-5 font-medium text-gray-400">Status</div>
    <CustomSwitch
      v-model="dataConfig.demandConfig.status"
      :disabled="dataConfig.isLoading || dataConfig.isDisable"
      type="onoff"
      true-label="On"
      false-label="Off"
      size="medium"
    />
  </div>
</template>
