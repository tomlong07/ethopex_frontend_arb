<script setup lang="ts">
import { useGlobalConfig } from '@/store/details/globalConfig'
import CustomSwitch from '../common/CustomSwitch.vue'

const globalConfigStore = useGlobalConfig()

const name = `Auto Enable`
</script>

<template>
  <div class="flex items-center">
    <div class="w-24 font-bold text-xs text-gray-500">{{ name }}</div>
    <div class="w-[calc(100%-12rem)]">
      <CustomSwitch
        v-model="globalConfigStore.globalConfigData.status_campaign"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
